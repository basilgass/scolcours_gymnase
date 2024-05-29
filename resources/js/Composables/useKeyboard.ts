import { Component, unref } from "vue"
import { keyboardKeys, keyboardMaps, KeyboardObjectType, keyboards } from "@/Composables/keyboardConfig"
import { getModule, MODULE_TYPES } from "@/scolcours.js"
import { getChecker } from "@/Composables/checkersConfig"
import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

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

export interface KeyboardInterface {
	name: string;
	checker: CheckerAbstract;
	checkerOverride?: { [Key: string]: string };
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
		checkerOverride: { [Key: string]: string } = {}

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
				checkerOverride[key] = values.join('?')
			}
			parameters.push(k.substring(1))
		})

	// All other values
	kbrdValues.filter(x => !x.startsWith("@"))
		.forEach(k => {
			values.push(k)
		})


	console.log('options', options);

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

export function useKeyboard(props?) {
	function loadAnswerToKeyboard(value: string, reset: () => void, changeCallback: (value?: string) => void, callback: (value: string) => void): void {
		reset()

		if (value === null) {
			changeCallback()
			return
		}

		if (value === undefined) value = props.answer

		// show always only the first value
		const firstvalue = value.split("||")[0]
		callback(firstvalue)

		changeCallback(firstvalue)
	}

	// Return the available functions
	return {
		getKeyboards, 			// Main function to recover a keyboard with all it's functionality
		keyboardKeys, 			// Keyboard keys configuration
		keyboards,				// List of all available "basic" keyboards with their configuration
		getComponent,			// Get the component of the keyboard given by name
		loadAnswerToKeyboard 	// load the answer to the keyboard
	}
}
