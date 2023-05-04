<template>
	<keyboard-validate-button
		ref="validateButton"
		@validate="validateEvent"
	/>
	<keyboard-element
		v-if="theKeyboard"
		ref="keyboardUI"
		:keyboard="theKeyboard.name"
		:multiple="multiple"
		:extra-letters="theKeyboard.letters"
		back
		class="max-w-xl mx-auto"
		key-class="bg-white"
		reset
		@change="changeEvent"
	/>
</template>

<script setup>
import { useWrongAnswerAnimation } from "@/Composables/useHelpers"
import { computed, inject, ref } from "vue"
import KeyboardElement from "@/Components/Keyboards/KeyboardElement.vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import { useCheckers } from "@/Composables/useCheckers"
import { keyboards } from "@/keyboards"

let props = defineProps({
	options: { type: String },
	answer: { type: String },
})

let emits = defineEmits(["change", "validate"])
let checkerFormat = inject("checkerFormat")

let validateButton = ref(null),
	keyboardUI = ref(null),
	resetKeyStrokes = function () {
		keyboardUI.value.resetKeyStrokes()
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value.$el)
	},
	changeEvent = function (value) {
		givenAnswer.value = value
		// value = result from the keyboard as ascii or...
		emits("change", {
			tex: value.tex,
			raw: "",
		})
	},
	validateOneAnswer = function (expected, given, kbrd) {
		let check,
			stackMessages = []
		for (let expected of expected.split("|")) {
			// Get the check
			check = kbrd.checker.check(expected, given)
			if (check.result) {
				// If check if true, it's the only one
				return true
			} else {
				// if check is false, stack it
				stackMessages.push(check.message)
			}
		}
		return stackMessages.join("<span class=\"font-semibold\"> ou </span>")
	},
	validateEvent = function () {
		// With the Basic keyboard, allow to have more than one answer...
		let stackMessages = [],
			check

		// Go through each answers
		let expectedArray = props.answer.split(","),
			givenArray = givenAnswer.value.input.split(",")

		if (expectedArray.length === givenArray.length) {
			for (let i = 0; i < expectedArray.length; i++) {
				const validatedValue = validateOneAnswer(
					expectedArray[i],
					givenArray[i],
					makeKeyboard(i)
				)

				if (validatedValue !== true) {
					let preMessage = multiple.value
						? `<b class="font-semibold">${i + 1}e réponse: </b>`
						: ""
					stackMessages = [
						...stackMessages,
						preMessage + validatedValue,
					]
				}
			}
		} else {
			if (expectedArray.length > givenArray.length) {
				stackMessages.push(
					`il manque encore ${
						expectedArray.length - givenArray.length
					} réponse(s)`
				)
			} else {
				stackMessages.push(
					`il y a ${
						givenArray.length - expectedArray.length
					} réponse(s) en trop`
				)
			}
		}

		if (stackMessages.length > 0) {
			wrongAnswer()
		}

		//TODO: Make it handle multiple answer with numbering.
		emits("validate", {
			code: givenAnswer.value.input,
			tex: givenAnswer.value.tex,
			raw: "",
			correct: stackMessages.length === 0,
			message: stackMessages.filter((x) => x !== "").join("<br/>"),
		})
	},
	getTex = function (value) {
		//TODO: remove it ?
		return theKeyboard.value.keyboard.tex(value)
	},
	getRaw = function (value) {
		return ""
	},
	getAnswer = function (value) {
		return {
			tex: getTex(value),
			raw: getRaw(value),
		}
	}
defineExpose({ resetKeyStrokes, wrongAnswer, getAnswer })

// ---------------------------------------
let availableKeyboards = computed(() => {
		let nb = props.answer.split(",").length,
			kbrds = props.options.split("\n\n") ?? []

		if (kbrds.length < nb) {
			const lastKbrd = kbrds[kbrds.length - 1]
			// duplicate the last entries
			while (kbrds.length < nb) {
				kbrds.push(lastKbrd)
			}
		}
		return kbrds
	}),
	makeKeyboard = function (id) {
		// keyboard@checker,params
		// other keyboard parameters ?
		let kbrd =
				availableKeyboards.value[
					Math.min(availableKeyboards.value.length - 1, id)
				]?.split("\n"),
			// checker = kbrd[0].split("@"),
			// name = checker.shift(),
			letters = "",
			parameters = []

		// Get the keyboard name and the checker
		let [name, checker] = kbrd[0].split("@")
		if (checker === undefined) {
			// means the checker is implicit with the keyboard.
			let nameWithParams = name.split(",")
			name = checker = nameWithParams.shift()
			parameters = parameters.concat(...nameWithParams)
		}

		if (kbrd.length > 1) {
			// More parameters.
			for (let i = 1; i < kbrd.length; i++) {
				if (kbrd[i].startsWith("@")) {
					letters = kbrd[i].substring(1)
				} else {
					parameters.push(kbrd[i])
				}
			}
		}

		if (!keyboards.hasOwnProperty(name)) {
			name = "exact"
		}

		checker = useCheckers([checker, ...parameters].join(","))

		checkerFormat.update(checker.format())

		return {
			name,
			keyboard: keyboards[name],
			checker,
			letters,
			parameters,
		}
	},
	answerNumber = ref(1),
	multiple = ref(props.answer.split(",").length > 1),
	givenAnswer = ref("")

let theKeyboard = computed(() => {
	if (availableKeyboards.value.length === 0) {
		return false
	}

	return makeKeyboard(answerNumber.value)
})
</script>
