<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {ref} from "vue"
import {useForm} from "@inertiajs/vue3"
import FormChapter from "@/Components/Form/FormChapter.vue"
import {ChapterInterface} from "@/types/chapterInterfaces.ts"

const props = defineProps<{
	chapterId?: number
}>()

const editMode = useStoreEditMode()

const chapterModel = ref<ChapterInterface | null>(null)

let show = ref(false)
const form = useForm({
	title: "nouveau challenge",
	chapter: chapterModel.value?.id ?? null
})


function storeChallenge() {
	form.post(route("api.admin.chapters.challenges.store", {chapter: chapterModel.value.id}))
}
</script>

<template>
	<div
		v-show="editMode.enable"
		v-admin
		class="min-h-25 grid place-items-center"
	>
		<sc-button
			type="add"
			icon
			@click="show = true"
		>
			Nouveau challenge
		</sc-button>

		<dialog-modal
			v-model="show"
			class="max-w-112.5 h-auto bg-content"
		>
			<template #header>
				<div
					class="flex justify-between items-baseline border-b border-content px-5 py-3 mb-5"
				>
					<h1>
						<span class="text-xl md:text-2xl">créer un challenge</span>
					</h1>
				</div>
			</template>

			<template #footer>
				<div class="flex justify-end items-baseline border-t border-content px-5 py-3 mt-5">
					<sc-button
						type="add"
						:disabled="!chapterModel?.id"
						@click="storeChallenge"
					>
						Créer un nouveau challenge
					</sc-button>
				</div>
			</template>
			<div class="px-5">
				<FormInput
					v-model="form.title"
					:focus="true"
					label="Nouveau challenge"
					name="newChallenge"
					@cancel="show = false"
					@enter="storeChallenge"
				/>

				<form-chapter
					v-if="!props.chapterId"
					v-model="chapterModel"
				/>
			</div>
		</dialog-modal>
	</div>
</template>
