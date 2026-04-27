<script lang="ts" setup>
import {EvaluationInterface} from "@/types/modelInterfaces"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import EvaluationCard from "@/Pages/Evaluations/EvaluationCard.vue"

defineOptions({layout: LayoutMain})

let props = defineProps<{
	evaluations: EvaluationInterface[]
}>()

const theEvaluations = ref<EvaluationInterface[]>(props.evaluations)

// Les cartes sont cachées, le temps de charder, en une fois, tous les scores
const loading = ref(true)

const scoreStore = useStoreScore()
const questionIds: number[] = props.evaluations
	.map(evaluation => evaluation.questions.map(question => question.id))
	.flat()

// Preload each question score
scoreStore.getScores("Question", questionIds)
	.finally(() => setTimeout(() => loading.value = false, 400))

</script>

<template>
	<article>
		<article-title title="évaluations" />

		<filtered-list
			v-if="!loading"
			:list="theEvaluations"
			list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
		>
			<template #card="{item}: {item: EvaluationInterface}">
				<evaluation-card :evaluation="item" />
			</template>
		</filtered-list>
		<div
			v-else
			class="grid place-items-center h-[60vh] font-code text-2xl text-center"
		>
			<div class="flex flex-col gap-6">
				<div>Chargement des évaluations</div>
				<div>Merci de patienter</div>
			</div>
		</div>
	</article>
</template>


