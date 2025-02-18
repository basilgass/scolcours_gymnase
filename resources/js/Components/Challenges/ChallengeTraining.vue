<script lang="ts" setup>
import { ChallengeAnswerInterface } from "@/Components/Challenges/ChallengeGame.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import { useGenerator } from "@/Composables/useGenerator"
import type { GeneratorInterface, QuestionInterface } from "@/types/modelInterfaces"
import { computed, PropType, ref } from "vue"

const props = defineProps({
	generator: {
		type: Object as PropType<GeneratorInterface>,
		required: true
	}
})

/**
 * The current question counter, used to updated correctly the question
 */
const counter = ref(0)

/**
 * Display the next question
 * @param checkerResult
 */
function nextQuestion(checkerResult: ChallengeAnswerInterface): void {
	if (checkerResult.result) counter.value++
}

/**
 * The current question generated
 */
const theQuestion = computed(() => {
	if (counter.value >= 0) {
		return useGenerator(props.generator).question()
	}
	return false
})

</script>

<template>
	<div v-if="theQuestion">
		<question-show
			:key="`question-${counter}`"
			:question="theQuestion as QuestionInterface"
			class="max-w-[40em] mx-auto min-h-[500px] border border-gray-400"
			is-dynamic
			show-input
			@validate="nextQuestion"
		/>
	</div>
</template>
