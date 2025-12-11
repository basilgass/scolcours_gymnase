<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import QuestionShowAdmin from "@/Components/Questions/QuestionShowAdmin.vue"
import QuestionsIndexAdmin from "@/Components/Questions/QuestionsIndexAdmin.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {QuestionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import type {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import {questionsContainerInterface} from "@/Components/Questions/useQuestionAdmin.ts"

const editMode = useStoreEditMode()

const props = defineProps<{
	container: questionsContainerInterface,
	questions: Partial<QuestionInterface>[],
	userId?: number
}>()

const theQuestions = ref<Partial<QuestionInterface>[]>(props.questions)
const storeScore = useStoreScore()

const loading = ref(true)

onMounted(() => {

	// Charger les scores des questions en une fois = optimisation
	const ids = props.questions
		.filter((question) => question.user === undefined)
		.map(question => question.id)

	// supprime les scores actuels si user_id n'est pas vide
	if (props.userId !== undefined) {
		storeScore.getUserScores(
			props.userId,
			'Question',
			props.questions.map(q => q.id)
		).then((scores: ScoreInterface<ScoreQuestionDataInterface>[]) => {
			scores.forEach(score => {
				const index = theQuestions.value.findIndex(q => q.id === score.scoreable_id)
				theQuestions.value[index].user = score
			})
		})
			.catch(res => console.log(res))
			.finally(() => loading.value = false)

	} else {
		storeScore.getScores<ScoreQuestionDataInterface>('Question', ids)
			.then((scores: ScoreInterface<ScoreQuestionDataInterface>[]) => {
				scores.forEach(score => {
					const index = theQuestions.value.findIndex(q => q.id === score.scoreable_id)
					theQuestions.value[index].user = score
				})
			})
			.finally(() => loading.value = false)
	}
})

// Grille des questions
const questionsGrid = ref<string>(props.container.questionsGrid ?? "")
const questionsGridClass = computed(() => {
	if (questionsGrid.value) {
		return questionsGrid.value
	}

	let grid = "grid grid-cols-1"

	if (theQuestions.value.length > 1) {
		grid += " md:grid-cols-2"
	}

	if (theQuestions.value.length > 2) {
		grid += " lg:grid-cols-3"
	}

	return grid + " gap-x-3 gap-y-6"
})

// Liste des questions qui ont été répondues correctement.
const answeredIds = computed(() => {
	return theQuestions.value
		.filter((question) => question.user?.is_resolved)
		.map((question) => +question.id)
})

const isQuestionLocked = function (question: QuestionInterface) {
	if (question.displayIf === null) return false

	if (question.displayIf === undefined) return false

	if (answeredIds.value.length === 0) return true

	const dependantQuestionIds = question
		.displayIf.split(",")
		.map((id) => +id)

	return dependantQuestionIds.some((id) => answeredIds.value.indexOf(id) === -1)
}

const questionsComponents = ref<InstanceType<typeof QuestionShow>[]>([])

function addQuestionRef(element: InstanceType<typeof QuestionShow>) {
	if (questionsComponents.value.indexOf(element) === -1) {
		questionsComponents.value.push(element)
	}
}

const emit = defineEmits<{
	validate: [event: questionResultInterface]
}>()

function removeQuestion(id: number) {
	const pos = theQuestions.value.findIndex(q => q.id === id)

	if (pos === undefined) {
		return
	}

	theQuestions.value.splice(pos, 1)
}

</script>
<template>
	<article :class="editMode.enable?'pb-10':''">
		<!-- title -->
		<div
			v-if="theQuestions.length"
			v-theme.bg.text
			class="flex justify-between items-center px-10 py-4"
		>
			<h3 class="uppercase text-2xl relative">
				<i class="bi bi-question-square mr-5" />questions
			</h3>

			<div>{{ answeredIds.length }} / {{ theQuestions.length }}</div>
		</div>

		<questions-index-admin
			v-admin="editMode.enable"
			:components="questionsComponents"
			:container
			v-model:questions="theQuestions"
			v-model:grid="questionsGrid"
		/>

		<!-- questions list -->
		<div>
			<draggable
				v-if="!loading"
				:class="questionsGridClass"
				v-model="theQuestions"
				class="mt-10"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !editMode.enable,
				}"
			>
				<template #item="{ element }: {element: QuestionInterface}">
					<div class="question-wrapper h-fit">
						<question-show-admin
							v-admin="editMode.enable"
							:question="element"
							:questions="theQuestions"
							@removed="removeQuestion(element.id)"
						/>
						<question-show
							:key="element.id"
							:ref="addQuestionRef"
							:class="element.css ?? ''"
							:locked="isQuestionLocked(element)"
							:question="element"
							@validate="emit('validate', $event)"
						/>
					</div>
				</template>
			</draggable>
			<please-wait
				v-else
				class="min-h-[300px] grid place-items-center text-xl"
				text="Actuellement, aucune question..."
			/>
		</div>
	</article>
</template>
