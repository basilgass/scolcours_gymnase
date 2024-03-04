<script lang="ts" setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { PropType, ref } from "vue"
import { EvaluationInterface } from "@/types/modelInterfaces"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"

defineOptions({ layout: LayoutProjection })

let props = defineProps({
	evaluation: {
		type: Object as PropType<EvaluationInterface>,
		required: true
	}
})

let theQuestions = ref(props.evaluation.questions)
let questionIndex = ref(0)
let direction = ref("left")

function selectQuestion(index: number) {
	direction.value = questionIndex.value < index - 1 ? "left" : "right"

	questionIndex.value = index - 1
}
</script>

<template>
	<article
		class="my-8 py-5 mx-auto max-w-xl bg-white rounded-lg border border-slate-300 min-h-screen"
	>
		<header class="px-5">
			<h2
				v-katex.auto="props.evaluation.title"
				class="text-3xl"
			/>
			<div class="font-extralight">
				{{ props.evaluation.slug }}
			</div>
		</header>

		<markdown-it
			:text="props.evaluation.body"
			class="px-5"
		/>

		<div
			v-if="theQuestions.length > 0"
			class="px-5"
		>
			<div class="flex justify-around my-10 relative">
				<hr class="absolute left-10 right-10 border-2 top-[50%] z-0">
				<!-- List of the questions -->
				<div
					v-for="i in theQuestions.length"
					:key="`question-${i}`"
					:class="{
						'border-4 border-blue-600 !bg-blue-100 text-blue-800':
							i - 1 === questionIndex,
						'!bg-green-600 border-green-800 text-white':
							theQuestions[i - 1].user.result,
					}"
					class="z-10 rounded-full font-lg bg-white font-semibold border w-12 h-12 grid place-items-center cursor-pointer transition-all"
					@click="selectQuestion(i)"
				>
					{{ i }}
				</div>
			</div>

			<keep-alive>
				<div class="overflow-hidden">
					<transition
						:name="`slide-${direction}`"
						mode="out-in"
					>
						<question-show
							:key="`question-${questionIndex}`"
							:question="theQuestions[questionIndex]"
							class="mt-5"
							show-input
						/>
					</transition>
				</div>
			</keep-alive>
		</div>
	</article>
</template>

<style scoped></style>
