<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import QuestionShowAdmin from "@/Components/Questions/QuestionShowAdmin.vue"
import QuestionsIndexAdmin from "@/Components/Questions/QuestionsIndexAdmin.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {flashInterface} from "@/types"
import type {PostShowInterface, QuestionInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {computed, inject, onMounted, ref} from "vue"
import type {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"

const editMode = useStoreEditMode()
const flash = inject<flashInterface>("flash")

const props = defineProps<{
	post: PostShowInterface
}>()

const questions = ref<Partial<QuestionInterface>[]>([])
const storeScore = useStoreScore()

onMounted(() => {
	// Charger les scores des questions
	const ids = props.post.questions
		.filter((question) => question.user === undefined)
		.map(question => question.id)

	storeScore.getScores<ScoreQuestionDataInterface>('Question', ids)
		.then(scores => {
			questions.value = props.post.questions.map((question) => {
				question.user = scores.find(score => score.scoreable_id === question.id)
				return question
			})
		})
})


const answeredIds = computed(() => {
	return questions.value
		.filter((question) => question.user?.is_resolved)
		.map((question) => +question.id)
})

const questionsGrid = computed(() => {
	if (props.post.questionsGrid) return props.post.questionsGrid

	let grid = "grid grid-cols-1"

	if (props.post.questions.length > 1) {
		grid += " md:grid-cols-2"
	}

	if (props.post.questions.length > 2) {
		grid += " lg:grid-cols-3"
	}

	return grid + " gap-x-3 gap-y-6"
})
const displayIds = computed(() => questions.value.map((q) => q.id))

const isQuestionLocked = function (question: QuestionInterface) {
	return !(
		question.displayIf === null ||
		question.displayIf === undefined ||
		question.displayIf.split(",")
			.map((id) => +id)
			.every((id) => answeredIds.value.indexOf(id) !== -1)
	)
}

const updateQuestionsOrder = function () {
	axios
		.post(
			route("api.admin.questions.updateOrder", [
				"Post",
				props.post.id
			]),
			{
				_method: "PATCH",
				order: questions.value.map((x, index) => {
					return {id: x.id, order: index + 1}
				})
			}
		)
		.then(() => {
			flash.success("les questions ont bien été mis à jour !")
		})
		.catch((res) => {
				console.warn(res.data)
				flash.error("update questions order failed")
			}
		)
}


const questionsComponents = ref<InstanceType<typeof QuestionShow>[]>([])

function addQuestionRef(element: InstanceType<typeof QuestionShow>) {
	if (questionsComponents.value.indexOf(element) === -1) {
		questionsComponents.value.push(element)
	}
}

defineEmits<{
	validate: [event: questionResultInterface]
}>()

</script>
<template>
	<article :class="editMode.enable?'pb-10':''">
		<!-- title -->
		<div
			v-if="post.questions.length"
			v-theme.bg.text
			class="flex justify-between items-center px-10 py-4"
		>
			<h3 class="uppercase text-2xl relative">
				<i class="bi bi-question-square mr-5" />questions
			</h3>

			<div>{{ answeredIds.length }} / {{ post.questions.length }}</div>
		</div>

		<questions-index-admin
			v-admin="editMode.enable"
			:components="questionsComponents"
			:post="post"
			:questions="questions"
		/>

		<!-- questions list -->
		<draggable
			v-if="questions.length"
			:class="questionsGrid"
			:list="questions"
			class="mt-10"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !editMode.enable,
			}"
			@end="updateQuestionsOrder"
		>
			<template #item="{ element }: {element: QuestionInterface}">
				<div class="question-wrapper">
					<question-show-admin
						v-admin="editMode.enable"
						:question="element"
						:ids="displayIds"
					/>
					<question-show
						:key="element.id"
						:ref="addQuestionRef"
						:class="element.css ?? ''"
						:locked="isQuestionLocked(element)"
						:question="element"
						@validate="$emit('validate', $event)"
					/>
				</div>
			</template>
		</draggable>
		<please-wait
			v-else
			class="min-h-[300px] grid place-items-center text-xl"
			text="Chargement des questions..."
		/>
	</article>
</template>
