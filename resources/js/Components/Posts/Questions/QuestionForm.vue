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
				class="flex-1 flex flex-col"
				@submit.prevent
			>
				<form-kit
						type="text"
						v-model="theQuestion.block.title"
						label="titre"
						input-class="font-code"
						sm
				/>
				<form-kit
					type="text"
					v-model="theQuestion.css"
					label="CSS"
					input-class="font-code"
					sm
					/>

				<div>
					<form-codearea
						ref="formBody"
						v-model="theQuestion.block.body"
						:rows="10"
						:label="`body (id: ${theQuestion.block.id})`"
						name="body"
						language="latex"
					/>
					<div class="text-[12px] font-code">
						$a = TeX, $A = texte, @$A = format spéciaux
					</div>
				</div>

				<form-textarea
					v-model="theQuestion.answer"
					label="answer"
					name="answer"
					class="font-code"
					:rows="3"
				/>

				<div class="grid grid-cols-2 gap-3">
					<form-textarea
						v-model="theQuestion.keyboard"
						:rows="8"
						label="keyboard"
						name="keyboard"
						class="font-code"
						@current-line="currentKeyboardLine = $event"
					/>

					<markdown-it
						class="font-code !text-[12px] mt-6"
						:text="currentKeyboardLineHelperText"
					/>
				</div>
			</form>

			<question-show
				class="min-w-[350px] md:max-w-[40vw]"
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
import {computed, inject, reactive, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import {checkersList, getChecker} from "@/Composables/checkersConfig"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
let props = defineProps({
		question: { type: Object, required: true },
		modelValue: { type: Boolean, default: false },
	}),
	show = ref(props.modelValue),
	theQuestion = reactive(props.question)

let currentKeyboardLine = ref(""),
	currentKeyboardLineHelperText = computed(() => {
		const [name, ...options] = currentKeyboardLine.value.split(",")

		if(checkersList.includes(name)){
			return getChecker(name).description
		}

		// Search for checkers name
		return checkersList.filter(x=>x.startsWith(currentKeyboardLine.value)).join(", ")
	})


const flash = inject("flash")
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
						flash.error("Une erreur est survenue - voir la console")
						console.warning(error)
					})
			})
			.catch((error) => {
				flash.error("Une erreur est survenue - voir la console")
				console.warning(error)
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
			.catch((err) => console.warn(err))
	}
</script>
