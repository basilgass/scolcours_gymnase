<!--
Formulaire d'édition d'une question
-->
<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div
				class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5"
			>
				<h1>
					<span class="text-xl md:text-2xl">édition d'une question</span>
					<span class="text-xs font-code ml-5">(id: {{ theQuestion.id }})</span>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn-primary btn-xs"
						@click="saveQuestion"
					>
						enregistrer
					</button>
					<button
						class="btn-cancel btn-xs"
						@click="emits('update:modelValue', false)"
					>
						fermer
					</button>
					<confirm-button
						class="btn-delete btn-xs"
						@confirm="deleteQuestion"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 pb-5">
			<form @submit.prevent>
				<form-input
					v-model="theQuestion.block.title"
					name="title"
					label="title"
					class="font-code"
				/>
				<form-input
					v-model="theQuestion.css"
					name="css"
					label="CSS"
					class="font-code"
				/>

				<form-codearea
					ref="formBody"
					v-model="theQuestion.block.body"
					:rows="10"
					:label="`body (id: ${theQuestion.block.id})`"
					name="body"
					language="latex"
				/>

				<form-textarea
					v-model="theQuestion.answer"
					label="answer"
					name="answer"
					class="font-code"
					:rows="3"
				/>
				<form-input
					v-model="theQuestion.keyboard"
					label="keyboard"
					name="keyboard"
					class="font-code"
				/>
				<form-textarea
					v-model="theQuestion.parameters"
					label="parameters"
					name="parameters"
					class="font-code"
				/>

				<div
					v-show="errorMessage"
					class="bg-red-200 border rounded border-red-300 py-3 px-2"
				>
					{{ errorMessage }}
				</div>
			</form>

			<question-show-new
				:question="theQuestion"
				:class="theQuestion.css"
				is-dynamic
				show-input
				show-parameters
			/>
		</div>
	</dialog-modal>
</template>
<script setup>
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {reactive, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import QuestionShowNew from "@/Components/Posts/Questions/QuestionShowNew.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
let props = defineProps({
		question: { type: Object, required: true },
		modelValue: { type: Boolean, default: false },
	}),
	show = ref(props.modelValue),
	theQuestion = reactive(props.question),
	errorMessage = ref("")

let saveQuestion = function () {
		let illustrations = []

		axios
			.post(route("blocks.update", [theQuestion.block.id]), {
				_method: "PATCH",
				title: theQuestion.block.title,
				body: theQuestion.block.body,
				illustrations,
			})
			.then((res) => {
				axios
					.post(route("questions.update", [theQuestion.id]), {
						_method: "PATCH",
						answer: theQuestion.answer,
						checker: theQuestion.checker,
						keyboard: theQuestion.keyboard,
						parameters: theQuestion.parameters,
						css: theQuestion.css,
					})
					.then((res) => {
						emits("update:modelValue", false)
						emits("change", res.data.data)
					})
					.catch((error) => {
						errorMessage.value = error.response.data.message
					})
			})
			.catch((error) => {
				errorMessage.value = error.response.data.message
			})
	},
	deleteQuestion = function () {
		axios
			.post(route("questions.destroy", [props.question.id]), {
				_method: "delete",
			})
			.then((res) => {
				emits("update:modelValue", false)
				emits("destroy", props.question.id)
			})
			.catch((err) => console.log(err))
	}
</script>
