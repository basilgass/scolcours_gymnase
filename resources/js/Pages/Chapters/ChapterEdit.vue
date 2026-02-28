<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {ChapterShowInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {ref} from "vue"
import {router, usePage} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const flash = useStoreFlashMessage()

const props = defineProps<{
	chapter: ChapterShowInterface
}>()

const theChapter = ref(props.chapter)

function saveChapter() {
	axios
		.patch(route("api.admin.chapters.update", [props.chapter.id]), {
			_method: "PATCH",
			...theChapter.value,
		})
		.then(() => {
			flash.success("Le chapitre a été enregistré")
		})
		.catch((res) => {
			flash.error(
				"Erreur lors de l'enregistrement du chapitre...",
			)
			console.warn(res)
		})
}

function deleteChapter() {
	const slug = usePage().props.themes[props.chapter.theme_id].slug

	axios.delete(route("api.admin.chapters.destroy", [props.chapter.id]))
		.then(() => {
			flash.success("Le chapitre a été supprimé")
			router.visit(route('theme', {slug}))
		})
		.catch((res) => {
			flash.error(
				"Erreur lors de la suppression du chapitre...",
			)
			console.warn(res)
		})
}
</script>

<template>
	<section class="scolcours-container my-5">
		<div class="flex justify-between items-baseline py-3 mb-5">
			<h1>
				<span class="text-xl md:text-2xl">édition d'un chapitre</span>
				<span class="text-xs font-code ml-5">(id: {{ props.chapter.id }})</span>
			</h1>
			<div class="flex gap-3 justify-end">
				<sc-button
					type="primary"
					xs
					@click="saveChapter"
				>
					enregistrer
				</sc-button>
				<sc-button
					:href="route('chapters.show', [props.chapter.id])"
					type="cancel"
					xs
				>
					retour
				</sc-button>
				<confirm-button
					xs
					@confirm="deleteChapter"
				>
					supprimer
				</confirm-button>
			</div>
		</div>

		<div class="pb-5">
			<form-maker
				v-model="theChapter.title"
				focus
				label="titre"
			/>
			<form-maker
				v-model="theChapter.meta_title"
				label="meta-titre"
			/>

			<form-maker
				v-model="theChapter.slug"
				label="slug"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<form-maker
					v-model="theChapter.block.body"
					label="body"
					language="latex"
					name="body"
					type="codearea"
				/>
				<markdown-it
					:text="theChapter.block.body"
					class="md:mt-6"
				/>
			</div>
		</div>
	</section>
</template>


