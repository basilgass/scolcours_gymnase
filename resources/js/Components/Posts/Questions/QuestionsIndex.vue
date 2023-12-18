<script setup>
import { computed, inject, ref } from "vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import axios from "axios"
import FormMaker from "@/Components/Form/FormMaker.vue"

const props = defineProps({
		questions: { type: Array, required: true },
		containerType: { type: String, required: true },
		containerId: { type: Number, required: true },
		grid: { type: String, default: null },
	})

	const flash = inject("flash"),
		editMode = inject("editMode")

	let theQuestions = ref(props.questions),
		answeredIds = computed(() => {
			return theQuestions.value
				.filter((question) => question.user.result)
				.map((question) => +question.id)
		}),
		questionsIds = computed(() => {
			let ids = theQuestions.value.map((q) => {
				return { id: q.id, order: q.order }
			})
			ids.sort((a, b) => a.order - b.order)

			return ids.map((q) => q.id)
		}),
		displayedQuestions = computed(() => {
			let obj = {}

			theQuestions.value.forEach((question) => {
				obj[question.id] = displayQuestion(question)
			})

			return obj
		}),
		remainingQuestions = computed(() => {
			return Object.values(displayedQuestions.value).filter(
				(x) => x === false,
			).length
		}),
		footerText = computed(() => {
			if (remainingQuestions.value === 0) {
				return ""
			}
			if (remainingQuestions.value === 1) {
				return "encore 1 dernière question après."
			}
			return `${remainingQuestions.value} questions à venir...`
		})
	// Prepare the question to display or not.
	let displayQuestion = function (question) {
		// ids of answered questions
		return (
			question.displayIf === null ||
			question.displayIf
				.split(",")
				.map((id) => +id)
				.every((id) => answeredIds.value.indexOf(id) !== -1)
		)
	}

	// Conditionnal display
	let removeDisplayIf = function () {
			theQuestions.value.forEach((question) => {
				question.displayIf = null
			})
			// Save to database.
			storeDisplayIf()
		},
		addDisplayIf = function () {
			// Add displayIf by increment.
			//TODO:  Use the order key.
			theQuestions.value.forEach((question, index) => {
				if (index > 0) {
					question.displayIf =
						theQuestions.value[index - 1].id.toString()
				}
			})

			// Save to database.
			storeDisplayIf()
		},
		storeDisplayIf = function () {
			axios
				.post(route("questions.batch.updateDisplayIf"), {
					_method: "PATCH",
					values: theQuestions.value.map((question) => {
						return {
							id: question.id,
							displayIf: question.displayIf,
						}
					}),
				})
				.then((res) => {
					flash.success(
						"L'affichage conditionnel a bien été enregistré.",
					)
				})
				.catch((res) => {
					flash.error(
						"Il y a eu un problème avec l'affichage conditionnel.",
					)
				})
		}

	let addQuestion = function () {
			axios
				.post(
					route("questions.storeTo", [
						props.containerType,
						props.containerId,
					]),
					{
						math: false,
						mathAppend: "",
						body: "nouvelle question",
						answer: "-",
					},
				)
				.then((res) => {
					// Add the question.
					theQuestions.value.push({
						...res.data.data,
					})
				})
		},
		duplicateQuestion = function (event) {
			theQuestions.value.push(event)
		},
		destroyQuestion = function (destroyId) {
			theQuestions.value = theQuestions.value.filter(
				(x) => x.id !== destroyId,
			)
		},
		updateQuestionsOrder = function () {
			axios
				.post(
					route("questions.updateOrder", [
						props.containerType,
						props.containerId,
					]),
					{
						_method: "PATCH",
						order: theQuestions.value.map((x, index) => {
							return { id: x.id, order: index + 1 }
						}),
					},
				)
				.then((res) => {
					// TODO : flash message !
					flash.success("les questions ont bien été mis à jour !")
					theQuestions.value = res.data.data
				})
				.catch((res) =>
					console.warn("update questions order failed", res),
				)
		},
		resetAnswers = function () {
			axios
				.patch(
					route("questions.answers.reset", [
						props.containerType,
						props.containerId,
					]),
				)
				.then((res) => {
					for (let i in theQuestions.value) {
						theQuestions.value[i].user.answer = []
						theQuestions.value[i].user.result = 0
						theQuestions.value[i].user.attempts = 0
					}
				})
		}

	const questionsCustomGrid = ref(props.grid)
	const questionsGrid = computed(() => {
		if (questionsCustomGrid.value) {
			return questionsCustomGrid.value
		}

		let grid = "grid grid-cols-1"

		if (theQuestions.value.length > 1) {
			grid += " md:grid-cols-2"
		}

		if (theQuestions.value.length > 2) {
			grid += " lg:grid-cols-3"
		}

		return grid
	})
	const updateQuestionsGrid = function () {
		// Save to database.
		axios
			.patch(route("posts.updateQuestionsGrid", [props.containerId]), {
				_method: "PATCH",
				grid: questionsCustomGrid.value,
			})
			.then((res) => {
				flash.success("La grille a bien été enregistrée.")
			})
			.catch(() => {
				flash.error("Il y a eu un problème avec la grille.")
			})
	}
