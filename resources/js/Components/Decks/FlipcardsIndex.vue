<script lang="ts" setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { PropType, ref } from "vue"
import { deckInterface } from "@/types/modelInterfaces"
import BlockEdit from "@/Components/Posts/Blocks/BlockEdit.vue"
import axios from "axios"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"

const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})
let theDeck = ref(props.deck)

function addCard() {
	axios.post(route("decks.addFlipcard", [props.deck.id]))
		.then(res => {
			theDeck.value.flipcards.push(res.data)
		})
		.catch(err => {
			console.log(err.response.data.message)
		})
}

function deleteFlipcard(flipcardID) {
	axios.delete(route("flipcards.destroy", [flipcardID]))
		.then(res => {
			theDeck.value.flipcards = theDeck.value.flipcards.filter(flipcard => flipcard.id !== flipcardID)
		})
}
</script>

<template>
	<article class="grid grid-cols-1 gap-5">
		<div
			v-for="card in theDeck.flipcards"
			:key="card.id"
		>
			<div class="grid grid-cols-2 gap-5">
				<div class="bg-white border border-slate-200 rounded-xl min-h-[200px] grid place-items-center relative">
					<block-edit
						:block="card.recto"
						class="absolute top-0 left-0 w-full"
						no-blur
						no-data
						no-delete
						no-grid
						no-script
						no-switch
						no-title
						no-type
					/>
					<markdown-it
						:text="card.recto.body"
						class="w-full px-3 mt-5"
					/>
				</div>

				<div class="bg-white border border-slate-200 rounded-xl min-h-[200px] grid place-items-center relative">
					<block-edit
						:block="card.verso"
						class="absolute top-0 left-0 w-full"
						no-blur
						no-data
						no-delete
						no-grid
						no-script
						no-switch
						no-title
						no-type
					/>
					<markdown-it
						:text="card.verso.body"
						class="w-full px-3 mt-5"
					/>
				</div>
			</div>
			<div class="text-right mt-1">
				<confirm-button
					class="btn-delete btn-xs"
					@confirm="deleteFlipcard(card.id)"
				>
					supprimer
				</confirm-button>
			</div>
		</div>

		<div class="text-center mt-20">
			<button
				class="btn btn-add"
				@click="addCard"
			>
				Ajouter une carte
			</button>
		</div>
	</article>
</template>

<style scoped>

</style>
