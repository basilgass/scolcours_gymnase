<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import QuestionShowAdmin from "@/Components/Questions/QuestionShowAdmin.vue"
import QuestionsIndexAdmin from "@/Components/Questions/QuestionsIndexAdmin.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import type {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
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

onMounted(() => {
	const ids = props.questions.map(q => q.id)

	if (props.userId !== undefined) {
		// Vue admin : scores d'un utilisateur spécifique, à pousser manuellement dans le store
		storeScore.getUserScores(props.userId, 'Question', ids)
			.then((scores) => {
				scores.forEach(score => {
					const exists = storeScore.scores.find(
						s => s.scoreable_type === 'Question' && s.scoreable_id === score.scoreable_id
					)
					if (!exists) storeScore.scores.push(score)
				})
			})
			.catch(res => console.log(res))
	} else {
		storeScore.getScores('Question', ids)
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

const questionIds = computed(() => theQuestions.value.map(q => +q.id))

// Liste des questions répondues correctement — lue directement depuis le store.
const answeredIds = computed(() =>
	storeScore.scores
		.filter(s => s.scoreable_type === 'Question'
			&& questionIds.value.includes(s.scoreable_id)
			&& s.is_resolved)
		.map(s => s.scoreable_id)
)

const isQuestionLocked = function (question: QuestionInterface) {
	if (question.displayIf === null) return false

	if (question.displayIf === undefined) return false

	if (answeredIds.value.length === 0) return true

	const dependantQuestionIds = question
		.displayIf.split(",")
		.map((id) => +id)

	return dependantQuestionIds.some((id) => answeredIds.value.indexOf(id) === -1)
}

const questionsComponentsMap = ref<Record<number, InstanceType<typeof QuestionShow>>>({})
const questionsComponents = computed(() => Object.values(questionsComponentsMap.value))

function setQuestionRef(id: number, el: InstanceType<typeof QuestionShow> | null) {
	if (!questionsComponentsMap.value) return
	if (el) {
		questionsComponentsMap.value[id] = el
	} else {
		delete questionsComponentsMap.value[id]
	}
}

const emit = defineEmits<{
	validate: [event: questionResultInterface]
}>()


function removeQuestion(id: number) {
	const pos = theQuestions.value.findIndex(q => q.id === id)

	if (pos === -1) {
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
			v-model:questions="theQuestions"
			v-model:grid="questionsGrid"
			v-admin="editMode.enable"
			:components="questionsComponents"
			:container
		/>

		<!-- questions list -->
		<div>
			<please-wait
				v-if="theQuestions.length === 0"
				class="min-h-75 grid place-items-center text-xl"
				text="Aucune question à l'horizon."
			/>
			<div v-else>
				<draggable
					v-model="theQuestions"
					:class="questionsGridClass"
					class="mt-10"
					handle=".draggable-handle"
					item-key="id"
					v-bind="{
						animation: 200,
						disabled: !editMode.enable,
					}"
				>
					<template #item="{ element }: {element: QuestionInterface}">
						<div class="question-wrapper relative h-fit">
							<transition name="fade">
								<div
									v-if="isQuestionLocked(element) && !editMode.enable"
									v-theme.gradient
									class="w-full h-full font-extralight text-lg min-h-[5em] px-5 absolute inset-0 z-10 grid text-center place-items-center"
								>
									<i class="bi bi-question-lg text-8xl text-gray-300" />
								</div>
							</transition>
							<question-show-admin
								v-admin="editMode.enable"
								:question="element"
								:questions="theQuestions"
								@removed="removeQuestion(element.id)"
							/>
							<question-show
								:key="element.id"
								:ref="(el: any) => setQuestionRef(element.id, el)"
								:class="element.css ?? ''"
								:question="element"
								@validate="emit('validate', $event)"
							/>
						</div>
					</template>
				</draggable>
			</div>
		</div>
	</article>
</template>
