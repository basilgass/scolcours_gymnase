import {keyboards} from "@/keyboards"
import {useCheckers} from "@/Composables/useCheckers"
import {inject} from "vue"

export function useKeyboard(props){
	// Do something !
	let questionHandler = inject("questionHandler")

	function makeKeyboard(kbrd, dft_kbrd="exact") {
		// keyboard@checker,params
		// other keyboard parameters ?
		let letters = "",
			parameters = []

		// Get the keyboard name and the checker
		let [name, checker] = kbrd.split("@")


		if (checker === undefined) {
			// means the checker is implicit with the keyboard.
			let nameWithParams = name.includes(",")?name.split(","):name.split("\n")
			name = checker = nameWithParams.shift()
			parameters = parameters.concat(...nameWithParams)
		}

		if (!keyboards.hasOwnProperty(name)) {
			name = dft_kbrd
		}

		checker = useCheckers([checker, ...parameters].join(","))

		questionHandler.format(checker.format())

		return {
			name,
			keyboard: keyboards[name],
			checker,
			letters,
			parameters,
		}
	}

	function loadAnswerToKeyboard(
		value, reset, changeCallback, callback, answer
	){
		reset()

		if(value===null) {
			changeCallback()
			return
		}

		if(value===undefined)value = props.answer

		callback(value)

		changeCallback(value)
	}
	return {makeKeyboard, loadAnswerToKeyboard}
}
