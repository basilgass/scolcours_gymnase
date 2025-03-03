<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { PostShowInterface, QuestionInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { inject, PropType, ref } from "vue"

const props = defineProps({
	post: { type: Object as PropType<PostShowInterface>, required: true },
	questions: { type: Object as PropType<QuestionInterface[]>, required: true },
	components: { type: Object as PropType<InstanceType<typeof QuestionShow>[]>, required: true }
})

const  editMode  = useStoreEditMode()

const flash = inject<flashInterface>("flash")

const thePost = ref(props.post)
const theQuestions = ref(props.questions)

const removeDisplayIf = function() {
		theQuestions.value.forEach((question) => {
			question.displayIf = null
		})
		// Save to database.
		storeDisplayIf()
	},
	addDisplayIf = function() {
		// Add displayIf by increment.
		theQuestions.value.forEach((question, index) => {
			if (index > 0) {
				question.displayIf =
					theQuestions.value[index - 1].id.toString()
			}
		})

		// Save to database.
		storeDisplayIf()
	},
	storeDisplayIf = function() {
		axios
			.post(route("questions.batch.updateDisplayIf"), {
				_method: "PATCH",
				values: theQuestions.value.map((question) => {
					return {
						id: question.id,
						displayIf: question.displayIf
					}
				})
			})
			.then(() => {
				flash.success(
					"L'affichage conditionnel a bien été enregistré."
				)
			})
			.catch(() => {
				flash.error(
					"Il y a eu un problème avec l'affichage conditionnel."
				)
			})
	}

function resetAnswers() {
	axios
		.patch(
			route("questions.answers.reset", ["Post", props.post.id])
		)
		.then(() => {
			for (const i in theQuestions.value) {
				theQuestions.value[i].user.answer = ""
				theQuestions.value[i].user.result = false
			}

			flash.success("Les réponses ont bien été réinitialisées.")
		})
}


const isAnswersShown = ref(false)

function showAnswers() {
	props.components.forEach((component) => {
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

const addQuestion = function () {
	axios
		.post(
			route("questions.storeTo", [
				"Post",
				props.post.id,
			]),
			{
				math: false,
				mathAppend: "",
				body: "nouvelle question",
				answer: "-",
				keyboard: "-"
			},
		)
		.then((res) => {
			// Add the question.
			theQuestions.value.push({
				...res.data,
			})
		})
}
</script>
<template>
	<div
		v-admin="editMode.enable"
		class="bg-slate-600 text-white py-2 px-3 flex gap-6"
	>
		<button
			class="text-xl"
			@click="addQuestion"
		>
			<i class="bi bi-plus-circle" />
		</button>
		<div class="flex-1 flex gap-2">
			<form-maker
				v-model="thePost.questionsGrid"
				:axios="{ model: 'Post', id: post.id, column: 'questionsGrid' }"
				class="flex-1"
				inline-label
				label="grille"
				sm
			/>
		</div>

		<div class="flex gap-2 items-center">
			<div class="text-sm">
				apparitions
			</div>
			<button
				class="btn btn-xs"
				@click="addDisplayIf"
			>
				<i class="bi bi-bar-chart" />
			</button>
			<button
				class="btn btn-xs"
				@click="removeDisplayIf"
			>
				<i class="bi bi-trash" />
			</button>
		</div>


		<div class="flex gap-2 items-center">
			<div class="text-sm">
				réponses
			</div>
			<button
				class="btn btn-xs"
				@click="showAnswers"
			>
				<i
					v-if="isAnswersShown"
					class="bi bi-eye"
				/>
				<i
					v-else
					class="bi bi-eye-slash"
				/>
			</button>
			<button
				class="btn btn-xs"
				@click="resetAnswers"
			>
				<i class="bi bi-trash" />
			</button>
		</div>
	</div>
</template>
