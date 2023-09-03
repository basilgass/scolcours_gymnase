<script setup>

import {PiMath} from "pimath/esm"
import {computed, ref} from "vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
	challenge: {type: Object, required: true}
})

let showTraining = ref(false)

let currentGeneratorSlug = ref(""),
	currentGenerator = computed(() => {
		return props.challenge.generators.filter(g => g.slug === currentGeneratorSlug.value)[0]
	}),
	question = ref({}),
	counter = ref(0)

let generateQuestion = function () {
		if (currentGenerator.value !== undefined) {
			counter.value++
			let F = new Function("PiMath", currentGenerator.value.code)

			question.value = F(PiMath)
			console.log(question.value)
		}
	},
	startTraining = function(slug){
		currentGeneratorSlug.value = slug
		generateQuestion()
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
</script>

<template>
	<div>
		<button
			class="my-5"
			@click="showTraining=!showTraining"
		>
			Entraînement
		</button>
		<div
			v-if="showTraining"
			class="grid grid-cols-1 md:grid-cols-2 gap-5"
		>
			<!-- Entraînement au challenges -->
			<div class="flex flex-col gap-3">
				<div
					v-for="gen of props.challenge.generators"
					:key="gen.slug"
				>
					<div
						v-theme.active
						class="w-full bg-white border rounded flex flex-col gap-3 py-3 px-3 cursor-pointer"
						:class="gen.slug===currentGeneratorSlug?'is-active':'bg-white'"
						@click="startTraining(gen.slug)"
					>
						<h2
							v-katex.auto="gen.title"
							class="text-lg font-semibold"
						/>
						<markdown-it :text="gen.body" />
					</div>
				</div>
			</div>

			<div v-if="theQuestion">
				<question-show
					:key="`question-${counter}`"
					:question="theQuestion"
					class="max-w-[40em] mx-auto"
					dynamic
					show-input
					@validate="nextQuestion"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
