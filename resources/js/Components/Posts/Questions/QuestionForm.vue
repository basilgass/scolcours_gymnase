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
		<div class="flex flex-col md:flex-row gap-3 px-5 pb-5">
			<form
				class="flex-1"
				@submit.prevent
			>
				<form-input
					v-model="theQuestion.block.title"
					name="title"
					label="title"
					class="font-code"
					inline
				/>
				<form-input
					v-model="theQuestion.css"
					name="css"
					label="CSS"
					class="font-code"
					inline
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
				<form-textarea
					v-model="theQuestion.keyboard"
					:rows="5"
					label="keyboard"
					name="keyboard"
					class="font-code"
				/>

				<div
					v-show="errorMessage"
					class="bg-red-200 border rounded border-red-300 py-3 px-2"
				>
					{{ errorMessage }}
				</div>
			</form>

			<question-show
				class="min-w-[350px]"
				:question="theQuestion"
				:class="theQuestion.css"
				is-dynamic
				show-input
				show-title
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
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

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
