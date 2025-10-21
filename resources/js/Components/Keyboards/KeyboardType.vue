<script lang="ts" setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {Random} from "pimath"

import {onMounted, ref} from "vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	if (answerLetters.value.every(letter => letter.used)) {
		// TOOD: should trigger the validation button automatically.

	}

	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value !== undefined) {
		resultLetters.value.forEach((x) => {
			x.visible = value === props.reference
		})
	}

	const userAnswer = resultLetters.value.map(x => x.visible ? x.key : "").join("")

	return {
		input: userAnswer,
		tex: "",
		raw: userAnswer
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// no reset.
	},
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */


/* ------------------*/
const typoButtons = ref(null)
const excludeLetters = ref([" ", ",", "'", ".", "!", "?", "(", ")", "-"])
const answerLetters = ref<{ key: string, used: boolean }[]>([])
const resultLetters = ref<{ index: number, key: string, visible: boolean }[]>([])

const currentIndex = ref(-1)

function generateQuestion() {
	const theWord = props.reference

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
}

const validateKey = function (index) {
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
}

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
