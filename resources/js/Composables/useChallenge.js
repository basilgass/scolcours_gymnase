/** Challenge process.
 *	Init: generateQuestion
 *	onValidate:
 *	- checkAnswer : add a line to the results
 * 	- if(false): 	handle maxPoints/lives/
 * 	- if(true):
 */

import {onMounted, ref} from "vue"


export function useChallenge(generateQuestion, check=null, format=null, reset=null) {

	// Active variables
	let question = ref({question: "", answer: "", data: null}),
		answer = ref(""),			// the answer given by the user
		points = ref(0),				// current number of maxPoints and how to handle them
		lives = ref(3),
		results = ref([]),			// list of given results - simple list display.
		keyboard = ref(null)

	onMounted(()=>{
		question.value = generateQuestion()
	})
	/**
	 * Validation system
	 * @param config
	 */
	function validate() {
		let result = checkAnswer(formatResult)

		// Store the current results.
		results.value.push(result)

		if (result.correct) {
			// Make a new question
			resetInputs()
			points.value++
			question.value = generateQuestion()
		} else {
			// TODO: handle penalties of an error, with lives
			points.value = 0
			// Emit an error
		}
	}

	/**
	 * Reset the user input
	 */
	function resetInputs() {
		if(reset!==null){
			reset()
			return
		}

		if (keyboard.value) {
			keyboard.value.resetKeyStrokes()
		}
	}

	/**
	 * Display output of the result
	 * @returns {string}
	 */
	function formatResult() {
		if(format!==null){
			return format()
		}

		return `${question.value.tex} = ${answer.value}`
	}

	/**
	 * Check the answer. By default, it's a string to string compare.
	 * @returns {{correct: boolean, tex: string, text: string}}
	 */
	function checkAnswer() {
		if(check!==null){
			return check()
		}

		return {
			tex: `${question.value.tex} = ${answer.value}`,
			text: "",
			correct: question.value.answer === answer.value.trim()
		}
	}

	return {
		question, answer, points, lives, results, keyboard,
		validate
	}
}
