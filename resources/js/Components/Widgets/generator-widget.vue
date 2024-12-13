<script setup lang="ts">

import type {GeneratorInterface, QuestionInterface} from "@/types/modelInterfaces.ts"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {computed, onMounted, ref} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"
import {ChallengeAnswerInterface} from "@/Components/Challenges/ChallengeGame.vue"

const props = defineProps<{
	illustration: WidgetInterface
}>()

const generator = ref<GeneratorInterface|false>(false)
const counter = ref(0)

const theQuestion = computed(() => {
	if (!generator.value) {
		return false
	}

	if (counter.value >= 0) {
		return useGenerator(generator.value).question()
	}

	return false
})

function nextQuestion(checkerResult: ChallengeAnswerInterface): void {
	if (checkerResult.result) counter.value++
}


onMounted(() => {
	axios.get(route('generators.find', [props.illustration.parameters]))
		.then(res => {
			generator.value = res.data
			console.log(generator.value)
		})
		.catch(err => console.error(err))
})

</script>

<template>
	<question-show
		v-if="generator!==false"
		:key="`question-${counter}`"
		:question="theQuestion as QuestionInterface"
		class="max-w-[40em] mx-auto min-h-[500px] border border-gray-400"
		is-dynamic
		show-input
		@validate="nextQuestion"
	/>
</template>

<style scoped>

</style>
