<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
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
					v-model="theQuestion.css"
					name="css"
					label="CSS"
				/>
				<form-textarea
					v-model="theQuestion.block.body"
					:label="`body (id: ${theQuestion.block.id})`"
					name="body"
					:rows="10"
				/>

				<!-- illustration -->
				<!-- type, parameter, code -->
				<div
					v-if="theQuestion.block.illustration"
					class="relative"
				>
					<button
						class="btn-delete btn-xs absolute top-0 right-0"
						@click="delete theQuestion.block.illustration"
					>
						<i class="bi bi-trash" />Supprimer
					</button>
					<form-illustration
						v-model="theQuestion.block.illustration"
						class="pt-5"
						name="illustration"
						label="illustration"
					/>
				</div>
				<button
					v-else
					class="btn btn-block"
					@click="addIllustration"
				>
					Ajouter une illustration
				</button>

				<form-input
					v-model="theQuestion.answer"
					label="answer"
					name="answer"
				/>
				<form-input
					v-model="theQuestion.keyboard"
					label="keyboard"
					name="keyboard"
				/>
				<form-textarea
					v-model="theQuestion.parameters"
					label="parameters"
					name="parameters"
				/>

				<div
					v-show="errorMessage"
					class="bg-red-200 border rounded border-red-300 py-3 px-2"
				>
					{{ errorMessage }}
				</div>
			</form>
			<div class="bg-white border border-gray-200 rounded py-4">
				<markdown-it
					:text="theBody"
					class="border-b border-gray-200 px-3 mb-3 pb-3"
				/>

				<QuestionUserInput
					:key="theQuestion.block.body"
					ref="userInput"
					:question="theQuestion"
					class="px-3"
					@change="theBody = $event"
				/>
			</div>
		</div>
	</dialog-modal>
</template>
<script setup>
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {reactive, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import QuestionUserInput from "@/Components/Posts/Questions/QuestionUserInput.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormIllustration from "@/Components/Form/FormIllustration.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
let props = defineProps({
		question: {type: Object, required: true},
		modelValue: {type: Boolean, default: false},
	}),
	show = ref(props.modelValue),
	theQuestion = reactive(props.question),
	errorMessage = ref(""),
	userInput = ref(null)

let addIllustration = function(){
		theQuestion.block.illustration = {
			type: "draw",
			parameters: "",
			code: ""
		}
	},
	saveQuestion = function () {
		let illustrations = []
		if(theQuestion.block.illustration){
			illustrations = [{...theQuestion.block.illustration}]
		}

		axios.post(route("blocks.update", [theQuestion.block.id]),
			{
				_method: "PATCH",
				body: theQuestion.block.body,
				illustrations
			}
		)
			.then(res => {
				axios.post(route("questions.update", [theQuestion.id]),
					{
						_method: "PATCH",
						answer: theQuestion.answer,
						checker: theQuestion.checker,
						keyboard: theQuestion.keyboard,
						parameters: theQuestion.parameters,
						css: theQuestion.css
					})
					.then(res => {
						emits("update:modelValue", false)
						emits("change", res.data.data)
					})
					.catch(error=> {
						errorMessage.value = error.response.data.message
					})
			})
			.catch(error=> {
				errorMessage.value = error.response.data.message
			})
	},
	deleteQuestion = function(){
		axios
			.post(
				route("questions.destroy", [props.question.id]),
				{_method: "delete"}
			)
			.then((res)=>{
				emits("update:modelValue", false)
				emits("destroy", props.question.id)
			})
			.catch(err => console.log(err))
	},
	theBody = ref(theQuestion.block.body)</script>
