import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import {inject, ref, Ref, watch} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {router} from "@inertiajs/vue3"

const flash = inject<flashInterface>('flash')

export interface questionsContainerInterface {
	id: number,
	type: 'Post' | 'Quizz',// TODO: move this to an interface.
	questionsGrid?: string
}

export function useQuestionAdmin(
	container: questionsContainerInterface,
	questions: Ref<Partial<QuestionInterface>[]>,
	components: InstanceType<typeof QuestionShow>[]
) {


	function addQuestion() {
		axios
			.post(
				route("api.admin.questions.store"),
				{
					target_type: container.type,
					target_id: container.id,
					answer: "-",
					keyboard: "-"
				},
			)
			.then((res: AxiosResponseModel<QuestionInterface>) => {
				// Add the question.
				questions.value.push({
					...res.data,
				})

				// Go to the new question.
				router.visit(route('admin.questions.edit', {question: res.data.id}))
			})
	}

	function displayIf_remove() {
		questions.value.forEach((question) => {
			question.displayIf = null
		})
		// Save to database.
		displayIf_store()
	}

	function displayIf_auto() {
		// Add displayIf by increment.
		questions.value.forEach((question, index) => {
			if (index > 0) {
				question.displayIf =
					questions.value[index - 1].id.toString()
			}
		})

		// Save to database.
		displayIf_store()
	}

	function displayIf_store() {
		axios
			.post(route("api.admin.questions.batch.updateDisplayIf"), {
				_method: "PATCH",
				updates: questions.value.map((question) => {
					return {
						id: question.id,
						display_if: question.displayIf
					}
				})
			})
			.then(() => {
				flash.success(
					"L'affichage conditionnel a bien été enregistré."
				)
			})
			.catch((res: AxiosErrorMessage) => {
				console.log(res.response.data.message)
				flash.error(
					"Il y a eu un problème avec l'affichage conditionnel."
				)
			})
	}

	const isAnswersShown = ref(false)

	function answers_reset() {
		const storeScore = useStoreScore()
		storeScore.reset(questions.value.map(q => q.user.id))
			.then(() => {
				// TODO: Reload the page.
			})
	}

	function answers_show() {
		components.forEach((component) => {
			if (component) {
				if (isAnswersShown.value) {
					component.loadAnswers(false) //reset the answer
				} else {
					component.loadAnswers(true) // show the answer
				}

			}
		})

		isAnswersShown.value = !isAnswersShown.value
	}

	function updateQuestionsOrder() {
		axios
			.post(
				route("api.admin.questions.updateOrder", [
					container.type,
					container.id
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
					flash?.error("update questions order failed")
				}
			)

	}
	watch(questions, (newValue, preValue)=>{
		const newIds = newValue.map(q=>q.id).join(',')
		const oldIds = preValue.map(q=>q.id).join(',')

		if(oldIds!=='' && oldIds!==newIds){
			updateQuestionsOrder()
		}
	})
	function updateGrid(grid: string) {
		axios.patch(
			route('api.admin.posts.updateQuestionsGrid', {
				post: container.id
			}),
			{
				grid
			}
		).then(() => {
			// do nothing
		})
	}

	return {
		displayIf: {
			auto: displayIf_auto,
			remove: displayIf_remove
		},
		answers: {
			show: answers_show,
			reset: answers_reset,
			isShown: isAnswersShown
		},
		updateQuestionsOrder,
		add: addQuestion,
		updateGrid
	}
}
