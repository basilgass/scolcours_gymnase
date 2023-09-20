// import {getComponentKeyboardName, getKeyboardName} from "@/keyboards"
import {unref} from "vue"
import {keyboardKeys, keyboardMaps, keyboards} from "@/Composables/keyboardConfig"
import {getModule, MODULE_TYPES} from "@/scolcours.js";
import {getChecker} from "@/Composables/checkersConfig";

function getComponentKeyboardName(value) {
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

function getComponent(kbrd) {
    return getModule(`Keyboard${kbrd}`, MODULE_TYPES.KEYBOARD)
}

function getOneKeyboard(kbrd) {
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
	let name = "",
		checker,
		parameters = [],
		values = [],
		config,
		component= null

	// Split as each lines.
	const kbrdValues = kbrd.split("\n")

	// The first line is the keyboard name or checker
	// Qcm or nb,2 for example
	let [value, ...options] = kbrdValues.shift().split(",")

	// Make sure the value does not contain extra spaces or hidden \r \n
	value = value.trim()
	options = options ?? []

	// Get the component name (keyboard name or Basic)
	name = getComponentKeyboardName(value)

	// If it's a basic keyboard
	// if (name === "Basic") {

	// Get the checker for this keyboard.
	checker = getChecker(value, options)

	// Get the display config for this keyboard.
	if(keyboards.hasOwnProperty(value)){
		config = keyboards[value]
	}else if(keyboards.hasOwnProperty(keyboardMaps(value))){
		config = keyboards[keyboardMaps(value)]
	}else{
		config = keyboards["exact"]
	}

	// }

	// Add the parameters (all starting with @)
	kbrdValues
		.filter(x => x.startsWith("@"))
		.forEach(k => {
			parameters.push(k.substring(1))
		})


	// All other values
	kbrdValues.filter(x => !x.startsWith("@"))
		.forEach(k => {
			values.push(k)
		})

	return {
		name,
		checker,
		parameters,
		values,
		config,
		component: getComponent(name)
	}

}

function getKeyboards(kbrdCode) {
	let unrefKbrd = unref(kbrdCode)

	if (!unrefKbrd) return null
	return unrefKbrd.split("\n\n").map(kbrd => getOneKeyboard(kbrd))
}

export function useKeyboard(props?) {
	function loadAnswerToKeyboard(value, reset, changeCallback, callback) {
		reset()

		if (value === null) {
			changeCallback()
			return
		}

		if (value === undefined) value = props.answer

		callback(value)

		changeCallback(value)
	}

	// Return the available functions
	return {
		getKeyboards, 			// Main function to recover a keyboard with all it's functionality
		keyboardKeys, 			// Keyboard keys configuration
		keyboards,				// List of all available "basic" keyboards with their configuration
		getComponent,			// Get the component of the keyboard given by name
		loadAnswerToKeyboard, 	// load the answer to the keyboard
	}
}
