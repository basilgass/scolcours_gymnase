<script setup>

import {PiMath} from "pimath/esm"
import {computed, onMounted, ref} from "vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

let props = defineProps({
	challenge: {type: Object, required: true},
	slug: {type: String, required: true}
})

let showTraining = ref(false)

let currentGenerator = computed(() => {
		return props.challenge.generators.filter(g => g.slug === props.slug)[0]
	}),
	question = ref({}),
	counter = ref(0)

let generateQuestion = function () {
		if (currentGenerator.value !== undefined) {
			counter.value++
			let F = new Function("PiMath", currentGenerator.value.code)

			question.value = F(PiMath)
		}
	},
	nextQuestion = function (checkerResult) {
		if (checkerResult.result) {
			generateQuestion()
		}
	},
	theQuestion = computed(()=>{
		if(question.value.question===undefined){return false}

		return {
			block: {
				body: props.challenge.output
					.replace(
						"question",
						question.value.question
					)
					.replace("answer", "$a"),
				illustrations: [],
			},
			keyboard: question.value.keyboard ? question.value.keyboard : props.challenge.keyboard,
			answer: "" + question.value.answer,
			user: {
				correct: false,
			},
		}
	})

onMounted(()=>{generateQuestion()})
</script>

<template>
	<div v-if="theQuestion">
		<question-show
			:key="`question-${counter}`"
			:question="theQuestion"
			class="max-w-[40em] mx-auto border-0"
			dynamic
			show-input
			@validate="nextQuestion"
		/>
	</div>
</template>

<style scoped>

</style>
