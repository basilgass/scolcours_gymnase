<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import type { ChapterShowInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { inject, ref } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")

const props = defineProps<{
	chapter: ChapterShowInterface
}>()

const theChapter = ref(props.chapter)

function saveChapter() {
	axios
		.patch(route("chapters.update", [props.chapter.id]), {
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
	// TODO: implement deleteChapter
	console.log("TO BE IMPLEMENTED")
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
				<button
					class="btn-primary btn-xs"
					@click="saveChapter"
				>
					enregistrer
				</button>
				<InertiaLink
					class="btn-cancel btn-xs"
					:href="route('chapters.show', [props.chapter.slug])"
				>
					retour
				</InertiaLink>
				<confirm-button
					disabled="true"
					class="btn-delete btn-xs"
					@confirm="deleteChapter"
				>
					supprimer
				</confirm-button>
			</div>
		</div>

		<div class="pb-5">
			<form-maker
				v-model="theChapter.title"
				label="titre"
				focus
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
					type="textarea"
					name="body"
					label="body"
				/>
				<markdown-it
					:text="theChapter.block.body"
					class="md:mt-6"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
