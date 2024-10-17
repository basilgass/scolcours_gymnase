<script
	lang="ts"
	setup
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ClipboardKeyboardInterface, flashInterface } from "@/types"
import type { QuestionInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { computed, inject, PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	question: { type: Object as PropType<QuestionInterface>, required: true }
})

const theQuestion = ref(props.question)

const flash = inject<flashInterface>("flash")

let saveQuestion = function () {
	let illustrations = []

	axios
		.post(route("blocks.update", [theQuestion.value.block.id]), {
			_method: "PATCH",
			title: theQuestion.value.block.title,
			body: theQuestion.value.block.body,
			illustrations
		})
		.then(() => {
			axios
				.post(route("questions.update", [theQuestion.value.id]), {
					_method: "PATCH",
					answer: theQuestion.value.answer,
					checker: theQuestion.value.checker,
					keyboard: theQuestion.value.keyboard,
					css: theQuestion.value.css
				})
				.then(() => {
					flash.success("La question a été sauvegardée.")
				})
				.catch((error) => {
					flash.error(
						"Une erreur est survenue - voir la console"
					)
					console.warn(error)
				})
		})
		.catch((error) => {
			flash.error("Une erreur est survenue - voir la console")
			console.warn(error)
		})
},
	deleteQuestion = function () {
		axios
			.post(route("questions.destroy", [props.question.id]), {
				_method: "delete"
			})
			.then((res) => {
				flash.success("la question a été supprimée")
				router.visit(res.data)
			})
			.catch((err) => console.warn(err))
	}

// Handle copy and paste.
// TODO: Move the copy/paste to a composable.
// TODO: add a timeout for the localStorage.
let hasClipboard = computed(() => {
	return sessionStorage.getItem("scolcours-clipboard-question") !== null
}),
	copyQuestion = function () {
		sessionStorage.setItem(
			"scolcours-clipboard-question",

			JSON.stringify({
				title: theQuestion.value.block.title,
				body: theQuestion.value.block.body,
				css: theQuestion.value.css,
				answer: theQuestion.value.answer,
				keyboard: theQuestion.value.keyboard
			})
		)
	},
	pasteQuestion = function () {
		let pasteCB = sessionStorage.getItem("scolcours-clipboard-question")
		if (pasteCB !== null) {
			const paste: ClipboardKeyboardInterface = JSON.parse(pasteCB)
			theQuestion.value.block.title = paste.title
			theQuestion.value.block.body = paste.body
			theQuestion.value.css = paste.css
			theQuestion.value.answer = paste.answer
			theQuestion.value.keyboard = paste.keyboard
		}
	}
</script>
<template>
	<section class="my-5 scolcours-container">
		<div class="flex flex-col gap-3 border-b border-gray-200 px-5 py-3 mb-5">
			<div class="flex w-full justify-between items-baseline">
				<h1>
					<span class="text-xl md:text-2xl">
						édition d'une question
					</span>
					<span class="text-xs font-code ml-5">
						(id: {{ theQuestion.id }})
					</span>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn btn-xs"
						@click="copyQuestion"
					>
						<i class="bi bi-clipboard-plus" />
					</button>
					<button
						v-if="hasClipboard"
						class="btn btn-xs"
						@click="pasteQuestion"
					>
						<i class="bi bi-clipboard-pulse" />
					</button>

					<button
						class="btn-primary btn-xs"
						@click="saveQuestion"
					>
						enregistrer
					</button>
					<InertiaLink
						class="btn-cancel btn-xs"
						:href="route('questions.show', [theQuestion.id])"
					>
						retour
					</InertiaLink>
					<confirm-button
						class="btn-delete btn-xs"
						@confirm="deleteQuestion"
					>
						supprimer
					</confirm-button>
				</div>
			</div>

			<move-item-to
				:source-id="theQuestion.id"
				source="question"
				target="post"
			/>
		</div>
		<div class="flex flex-col md:flex-row gap-3 px-5 pb-5">
			<form
				class="flex-1 flex flex-col gap-2 font-code"
				@submit.prevent
			>
				<form-maker
					v-model="theQuestion.block.title"
					inline-label
					label="titre"
					label-class="w-[60px]"
					sm
					type="text"
				/>

				<form-maker
					v-model="theQuestion.css"
					inline-label
					label="CSS"
					label-class="w-[60px]"
					sm
					type="text"
				/>

				<form-maker
					ref="formBody"
					v-model="theQuestion.block.body"
					:label="`body (id: ${theQuestion.block.id})`"
					:rows="10"
					language="latex"
					message="\$a = TeX, \$A = texte, @$A = format spéciaux"
					message-class="text-[12px]"
					type="code"
				/>

				<form-maker
					v-model="theQuestion.answer"
					:rows="3"
					label="answer"
					message="multi-réponse: ||"
					message-class="text-[12px]"
					name="answer"
					type="textarea"
				/>

				<form-maker
					v-model="theQuestion.keyboard"
					:rows="8"
					label="clavier"
					type="keyboard"
				/>
			</form>

			<question-show
				:class="theQuestion.css"
				:question="theQuestion"
				class="min-w-[350px] md:max-w-[40vw]"
				is-dynamic
				show-input
				show-title
			/>
		</div>
	</section>
</template>
