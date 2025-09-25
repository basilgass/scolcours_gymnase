<script setup lang="ts">

import {router} from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"
import {CardInterface} from "@/types/modelInterfaces.ts"
import {computed, inject, ref} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage, flashInterface} from "@/types"
import axios from "axios"
import {computedCard} from "@/Components/Decks/Parts/DeckCardMaker.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()
const props = defineProps<{ card: CardInterface }>()
const editableCard = ref<CardInterface>(computedCard(props.card))

console.log(editableCard.value)

const isDynamic = computed<boolean>(() => props.card.reference !== null)

const originalCard = isDynamic.value ? null : {
	recto: props.card.recto.body,
	verso: props.card.verso.body
}

const showMarkdown = ref<boolean>(false)

const emits = defineEmits<{
	delete: [id: number]
}>()

const showSaveButton = computed(() => {
	if (isDynamic.value) {
		return false
	}

	return (editableCard.value.recto.body !== originalCard.recto) ||
		(editableCard.value.verso.body !== originalCard.verso)
})

function updateCard() {
	if (isDynamic.value) {
		return
	}
	axios.patch(route('api.admin.cards.update', {card: props.card.id}), {
		blocks: {
			recto: {
				id: editableCard.value.recto.id,
				body: editableCard.value.recto.body
			},
			verso: {
				id: editableCard.value.verso.id,
				body: editableCard.value.verso.body
			},
		}
	})
		.then(() => {
			originalCard.recto = editableCard.value.recto.body
			originalCard.verso = editableCard.value.verso.body

			flash.success('La carte a bien été mise à jour')

		})
		.catch((err: AxiosErrorMessage) => {
			console.log(err.response.data.message)
			flash.error('Problème dans la sauvegarde de la carte.')
		})
}
</script>

<template>
	<div class="bg-content p-2">
		<div class="flex justify-between px-2 pb-2 items-center">
			<div class="draggable-handle cursor-move text-xs">
				<i class="bi bi-arrows-move mr-2" />id: {{ card.id }}
			</div>
			<div class="flex gap-3">
				<sc-button
					type="save"
					icon
					xs
					v-show="showSaveButton"
					@click="updateCard"
				>
					Enregistrer
				</sc-button>
				<confirm-button
					xs
					@confirm="emits('delete', card.id)"
					icon
				>
					supprimer
				</confirm-button>
			</div>
		</div>

		<div
			class="grid grid-cols-2 gap-5"
			v-if="!isDynamic"
		>
			<div class="relative">
				<form-maker
					v-if="editMode.enable"
					v-model="editableCard.recto.body"
					type="codearea"
					class="w-full rounded-xl min-h-[200px]"
					:rows="10"
					@focus="showMarkdown = true"
					@blur="showMarkdown=false"
				/>
				<div
					class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
					@click="router.visit(route('admin.blocks.edit', card.recto.id))"
				>
					<i class="bi bi-pencil" />
				</div>
			</div>
			<div class="relative">
				<form-maker
					v-if="editMode.enable"
					v-model="editableCard.verso.body"
					type="codearea"
					class="w-full"
					:rows="10"
					@focus="showMarkdown = true"
					@blur="showMarkdown=false"
				/>
				<div
					class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
					@click="router.visit(route('admin.blocks.edit', card.verso.id))"
				>
					<i class="bi bi-pencil" />
				</div>
			</div>
		</div>
		<div v-if="showMarkdown || !editMode.enable || isDynamic">
			<div
				class="text-lg flex justify-between mt-3"
			>
				<div>Prévisualisation</div>
				<button @click="showMarkdown = false">
					<i class="bi bi-x-lg" />
				</button>
			</div>
			<div class="grid grid-cols-2 gap-5">
				<deck-card-item-side
					xs
					class="bg-content border"
					:block="editableCard.recto"
				/>
				<deck-card-item-side
					xs
					class="bg-content border"
					:block="editableCard.verso"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
