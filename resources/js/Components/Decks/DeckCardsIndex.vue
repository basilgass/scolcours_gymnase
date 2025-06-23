<script
	lang="ts"
	setup
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {flashInterface} from "@/types"
import type {CardInterface, DeckInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {inject, ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"

const props = defineProps<{
	deck: DeckInterface
}>()

const editMode = useStoreEditMode()
const flash = inject<flashInterface>('flash')

const theCards = ref(props.deck.cards)

const showMarkdown = ref(-1)

function addCard() {
	axios.post(route("api.decks.cards.store", [props.deck.id]))
		.then(res => {
			theCards.value.push(res.data)
		})
		.catch(err => {
			console.log(err.response.data.message)
		})
}

function deleteCard(cardId) {
	// BUG: axios.delete(route("cards.destroy", [cardId]))
	// axios.delete(route("cards.destroy", [cardId]))
	// 	.then(() => {
	// 		theCards.value = theCards.value.filter(card => card.id !== cardId)
	// 	})
}

function updateDecksOrder() {

	axios
		.post(route("api.decks.cards.order"), {
			order: theCards.value.map((x, index) => {
				return {id: x.id, order: index}
			})
		})
		.then((res) => {
			flash.success(
				"L'ordre des cartes à bien été enregistré !"
			)
		})
		.catch((res) => {
			flash.error("Erreur lors de la mise à jour de l'ordre des cartes")
			console.warn("update ordering order: ", res.data)
		})
}
</script>

<template>
	<article>
		<draggable
			v-model="theCards"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin,
			}"
			class="grid grid-cols-1 gap-5"
			@end="updateDecksOrder"
		>
			<template #item="{ element }: {element: CardInterface}">
				<div class="bg-content p-2">
					<div class="flex justify-between px-2 pb-2 items-center">
						<div class="draggable-handle cursor-move text-xs">
							<i class="bi bi-arrows-move mr-2" />id: {{ element.id }}
						</div>
						<confirm-button
							xs
							@confirm="deleteCard(element.id)"
						>
							supprimer
						</confirm-button>
					</div>
					<div class="grid grid-cols-2 gap-5">
						<div class="relative">
							<form-maker
								v-if="editMode.enable"
								v-model="element.recto.body"
								type="codearea"
								class="w-full rounded-xl min-h-[200px]"
								:rows="10"
								@focus="showMarkdown = element.id"
								:axios="{
									model: 'Block',
									id: element.recto.id,
									column: 'body',
									button: true
								}"
							/>
							<div
								class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
								@click="router.visit(route('admin.blocks.edit', element.recto.id))"
							>
								<i class="bi bi-pencil" />
							</div>
						</div>
						<div class="relative">
							<form-maker
								v-if="editMode.enable"
								v-model="element.verso.body"
								type="codearea"
								class="w-full"
								:rows="10"
								@focus="showMarkdown = element.id"
								:axios="{
									model: 'Block',
									id: element.verso.id,
									column: 'body',
									button: true
								}"
							/>
							<div
								class="absolute right-0 bottom-0 p-2 cursor-pointer z-10"
								@click="router.visit(route('admin.blocks.edit', element.verso.id))"
							>
								<i class="bi bi-pencil" />
							</div>
						</div>
					</div>
					<div v-if="showMarkdown === element.id || !editMode.enable">
						<div
							class="text-lg flex justify-between mt-3"
						>
							<div>Prévisualisation</div>
							<button @click="showMarkdown = -1">
								<i class="bi bi-x-lg" />
							</button>
						</div>
						<div class="grid grid-cols-2 gap-5">
							<deck-card-item-side
								xs
								class="bg-content border"
								:block="element.recto"
							/>
							<deck-card-item-side
								xs
								class="bg-content border"
								:block="element.verso"
							/>
						</div>
					</div>
				</div>
			</template>
		</draggable>


		<div class="text-center mt-20">
			<sc-button
				type="add"
				@click="addCard"
			>
				Ajouter une carte
			</sc-button>
		</div>
	</article>
</template>
