<script lang="ts" setup>

import { useWrongAnswerAnimation } from "@/Composables/useHelpers"
import { KeyboardEmitsInterface, KeyboardPropsInterface, useKeyboard } from "@/Composables/useKeyboard.ts"
import { Random } from "pimath"

import { nextTick, onMounted, ref } from "vue"

const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onKeyboardChange(): void {
	onChange()
}

const { loadAnswer } = useKeyboard(
	props,
	onKeyboardChange
)

const reset = function() {
	generateQuestion()
}

const onChange = async function() {
	await nextTick()

	// Get the answer
	const input = currentAnswer(),
		result = input.length === props.answer.length

	emits("change", {
		value: {
			input,
			tex: "",
			raw: input
		},
		validation: {
			result,
			message: ""
		}
	})

	if (result) {
		emits("validate")
	}
}

/* ------------------*/
const typoButtons = ref(null),
	excludeLetters = ref([" ", ",", "'", ".", "!", "?", "(", ")", "-"]),
	answerLetters = ref([]),
	resultLetters = ref([]),
	generateQuestion = function() {
		const theWord = props.answer

		answerLetters.value = Random.shuffle(theWord.split("")
			.filter(key => excludeLetters.value.indexOf(key) === -1)
			.map(key => {
				return {
					key: key.toUpperCase(),
					used: false
				}
			})
		)

		resultLetters.value = theWord.split("").map((key, index) => {
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
	validateKey = function(index) {
		if (resultLetters.value[currentIndex.value].key === answerLetters.value[index].key) {
			resultLetters.value[currentIndex.value].visible = true
			answerLetters.value[index].used = true

			// finished ?
			currentIndex.value++
			if (currentIndex.value >= resultLetters.value.length) {
				onChange()
				return
			}
			while (resultLetters.value[currentIndex.value].visible) {
				currentIndex.value++
				if (currentIndex.value >= resultLetters.value.length) {
					onChange()
					return
				}
			}
		} else {
			useWrongAnswerAnimation(typoButtons.value.children[index])
		}

		onChange()
	},
	currentAnswer = function() {
		return resultLetters.value.map(x => x.visible ? x.key : "").join("")
	}

defineExpose({
	reset,
	loadAnswer: (value) => {
		loadAnswer(value, {
				reset,
				callback: () => {
					resultLetters.value.forEach(letter => {
						letter.visible = true
					})

					answerLetters.value.forEach(letter => {
						letter.used = true
					})
				}
			}
		)
	},
	parameters: ""
})


onMounted(() => {
	generateQuestion()
})

</script>

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
					'bg-white hover:scale-105 hover:shadow-sm font-semibold': !key.used,
					'bg-gray-200 disabled text-gray-400 cursor-not-allowed': key.used
				}"
				class="p-2 w-14 h-14 border border-gray-200 rounded-sm transition-all"
				@click="key.used?'':validateKey(index)"
			>
				{{ key.key }}
			</button>
		</div>
	</div>
</template>
