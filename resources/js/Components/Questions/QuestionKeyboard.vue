<script lang="ts" setup>
import { computed, inject, ref } from "vue"
import { KeyboardInterface, useKeyboard } from "@/Composables/useKeyboard"
import QuestionAnswerSelector from "@/Components/Questions/QuestionAnswerSelector.vue"
import { questionDataInterface } from "@/Pages/Questions/QuestionShow.vue"
import { userAnswerInterface } from "@/types"
import QuestionValidation from "@/Components/Questions/QuestionValidation.vue"
import KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import { ChallengeAnswerInterface } from "@/Components/Challenges/ChallengeGame.vue"

// const props = defineProps({})
const questionData = inject<questionDataInterface>("questionData")

// Get the keyboard building system
const { getKeyboards } = useKeyboard()

// Define the emits
defineEmits<{
	validate: [event: ChallengeAnswerInterface]
}>()
/**
 * showInput can be:
 * force: always displayed, cannot be hidden
 * hidden: keyboard is not visible, but can be shown
 * show: keyboard is visible, and can be hidden
 */
const showInput = defineModel<"hidden" | "force" | "show">("showInput", { default: "hidden" })

/**
 * Keyboard data:
 * key: $a
 * keyboard: contains the name, the component, ...
 * answer: string
 */
interface questionAnswerInterface {
	key: string,
	keyboard: KeyboardInterface,
	answer: string
}

const keyboardAnswers = computed<questionAnswerInterface[]>(() => {
	// The keyboard is wrong...
	if (!questionData.question.keyboard) {
		return []
	}

	// Get the keyboards
	const arr = [],
		kbrds = getKeyboards(questionData.question.keyboard)

	questionData.answers.value.forEach((answer: string, index: number) => {
		arr.push({
			key: "$" + ("abcdefghijklmnopqrstuvwxyz"[index]), // may be undefined !
			keyboard: kbrds[Math.min(kbrds.length - 1, index)],
			answer: answer
		})
	})

	return arr
})

/**
 * Get the current keyboard based an answerId
 */
const currentKeyboard = computed<KeyboardInterface>(() => {
	if (!keyboardAnswers.value[questionData.answerId.value]) return null
	return keyboardAnswers.value[questionData.answerId.value].keyboard
})

/**
 * Get then format of the answer
 */
const answerFormat = computed(() => {
	// No keyboard for this answer...
	if (!keyboardAnswers.value[questionData.answerId.value]) return ""

	if (currentKeyboard.value.name === "Basic") {
		const customOutput = keyboardAnswers.value[
			questionData.answerId.value
			].keyboard.parameters
			.filter((x) => x.startsWith("format:"))
			.map((x) => x.split("format:")[1])[0]
		return (
			customOutput ??
			currentKeyboard.value.checker.format
		)
	}

	// TODO: expose the checker format for other keyboard that "Basic"s

	return ""
})

// Answers management.

function updateQuestion(event: userAnswerInterface) {
	questionData.user.answers.value[questionData.answerId.value] = event
}

// Update the keyboard on question global data.
const keyboardUI = ref<InstanceType<typeof KeyboardBasic>>(null)
defineExpose({
	getKeyboard() {
		return keyboardUI.value
	}
})
</script>

<template>
	<div class="question-keyboard-wrapper">
		<!-- answer format -->
		<div
			v-katex.auto="answerFormat"
			class="text-center text-xs text-gray-500 my-2"
		/>

		<!-- user input toggle buttons -->
		<div
			v-if="showInput!=='force'"
			class="text-right text-sm py-3 px-3"
		>
			<button
				v-if="showInput==='hidden'"
				v-theme.bg.text
				class="flex gap-2 justify-center items-center mx-auto px-2 py-2 rounded-xl shadow hover:shadow-none w-full"
				@click="showInput='show'"
			>
				<i class="text-xl bi bi-calculator" /><span class="hidden md:inline-block"> donner la réponse</span>
			</button>
			<button
				v-else
				class="px-5 group text-red-600"
				@click="showInput = 'hidden'"
			>
				fermer
				<i
					class="bi bi-x-lg inline-block ml-2 group-hover:rotate-180 transition-all transform duration-500 ease-in-out"
				/>
			</button>
		</div>

		<div
			v-show="showInput==='show'"
			class="px-3"
		>
			<!-- answerId selector -->
			<question-answer-selector
				:answers-number="questionData.answers.value.length"
			/>

			<question-validation
				@validate="$emit('validate', $event )"
			/>

			<!-- keyboard component -->
			<component
				:is="currentKeyboard.component"
				v-if="currentKeyboard && currentKeyboard.name !== ''"
				:key="questionData.answerId.value"
				ref="keyboardUI"
				:answer="keyboardAnswers[questionData.answerId.value].answer"
				:keyboard="currentKeyboard"
				@change="updateQuestion"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
