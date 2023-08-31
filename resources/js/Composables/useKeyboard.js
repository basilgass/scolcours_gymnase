// import {getComponentKeyboardName, getKeyboardName} from "@/keyboards"
import {checkersConfig} from "@/Composables/checkersConfig"
import {defineAsyncComponent, unref} from "vue"
import {keyboardKeys, keyboards} from "@/Composables/keyboardConfig"

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
	// TODO: Make a check on the name to make sur the component exists.
	return defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${kbrd}`))
}

function getOneKeyboard(kbrd) {
	/* A kbrd code is defined like this:
	*
	 * keyboard name					-> name
	 *    or [checker[,checkerParams]]	-> checker: {name, options)
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
	// Get the checker options (empty array if undefined)
	options = options ?? []

	// Get the checker for this keyboard.
	checker = checkersConfig([value, ...options].join(","))

	// Get the display config for this keyboard.
	config = keyboards.hasOwnProperty(value) ? keyboards[value] : keyboards["exact"]
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

export function useKeyboard(props) {
	function loadAnswerToKeyboard(value, reset, changeCallback, callback, answer) {
		// Load the answer to the keyboard... but... possible it can be removed for a better handling ?
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
