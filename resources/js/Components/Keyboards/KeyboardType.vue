<template>
	<div class="space-y-5">
		<div class="flex flex-wrap gap-2 justify-center bg-white px-5 py-3 text-lg">
			<div
				v-for="(key, index) in resultLetters"
				:key="`found-${index}`"
				:class="{
					'p-2 w-8 border-b-2 border-gray-200': key.key!==' ',
					'p-0 w-3': key.key===' ',
					'bg-white': key.key !== ' ' && index!==currentIndex,
					'is-active': index===currentIndex
				}"
				class="text-center text-lg font-code h-[2.5em]"
			>
				<span
					v-show="key.visible"
					v-text="key.key"
				/>
			</div>
		</div>

		<div class="text-sm text-gray-800 text-center">
			cliquer sur les lettres ci-dessous pour former le mot
		</div>
		<div
			ref="typoButtons"
			class="keyboard flex flex-wrap gap-4 justify-center"
		>
			<button
				v-for="(key, index) in answerLetters"
				:key="`${key.key}-${index}`"
				:class="{
					'bg-white hover:scale-105 hover:shadow': !key.used,
					'bg-gray-200 disabled text-gray-400 cursor-not-allowed': key.used
				}"
				class="p-2 w-14 h-14 border border-gray-200 rounded transition-all"
				@click="key.used?'':validateKey(index)"
			>
				{{ key.key }}
			</button>
		</div>
	</div>
</template>

<script setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {nextTick, onMounted, ref} from "vue"
import {PiMath} from "pimath/esm"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value)
	},
	changeEvent = async function (value) {
		await nextTick()
		emits("change", {
			tex: "",
			raw: props.answer
		})
	},
	validateEvent = function (value) {
		emits("validate", {
			code: props.answer,
			tex: "",
			raw: props.answer,
			correct: true,
			message: ""
		})
	},
	getTex = function (value) {
		return ""
	},
	getRaw = function (value) {
		return value
	},
	getAnswer = function(value){
		return {
			tex: getTex(value),
			raw: getRaw(value)
		}
	}
defineExpose({resetKeyStrokes, wrongAnswer, getAnswer})

/* ------------------*/
let typoButtons = ref(null),
	excludeLetters = ref([" ", ",", "'", ".", "!", "?", "(", ")", "-"]),
	answerLetters = ref([]),
	resultLetters = ref([]),
	buildResult = function () {
		let theWord = props.answer

		answerLetters.value = PiMath.Random.shuffle(theWord.split("")
			.filter(key => excludeLetters.value.indexOf(key) === -1)
			.map(key => {
				return {
					key: key.toUpperCase(),
					used: false
				}
			})
		)

		resultLetters.value = theWord.split("").map((key, index)=>{
			return {
				index,
				key: key.toUpperCase(),
				visible: excludeLetters.value.indexOf(key) !== -1
			}
		})

		// Tell we are watching the first letter
		currentIndex.value = 0
	},
	currentIndex = ref(-1),
	validateKey = function (index) {
		if (resultLetters.value[currentIndex.value].key === answerLetters.value[index].key) {
			resultLetters.value[currentIndex.value].visible = true
			answerLetters.value[index].used = true

			// finished ?
			currentIndex.value++
			if (currentIndex.value >= resultLetters.value.length) {
				validateEvent()
				return
			}
			while (resultLetters.value[currentIndex.value].visible) {
				currentIndex.value++
				if (currentIndex.value >= resultLetters.value.length) {
					validateEvent()
					return
				}
			}
		} else {
			useWrongAnswerAnimation(typoButtons.value.children[index])
		}
	}

onMounted(()=>{
	buildResult()
})
</script>
