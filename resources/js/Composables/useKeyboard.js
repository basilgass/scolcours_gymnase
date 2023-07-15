// import {getComponentKeyboardName, getKeyboardName} from "@/keyboards"
import {useCheckers} from "@/Composables/useCheckers"
import {defineAsyncComponent, unref} from "vue"
import {keyboardKeys, keyboardMaps, keyboards} from "@/Composables/keyboardConfig"

export function useKeyboard(props) {
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
			return ""
		}
	}

	function getKeyboardName(value) {
		// Basic keyboard
		if (value === null || keyboards[keyboardMaps(value)]) {
			return "Basic"
		}

		// Component keyboard
		return getComponentKeyboardName(value)
	}

	function getKeyboards(kbrdCode) {
		let unrefKbrd = unref(kbrdCode)

		if (!unrefKbrd) {
			return null
		}
		/* A kbrdCode is defined like this:
		*
		 * keyboard name					-> name
		 *    or [checker[@checkerParams]]	-> checker: {name, options)
		 * @letters (for 'basic keyboard') or special keys / commands -> parameters
		 * Other parameters...				-> values: []
		 *
		 * new keyboard
		 */

		let arr = []

		unrefKbrd.split("\n\n").forEach(kbrd => {
			let checker,
				parameters = [],
				values = [],
				kbrdValues = kbrd.split("\n"),
				config

			// The first line is the keyboard name or checker
			// Qcm or nb@2 for example
			let [value, options] = kbrdValues.shift().split("@")

			// Make sure the value does not contain extra spaces or hidden \r \n
			value = value.trim()

			// Get the component name (if exist)
			let name = getComponentKeyboardName(value)

			// If it's a basic keyboard
			if (name === "") {
				name = getKeyboardName(value)
				options = options ? options.split(",") : []

				// Get the checker for this keyboard.
				checker = useCheckers([value, ...options].join(","))

				// Get the config for this keyboard.
				if(keyboards.hasOwnProperty(value)){
					config = keyboards[value]
				}else if(keyboards.hasOwnProperty(checker.name)){
					config = keyboards[checker.name]
				}else {
					config = keyboards["exact"]
				}
			}

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

			arr.push({
				name,
				checker,
				parameters,
				values,
				config,
				component: getComponent(name)
			})
		})

		console.log(arr)
		return arr
	}

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

	function getComponent(kbrd) {
		// TODO: Make a check on the name to make sur the component exists.
		return defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${kbrd}`))
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
