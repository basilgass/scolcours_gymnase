<!--
Formulaire d'édition d'un chapitre.
TODO: donner la possibilité d'ajouter un chapitre.
-->
<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
				<h1>
					<span class="text-xl md:text-2xl">édition d'un chapitre</span>
					<span class="text-xs font-code ml-5">(id: {{ props.chapter.id }})</span>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn-primary btn-xs"
						@click="saveChapter"
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
						@confirm="deleteChapter"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>

		<div class="px-5 pb-5">
			<form-input
				v-model="theChapter.title"
				label="Titre"
				name="title"
				focus
			/>

			<form-input
				v-model="theChapter.slug"
				label="Titre"
				name="title"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<form-textarea
					v-model="theChapter.block.body"
					name="body"
					label="body"
				/>
				<markdown-it
					:text="theChapter.block.body"
					class="md:mt-6"
				/>
			</div>

			<div class="my-10">
				Illustration ?
			</div>
		</div>
	</dialog-modal>
</template>

<script setup>

import {inject, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {router} from "@inertiajs/vue3"

const emits = defineEmits(["update:modelValue", "change", "destroy"])

const props = defineProps({
	modelValue: {type: Boolean, default: false},
	chapter: {type: Object, required: true},
})

let theChapter = ref(props.chapter)

const flash = inject("flash")
let show = ref(props.modelValue),
	saveChapter = function(){
		axios.patch(route("chapters.update", [props.chapter.id]), {
			_method: "PATCH",
			...theChapter.value
		}).then(res=>{
			flash.success("Le chapitre a été enregistré")
			emits("update:modelValue", false)
			emits("change", res.data.data)

			// if the url is not the same than current, redirect.
			router.visit(route("chapter.show", [res.data.data.slug]))
		}).catch(res=>{
			flash.error("Erreur lors de l'enregistrement du chapitre...")
			emits("update:modelValue", false)
			console.warn(res)
		})
	},
	deleteChapter = function (){

	}

</script>
