<script
	lang="ts"
	setup
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {AxiosResponseModel, ClipboardKeyboardInterface} from "@/types"
import type {IllustrationInterface, QuestionInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, PropType, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const props = defineProps({
	question: {type: Object as PropType<QuestionInterface>, required: true}
})

const theQuestion = ref(props.question)

const flash = useStoreFlashMessage()

function saveQuestion() {
	axios
		.post(route("api.admin.blocks.update", [theQuestion.value.block.id]), {
			_method: "PATCH",
			title: theQuestion.value.block.title,
			body: theQuestion.value.block.body
		})
		.then(() => {
			axios
				.post(route("api.admin.questions.update", [theQuestion.value.id]), {
					_method: "PATCH",
					answer: theQuestion.value.answer,
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
}

function deleteQuestion() {
	axios
		.post(route("api.admin.questions.destroy", [props.question.id]), {
			_method: "delete"
		})
		.then((res) => {
			flash.success("la question a été supprimée")
			router.visit(res.data)
		})
		.catch((err) => console.warn(err))
}

// Handle copy and paste.
const hasClipboard = computed(() => {
	return sessionStorage.getItem("scolcours-clipboard-question") !== null
})

function copyQuestion() {
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
}

function pasteQuestion() {
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


function addIllustration() {
	if (theQuestion.value.block.illustration) {
		return
	}

	axios
		.post(
			route("api.admin.blocks.illustrations.store", {block: theQuestion.value.block.id}),
			{}
		)
		.then((res: AxiosResponseModel<IllustrationInterface>) => {
			// router.visit(route("admin.illustrations.edit", [res.data.id]))
			flash.success("une nouvelle illustration a été créée")
			theQuestion.value.block.illustration = res.data
		}).catch((res) => {
			console.warn("add illustration: ", res)
		}
	)
}

function deleteIllustration() {
	axios.delete(
		route('api.admin.illustrations.destroy', {illustration: theQuestion.value.block.illustration.id})
	).then(() => {
		theQuestion.value.block.illustration = null
		flash.success("L'illustration a bien été supprimée.")
	})
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
				<div class="flex gap-3 justify-end items-baseline">
					<sc-button
						xs
						@click="copyQuestion"
						class="outline-0"
					>
						<i class="bi bi-clipboard-plus" />
					</sc-button>
					<sc-button
						v-if="hasClipboard"
						xs
						@click="pasteQuestion"
						class="outline-0"
					>
						<i class="bi bi-clipboard-pulse" />
					</sc-button>

					<sc-button
						xs
						type="primary"
						@click="saveQuestion"
					>
						enregistrer
					</sc-button>
					<sc-button
						xs
						type="primary"
						:href="route('questions.show', [theQuestion.id])"
					>
						retour
					</sc-button>
					<confirm-button
						xs
						@confirm="deleteQuestion"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</div>
		<div class="flex flex-col md:flex-row gap-3 px-5 pb-5">
			<form
				class="space-y-3 font-code"
				@submit.prevent
			>
				<form-maker
					v-model="theQuestion.block.title"
					inline-label
					label="titre"
					label-class="w-[60px]"
					type="text"
					sm
				/>

				<form-maker
					v-model="theQuestion.css"
					inline-label
					label="CSS"
					label-class="w-[60px]"
					type="text"
					sm
				/>


				<div class="grid grid-cols-3 gap-5">
					<sc-button
						v-if="!theQuestion.block.illustration"
						type="add"
						xs
						outline
						@click="addIllustration"
					>
						<i class="bi bi-image" />
					</sc-button>
					<confirm-button
						v-else
						xs
						@confirm="deleteIllustration"
					>
						<i class="bi bi-image" /> => <i class="bi bi-trash" />
					</confirm-button>

					<sc-button
						disabled
						xs
					>
						bouton 1
					</sc-button>
					<sc-button
						disabled
						xs
					>
						bouton 2
					</sc-button>
				</div>

				<form-maker
					ref="formBody"
					v-model="theQuestion.block.body"
					:label="`body (id: ${theQuestion.block.id})`"
					:rows="10"
					language="latex"
					message="\$a = TeX, \$A = texte, @$A = format spéciaux"
					message-class="text-[12px]"
					type="codearea"
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
				ref="questionRef"
				class="min-w-[350px] md:max-w-[40vw]"
				is-dynamic
				show-input
				show-title
				editor-mode
			/>
		</div>
	</section>
</template>
