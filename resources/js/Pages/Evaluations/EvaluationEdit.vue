<script lang="ts" setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import type {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces"
import {ref} from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"

defineOptions({layout: LayoutMain})

let props = defineProps<{
	evaluation: EvaluationInterface
}>()

const theQuestions = ref<QuestionInterface[]>(props.evaluation.questions)
const theTitle = ref<string>(props.evaluation.title)
const theSlug = ref<string>(props.evaluation.slug)
const theBody = ref<string>(props.evaluation.body)
</script>

<template>
	<article>
		<header class="px-5">
			<h2
				v-katex.auto="props.evaluation.title"
				class="text-3xl"
			/>
			<div class="font-extralight">
				{{ props.evaluation.slug }}
			</div>
		</header>

		<div class="space-y-3">
			<div>
				<form-maker
					v-model="theTitle"
					type="text"
					label="titre"
				/>

				<form-maker
					v-model="theSlug"
					type="text"
					xs
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<form-maker
					type="codearea"
					language="latex"
					v-model="theBody"
				/>
				<markdown-it
					class="bg-content border border-content p-3 rounded"
					:text="theBody"
				/>
			</div>

			<h3 class="text-xl mt-10">
				questions
			</h3>

			<questions-index
				:container="{
					id: evaluation.id,
					type: 'Evaluation'
				}"
				:questions="theQuestions"
			/>
		</div>
	</article>
</template>


