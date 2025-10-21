import {getModule, MODULE_TYPES} from "@/scolcours.js"
import {ref, unref} from "vue"
import {keyboardKeys, keyboardMaps, KeyboardObjectType, keyboards} from "@/Composables/keyboardConfig.ts"
import {questionValidatorInterface} from "@/Components/Questions/QuestionInterface.ts"
import {PiChecker} from "@/Checkers"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

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
		case "matrix":
			return "Matrix"
		case "draw":
			return "Draw"
		default:
			return "Basic"
	}
}

function getComponent(kbrd: string) {
	return getModule(`Keyboard${kbrd}`, MODULE_TYPES.KEYBOARD)
}

export function getOneKeyboard(kbrd: string): Partial<questionValidatorInterface> {
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
	config = getKeyboardConfig(value)

	if (config === undefined && options.length > 0) {
		options.forEach((option) => {
			if (config === undefined) {
				config = getKeyboardConfig(option)
			}
		})
	}

	if (config === undefined) {
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
		keyboard: {
			name,
			parameters,
			values,
			config,
			component: getComponent(name),
		},
		checker: {
			name,
			checker: new PiChecker(`${value},${options.join(',')}`),
			checkerOverride
		}
	}
}

function getKeyboardConfig(key: string): KeyboardObjectType {

	if (Object.hasOwn(keyboards, key)) {
		return keyboards[key]
	} else if (Object.hasOwn(keyboards, keyboardMaps(key))) {
		return keyboards[keyboardMaps(key)]
	}

	return undefined
}

function getKeyboards(kbrdCode: string): Partial<questionValidatorInterface>[] {
	const unrefKbrd = unref(kbrdCode)

	if (!unrefKbrd) return null
	return unrefKbrd.split("\n\n").map(kbrd => getOneKeyboard(kbrd))
}

export function useKeyboard() {

	const keyboardInput = ref<KeyboardInputInterface>({input: "", tex: "", raw: ""})

	function reset() {
		keyboardInput.value = {input: "", tex: "", raw: ""}
	}

	// Return the available functions
	return {
		keyboardInput, 			// contains the values exposed by the keyboard.
		getKeyboards, 			// Main function to recover a keyboard with all it's functionality
		keyboardKeys, 			// Keyboard keys configuration
		keyboards,				// List of all available "basic" keyboards with their configuration
		reset
	}
}
