<script setup lang="ts">

import axios from "axios"
import {computed, inject, onMounted, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {AxiosErrorMessage, type flashInterface} from "@/types"

interface AvailableDecksInterface {
	id: number,
	type: 'Deck' | 'Formular' | 'Chapter'
	theme_id: number
	title: string
	cards_count: number
}

const emits = defineEmits<{
	created: []
}>()

const flash = inject<flashInterface>("flash")


const decks = ref<AvailableDecksInterface[]>([])

function fetchDecks(): void {
	console.log('FETCH')
	axios.get(route('decks.fetch'))
		.then(response => {
			decks.value = response.data.decks as AvailableDecksInterface[]
		})
}

const selection = ref<string[]>([
	'Deck,1', 'Deck,13', 'Formular,14'
])

function deckKey(deck: AvailableDecksInterface) {
	return `${deck.type},${deck.id}`
}

function updateSelection(key: string) {
	const index = selection.value.indexOf(key)

	if (index === -1) {
		selection.value.push(key)
		return
	}

	selection.value.splice(index, 1)
}

const selectedDecks = computed<AvailableDecksInterface[]>(()=>{
	return decks.value
		.filter(deck => {
			return selection.value.includes(deckKey(deck))
		})

})
const cardsCount = computed(() => {
	return selectedDecks.value.reduce((sum, deck) => {
			return sum + deck.cards_count
		}, 0)
})

/** création du deck */
const userdeckTitle = ref<string>('')
function createUserDeck(){
	// axios call.
	axios.post(route('decks.userdecks.create', {
		title: userdeckTitle.value,
		decks: selectedDecks.value
	}))
		.then(()=>{
			emits('created')
			flash.success('Nouveau deck crée avec succès')

		})
		.catch((res: AxiosErrorMessage)=>{
			flash.error(res.response.data.message)
		})
}

onMounted(() => {
	fetchDecks()
})
</script>

<template>
	<article>
		<div class="flex gap-5 justify-between items-end mb-3">
			<div class="flex-1 mb-5">
				<h2 class="text-xl">
					nouveau deck
				</h2>
				<form-maker
					label="titre"
					v-model="userdeckTitle"
					placeholder="titre du deck"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<div><i class="bi bi-cart mr-3" />{{ selection.length }} decks pour {{ cardsCount }} carte(s)</div>
				<sc-button
					type="add"
					@click="createUserDeck"
					:outline="userdeckTitle.length<=5"
					:disabled="userdeckTitle.length<=5"
				>
					créer
				</sc-button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
			<card
				v-for="deck in decks"
				:key="`deck-${deck.type}-${deck.id}`"
				:theme="deck.theme_id"
				:class="{
					'opacity-50': !selection.includes(deckKey(deck))
				}"
				@click="updateSelection(deckKey(deck))"
			>
				<div v-katex.auto="deck.title" />

				<div>{{ deck.id }} {{ deck.type }}</div>
				<template #footer>
					<div class="text-xs py-1">
						{{ deck.cards_count }} cartes
					</div>
				</template>
			</card>
		</div>
	</article>
</template>

<style scoped>

</style>
