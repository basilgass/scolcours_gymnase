<script
	lang="ts"
	setup
>

import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import type {BlockInterface, CardInterface, DeckInterface, FormulaInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import DeckCardEdit from "@/Components/Decks/Parts/DeckCardEdit.vue"
import DeckCardsEditDynamics from "@/Components/Decks/Parts/DeckCardsEditDynamics.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	deck: DeckInterface
}>()

const flash = useStoreFlashMessage()
const theCards = ref(props.deck.cards)


function addCard() {
	axios.post(route("api.admin.decks.cards.store", [props.deck.id]))
		.then(res => {
			theCards.value.push(res.data)
		})
		.catch(err => {
			console.log(err.response.data.message)
		})
}

function deleteCard(cardId) {
	axios.delete(route("api.admin.cards.destroy", {card: cardId}))
		.then(() => {
			theCards.value = theCards.value.filter(card => card.id !== cardId)
			flash.success('Carte supprimée avec succès.')
		})
		.catch((err: AxiosErrorMessage) => {
			flash.error('Erreur lors de la suppresion de la carte')
			console.warn(err.response.data.message)
		})
}

function updateDecksOrder() {
	axios
		.patch(route("api.admin.decks.cards.order", {deck: props.deck.id}), {
			order: theCards.value.map((x, index) => {
				return {
					id: x.id,
					order: index
				}
			})
		})
		.then((res: AxiosResponseModel<string>) => {
			console.log(res.data)
			flash.success(
				"L'ordre des cartes à bien été enregistré !"
			)
		})
		.catch((res: AxiosErrorMessage) => {
			flash.error("Erreur lors de la mise à jour de l'ordre des cartes")
			console.warn(res.response.data.message)
		})
}

const dynamicsBlocks = ref<BlockInterface[]>([])

function showChapterFormulas() {
	if (!props.deck.chapter && props.deck.chapter.id <= 0) {
		return
	}

	axios.get(route('api.formulas.index', {chapter_id: props.deck.chapter.id}))
		.then((res: AxiosResponseModel<FormulaInterface[]>) => {
			dynamicsBlocks.value = res.data.map((formula) => formula.block)
		})
}

function addBlock(blockId: number, splitter: string) {
	// Save the blockId to database.
	axios.post(route('api.admin.decks.cards.store', {deck: props.deck.id}), {
		'reference_block_id': blockId,
		'reference_block_splitter': splitter,
	}).then((res: AxiosResponseModel<CardInterface>) => {
		theCards.value.push(res.data)
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
				<deck-card-edit
					:card="element"
					@delete="deleteCard($event)"
				/>
			</template>
		</draggable>


		<div class="text-center mt-20 flex gap-3">
			<sc-button
				type="add"
				@click="addCard"
			>
				Ajouter une carte
			</sc-button>

			<sc-button
				type="add"
				@click="showChapterFormulas"
			>
				Ajouter une formule
			</sc-button>
		</div>

		<deck-cards-edit-dynamics
			v-if="dynamicsBlocks.length>0"
			:blocks="dynamicsBlocks"
			@add="addBlock"
		/>
	</article>
</template>
