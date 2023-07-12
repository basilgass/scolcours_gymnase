<template>
	<article>
		<div
			v-if="theQuestions.length"
			class="flex justify-between px-5 py-5"
		>
			<h3 class="font-extralight uppercase">
				questions
			</h3>
			<div
				v-show="editMode.enabled.value"
				v-admin
			>
				<button
					class="btn btn-xs"
					@click="resetAnswers"
				>
					réinitialiser les réponses
				</button>
			</div>
		</div>

		<draggable
			v-if="theQuestions.length"
			v-model="theQuestions"
			class="grid grid-cols-1 md:grid-cols-2 gap-3 px-5"
			:class="{
				'lg:grid-cols-3': theQuestions.length > 2,
			}"
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
					:question="element"
					@destroy="destroyQuestion"
					@duplicate="duplicateQuestion"
				/>
			</template>
		</draggable>

		<div
			v-show="editMode.enabled.value"
			v-admin
			class="px-5"
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
<script setup>

import {inject, ref} from "vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

const props = defineProps({
	questions: {type: Array, required: true},
	containerType: {type: String, required: true},
	containerId: {type: Number, required: true}
})

console.log(props.questions)
const flash = inject("flash"),
	editMode = inject("editMode")

let theQuestions = ref(props.questions)

let addQuestion = function () {
		axios
			.post(route("questions.storeTo", [props.containerType, props.containerId]), {
				math: false,
				mathAppend: "",
				body: "nouvelle question",
				answer: "-",
			})
			.then((res) => {
				// Add the question.
				theQuestions.value.push({
					...res.data.data
				})
			})
	},
	duplicateQuestion = function(event) {
		theQuestions.value.push(event)
	},
	destroyQuestion = function (destroyId) {
		theQuestions.value = theQuestions.value.filter(
			(x) => x.id !== destroyId
		)
	},
	updateQuestionsOrder = function () {
		axios
			.post(route("questions.updateOrder", [props.containerType, props.containerId]), {
				order: theQuestions.value.map((x, index) => {
					return { id: x.id, order: index + 1 }
				}),
			})
			.then((res) => {
				// TODO : flash message !
				flash.add("les questions ont bien été mis à jour !")
				theQuestions.value = res.data.data
			})
			.catch((res) => console.log("update questions order failed", res))
	},
	resetAnswers = function () {
		axios
			.patch(route("questions.answers.reset", [props.containerType, props.containerId]))
			.then((res) => {
				for (let i in theQuestions.value) {
					theQuestions.value[i].user.answer = []
					theQuestions.value[i].user.correct = false
				}
			})
	}

</script>
