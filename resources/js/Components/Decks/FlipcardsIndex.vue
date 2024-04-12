<script lang="ts" setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { inject, PropType, ref } from "vue"
import type { deckInterface } from "@/types/modelInterfaces"
import axios from "axios"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})

const editMode = inject<boolean>("editMode")

const theDeck = ref(props.deck)

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
		.then(() => {
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
					<form-maker
						v-if="editMode"
						v-model="card.recto.body"
						type="code"
						class="w-full"
						rows="10"
						:axios="{
							model: 'Block',
							id: card.recto.id,
							column: 'body',
							button: true
						}"
					/>
					<markdown-it
						v-else
						:text="card.recto.body"
						class="w-full px-3 mt-5"
					/>
				</div>

				<div class="bg-white border border-slate-200 rounded-xl min-h-[200px] grid place-items-center relative">
					<form-maker
						v-if="editMode"
						v-model="card.verso.body"
						type="code"
						class="w-full"
						rows="10"
						:axios="{
							model: 'Block',
							id: card.verso.id,
							column: 'body',
							button: true
						}"
					/>
					<markdown-it
						v-else
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
