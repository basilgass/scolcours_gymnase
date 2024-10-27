import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { CheckerResult, getChecker } from "@/Composables/checkersConfig"
import { keyboardKeys, keyboardMaps, KeyboardObjectType, keyboards } from "@/Composables/keyboardConfig"
import { getModule, MODULE_TYPES } from "@/scolcours.js"
import { Component, ref, unref } from "vue"

/**
 * Get the keyboard name for a given component value.
 *
 * @param {string} value - The component value.
 * @return {string} The keyboard name for the component value.
 *
 * @example
 * getComponentKeyboardName("tos"); // returns "TableOfSigns"
 * getComponentKeyboardName("study"); // returns "Study"
 * getComponentKeyboardName("abc"); // returns "Basic"
 */
function getComponentKeyboardName(value: string): string {
	switch (value.toLowerCase()) {
		case "tos":
		case "tableofsigns":
			return "TableOfSigns"
		case "study":
			return "Study"
		case "order":
			return "Order"
		case "qcm":
			return "Qcm"
		case "input":
			return "Input"
		case "type":
			return "Type"
		default:
			return "Basic"
	}
}

function getComponent(kbrd: string) {
	return getModule(`Keyboard${kbrd}`, MODULE_TYPES.KEYBOARD)
}

export interface KeyboardPropsInterface {
	answer: string,
	keyboard: KeyboardInterface
}

export interface KeyboardEmitsInterface {
	(e: "change", value: KeyboardOnChangeInterface),

	(e: "validate")
}

export interface KeyboardInputInterface {
	input: string,
	tex: string,
	raw: string
}

export interface KeyboardOnChangeInterface {
	value: KeyboardInputInterface,
	validation: CheckerResult
}

export interface KeyboardInterface {
	name: string;
	checker: CheckerAbstract;
	checkerOverride?: Record<string, string>;
	parameters: string[];
	values: string[];
	config: KeyboardObjectType;
	component: Component | null;
}

function getOneKeyboard(kbrd: string): KeyboardInterface {
	/* A kbrd code is defined like this:
	*
	 * keyboard name					-> name
	 *    or [checker[,checkerParams]]	-> checker: {name, config)
	 * @letters (for 'basic keyboard') or special keys / commands -> parameters
	 * Other parameters...				-> values: []
	 *
	 * new keyboard
	 */
	// The first line is the keyboard name or checker
	// Qcm or nb,2 for example

	// output values, with defaults
	let config: KeyboardObjectType

	const parameters: string[] = [],
		values: string[] = [],
		checkerOverride: Record<string, string> = {}

	// Split as each lines.
	const kbrdValues = kbrd.split("\n")

	// The first line is the keyboard name or checker
	// Qcm or nb,2 for example
	let [value, ...options] = kbrdValues.shift().split(",")

	// Make sure the value does not contain extra spaces or hidden \r \n
	value = value.trim()
	options = options ?? []

	// Get the display config for this keyboard.
	if (Object.hasOwn(keyboards, value)) {
		config = keyboards[value]
	} else if (Object.hasOwn(keyboards, keyboardMaps(value))) {
		config = keyboards[keyboardMaps(value)]
	} else {
		config = keyboards["exact"]
	}

	// Add the parameters (all starting with @)
	kbrdValues
		.filter(x => x.startsWith("@"))
		.forEach(k => {
			if (k.substring(1).startsWith("if ")) {
				// Special case for the "if" command
				// @if key?value
				// remove the "@if " and split the key and value. The value may also contain a "?"
				const [key, ...values] = k.substring(4).split("?")
				checkerOverride[key] = values.join("?")
			}
			parameters.push(k.substring(1))
		})

	// All other values
	kbrdValues.filter(x => !x.startsWith("@"))
		.forEach(k => {
			values.push(k)
		})


	const name = getComponentKeyboardName(value)
	return {
		name,
		checker: getChecker(value, options),
		checkerOverride,
		parameters,
		values,
		config,
		component: getComponent(name)
	}

}

function getKeyboards(kbrdCode: string): KeyboardInterface[] {
	const unrefKbrd = unref(kbrdCode)

	if (!unrefKbrd) return null
	return unrefKbrd.split("\n\n").map(kbrd => getOneKeyboard(kbrd))
}

export function useKeyboard(
	props?: KeyboardPropsInterface,
	onKeyboardChange?: (event: string | KeyboardInputInterface) => void
) {

	const keyboardInput = ref<KeyboardInputInterface>({ input: "", tex: "", raw: "" })

	function reset() {
		keyboardInput.value = { input: "", tex: "", raw: "" }
	}

	function loadAnswer(value: string, config?: {
		reset?: () => void,
		callback?: (value?: string) => void
	}) {
		// Reset the current value
		if (config?.reset) {
			config.reset()
		} else {
			reset()
		}

		// if value is null, reset the display
		if (value === null) {
			onKeyboardChange(null)
			return
		}

		// if value is undefined, set the value to the answer.
		if (value === undefined && props) {
			value = props.answer
		}

		// show always only the first value
		const first_value = value.split("||")[0]
		if (config?.callback) {
			config.callback(first_value)
		}

		// Emit change
		onKeyboardChange(first_value)
	}


	// Return the available functions
	return {
		keyboardInput, 			// contains the values exposed by the keyboard.
		getKeyboards, 			// Main function to recover a keyboard with all it's functionality
		keyboardKeys, 			// Keyboard keys configuration
		keyboards,				// List of all available "basic" keyboards with their configuration
		getComponent,			// Get the component of the keyboard given by name
		loadAnswer,				// load the answer to the keyboard
		reset
	}
}
