<!--
Formulaire d'édition d'une question
-->
<script setup>
	import FormTextarea from "@/Components/Form/FormTextarea.vue"
	import { computed, inject, reactive, ref } from "vue"
	import DialogModal from "@/Components/Ui/DialogModal.vue"
	import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
	import FormCodearea from "@/Components/Form/FormCodearea.vue"
	import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
	import { checkersList, getChecker } from "@/Composables/checkersConfig"
	import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
	import FormWrapper from "@/Components/Form/FormWrapper.vue"
	import MoveItemTo from "@/Components/Posts/MoveItemTo.vue"

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

			if (checkersList.includes(name)) {
				return getChecker(name).description
			}

			// Search for checkers name
			return checkersList.filter((x) => x.startsWith(currentKeyboardLine.value)).join(", ")
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
				.then(() => {
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
				.then(() => {
					emits("update:modelValue", false)
					emits("destroy", props.question.id)
				})
				.catch((err) => console.warn(err))
		},
		moveItemToPost = function () {
			emits("update:modelValue", false)
			emits("destroy", props.question.id)
		}

	// Handle copy and paste.
	// TODO: Move the copy/paste to a composable.
	// TODO: add a timeout for the localStorage.
	let hasClipboard = computed(() => {
			return localStorage.getItem("scolcours-clipboard-question") !== null
		}),
		copyQuestion = function () {
			localStorage.setItem(
				"scolcours-clipboard-question",

				JSON.stringify({
					title: theQuestion.block.title,
					body: theQuestion.block.body,
					css: theQuestion.css,
					answer: theQuestion.answer,
					keyboard: theQuestion.keyboard,
				}),
			)
		},
		pasteQuestion = function () {
			let paste = localStorage.getItem("scolcours-clipboard-question")
			if (paste !== null) {
				paste = JSON.parse(paste)
				theQuestion.block.title = paste.title
				theQuestion.block.body = paste.body
				theQuestion.css = paste.css
				theQuestion.answer = paste.answer
				theQuestion.keyboard = paste.keyboard
			}
		}
</script>
<template>
	<dialog-modal v-model="show" class="bg-gray-50" @cancel="emits('update:modelValue', false)">
		<template #header>
			<div class="bg-white flex flex-col gap-3 border-b border-gray-200 px-5 py-3 mb-5">
				<div class="flex w-full justify-between items-baseline">
					<h1>
						<span class="text-xl md:text-2xl"> édition d'une question </span>
						<span class="text-xs font-code ml-5"> (id: {{ theQuestion.id }}) </span>
					</h1>
					<div class="flex gap-3 justify-end">
						<button class="btn btn-xs" @click="copyQuestion">
							<i class="bi bi-clipboard-plus" />
						</button>
						<button v-if="hasClipboard" class="btn btn-xs" @click="pasteQuestion">
							<i class="bi bi-clipboard-pulse" />
						</button>

						<button class="btn-primary btn-xs" @click="saveQuestion">enregistrer</button>
						<button class="btn-cancel btn-xs" @click="emits('update:modelValue', false)">fermer</button>
						<confirm-button class="btn-delete btn-xs" @confirm="deleteQuestion"> supprimer </confirm-button>
					</div>
				</div>

				<move-item-to :source-id="theQuestion.id" source="question" target="post" @moved="moveItemToPost" />
			</div>
		</template>
		<div class="flex flex-col md:flex-row gap-3 px-5 pb-5">
			<form class="flex-1 flex flex-col" @submit.prevent>
				<form-wrapper v-model="theQuestion.block.title" font-code label="titre" sm type="text" />
				<form-wrapper v-model="theQuestion.css" font-code label="CSS" sm type="text" />

				<div>
					<form-codearea ref="formBody" v-model="theQuestion.block.body" :label="`body (id: ${theQuestion.block.id})`" :rows="10" language="latex" name="body" />
					<div class="text-[12px] font-code">$a = TeX, $A = texte, @$A = format spéciaux</div>
				</div>

				<form-textarea v-model="theQuestion.answer" :rows="3" class="font-code" label="answer" name="answer" />

				<div class="grid grid-cols-2 gap-3">
					<form-textarea v-model="theQuestion.keyboard" :rows="8" class="font-code" label="keyboard" name="keyboard" @current-line="currentKeyboardLine = $event" />

					<markdown-it :text="currentKeyboardLineHelperText" class="font-code !text-[12px] mt-6" />
				</div>
			</form>

			<question-show :class="theQuestion.css" :question="theQuestion" class="min-w-[350px] md:max-w-[40vw]" is-dynamic show-input show-title />
		</div>
	</dialog-modal>
</template>