</script>
<template>
	<article>
		<div
			v-show="editMode.enabled.value"
			v-admin
			v-theme.bg.text="'admin'"
			class="p-3"
		>
			<div class="flex flex-wrap justify-between items-center">
				<div class="uppercase">
					administration des questions
				</div>
				<div class="flex gap-4">
					<button
						class="btn btn-xs"
						@click="addDisplayIf"
					>
						apparition conditionnel
					</button>
					<button
						class="btn btn-xs"
						@click="removeDisplayIf"
					>
						supprimer conditions
					</button>

					<button
						class="btn btn-xs"
						@click="resetAnswers"
					>
						réinitialiser les réponses
					</button>
				</div>
			</div>
			<div
				v-if="props.containerType === 'Post'"
				class="mt-5 flex gap-3"
			>
				<form-maker
					label="Gestion de la grille"
					inline-label
					v-model="questionsCustomGrid"
					sm
					font-code
					class="flex-1"
					@enter="updateQuestionsGrid"
				/>
				<button
					class="btn btn-xs"
					@click="questionsCustomGrid = ''"
				>
					<i class="bi bi-ban" />
				</button>
				<button
					class="btn btn-xs"
					@click="questionsCustomGrid = 'grid grid-cols-1'"
				>
					grid-1
				</button>
				<button
					class="btn btn-xs bg-gray-100 text-slate-600"
					@click="updateQuestionsGrid"
				>
					<i class="bi bi-check2" />
				</button>
			</div>
		</div>

		<div
			v-if="theQuestions.length"
			v-theme.bg.text
			class="flex justify-between px-10 py-4 mb-5"
		>
			<h3 class="uppercase text-2xl relative">
				<i class="bi bi-question-square mr-5" />questions
			</h3>
		</div>

		<draggable
			v-if="theQuestions.length"
			v-model="theQuestions"
			:class="questionsGrid"
			class="px-5 pb-5 gap-6"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin,
			}"
			@end="updateQuestionsOrder"
		>
			<template #item="{ element }">
				<question-show
					:class="element.css ?? ''"
					:groupe-ids="questionsIds"
					:locked="!displayedQuestions[element.id]"
					:question="element"
					@destroy="destroyQuestion"
					@duplicate="duplicateQuestion"
				/>
			</template>
		</draggable>

		<div
			v-show="editMode.enabled.value"
			v-admin
			class="px-5 mb-5"
		>
			<button
				class="btn-new mt-10"
				@click="addQuestion"
			>
				ajouter une question
			</button>
		</div>
	</article>
</template>
