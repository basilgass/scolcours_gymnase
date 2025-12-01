<script lang="ts" setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import type {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces"
import {ref} from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {AxiosErrorMessage} from "@/types"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"

defineOptions({layout: LayoutMain})

let props = defineProps<{
	evaluation: EvaluationInterface
}>()

const flash = useStoreFlashMessage()

const theQuestions = ref<QuestionInterface[]>(props.evaluation.questions)
const theTitle = ref<string>(props.evaluation.title)
const theSlug = ref<string>(props.evaluation.slug)
const theBody = ref<string>(props.evaluation.body)
const autoControl = ref<boolean>(props.evaluation.auto_control)

function update() {
	axios.patch(
		route("api.admin.evaluations.update", {evaluation: props.evaluation.id}),
		{
			title: theTitle.value,
			slug: theSlug.value,
			body: theBody.value,
			auto_control: autoControl.value
		}
	)
		.then(() => {
			flash.success("L'évaluation a bien été enregistrée")
		})
		.catch((err: AxiosErrorMessage) => {
			flash.error(`L'évauation n'a pas été enregistrée<br/>${err.response.data.message}`)
		})
}
</script>

<template>
	<article>
		<article-title
			title="édition d'une évalution"
			:return-link="{
				url: route('admin.evaluations.index'),
				label: 'retour aux cours'
			}"
		/>

		<div class="space-y-3 mt-12">
			<Card>
				<template #header>
					<div class="flex justify-between items-start">
						<div>
							<h2
								v-katex.auto="props.evaluation.title"
								class="text-2xl"
							/>
							<div class="font-extralight text-xs font-code">
								id: {{ props.evaluation.id }} / {{ props.evaluation.slug }}
							</div>
						</div>
						<div class="flex gap-3">
							<sc-button
								type="save"
								icon
								xs
								@click="update"
							/>
						</div>
					</div>
				</template>
				<div class="space-y-5">
					<div>
						<form-maker
							type="switch"
							label="auto contrôle"
							v-model="autoControl"
						/>
					</div>
					<div class="space-y-1">
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
				</div>
			</Card>

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


