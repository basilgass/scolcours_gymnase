<script lang="ts" setup>
import type {EvaluationInterface} from "@/types/modelInterfaces"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import EvaluationCreate from "@/Components/Evaluations/EvaluationCreate.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

let props = defineProps<{
	evaluations: EvaluationInterface[]
}>()

const theEvaluations = ref<EvaluationInterface[]>(props.evaluations)
</script>

<template>
	<article>
		<article-title title="évaluations" />

		<div
			v-admin
			v-theme.admin
			class="p-3 border rounded flex justify-between items-baseline"
		>
			<div>GAUCHE</div>
			<div>
				<evaluation-create />
			</div>
		</div>

		<filtered-list
			:list="theEvaluations"
			list-class="grid grid-cols-1 gap-3"
		>
			<template #card="{item}: {item: EvaluationInterface}">
				<Card>
					<template #header>
						<div class="flex justify-between">
							<h3 v-katex.auto="item.title" />
							<div class="font-code text-xs">
								{{ item.slug }}
							</div>
						</div>
					</template>
					<markdown-it :text="item.body" />

					<template #footer>
						<div class="flex w-full justify-end gap-3">
							<sc-button
								type="edit"
								icon
								xs
								:href="route('admin.evaluations.edit', {evaluation: item.id})"
							>
								éditer
							</sc-button>
							<sc-button
								type="default"
								xs
								:href="route('evaluations.show', {evaluation: item.id})"
							>
								voir
							</sc-button>
						</div>
					</template>
				</Card>
			</template>
		</filtered-list>
		<div>liste des évaluations disponibles.</div>
	</article>
</template>


