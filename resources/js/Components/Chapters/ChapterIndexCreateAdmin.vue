<script lang="ts" setup>
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {nextTick, ref, useTemplateRef} from "vue"
import axios from "axios"
import {router, usePage} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

const createChapterModal = ref(false)
const createChapterTitle = ref("")

const input = useTemplateRef<InstanceType<typeof FormMaker>>('input')

const editMode = useStoreEditMode()

async function onShowModal() {
	createChapterModal.value = true
	await nextTick()

	input.value.focus()
}

function createChapter() {
	axios.post(route("api.admin.themes.chapters.store", {
		theme: usePage().props.theme.slug
	}), {
		title: createChapterTitle.value
	})
		.then((res) => {
			router.visit(route("chapters.show", [res.data.id]))
		})
}
</script>
<template>
	<div v-admin="editMode.enable">
		<sc-button
			type="add"
			@click="onShowModal"
		>
			<i class="bi bi-plus-circle mr-3" />Créer un chapitre
		</sc-button>

		<dialog-modal
			v-model="createChapterModal"
			class="max-w-md h-auto"
		>
			<template #header>
				<h2 class="pt-3 px-5 text-2xl">
					nouveau chapitre
				</h2>
			</template>
			<div class="p-5 flex items-end gap-3">
				<form-maker
					ref="input"
					v-model="createChapterTitle"
					class="flex-1"
					inline-label
					label="titre"
					font-code
					@enter="createChapter"
				/>
				<sc-button
					v-admin
					theme
					@click="createChapter"
				>
					créer
				</sc-button>
			</div>
		</dialog-modal>
	</div>
</template>
