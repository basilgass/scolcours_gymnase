<script setup lang="ts">

import axios from "axios"
import {onMounted, ref} from "vue"
import {ChapterInterface, DeckInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"

interface ChapterInterfaceWithFormulaCount extends ChapterInterface {
	formulas_count: number
}

interface DeckInterfaceWithCardsCount extends DeckInterface {
	cards_count: number
}

const decks = ref<DeckInterfaceWithCardsCount[]>([])

const chapters = ref<ChapterInterfaceWithFormulaCount[]>([])

function fetchDecks(): void {
	axios.get(route('decks.fetch'))
		.then(response => {
			console.log(response.data)
			decks.value = response.data.decks as DeckInterfaceWithCardsCount[]
			chapters.value = response.data.chapters as ChapterInterfaceWithFormulaCount[]
		})
}

onMounted(() => {
	fetchDecks()
})
</script>

<template>
	<article>
		<div class="text-xl">
			créer un nouveau deck
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
			<card
				v-for="deck in decks"
				:key="`deck-${deck.id}`"
			>
				<div v-katex.auto="deck.title" />
				<template #footer>
					Nombre de cartes: {{ deck.cards_count }}
				</template>
			</card>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
			<card
				v-for="chapter in chapters"
				:key="`chapter-${chapter.id}`"
			>
				<div v-katex.auto="chapter.title" />
				<template #footer>
					Nombre de cartes: {{ chapter.formulas_count }}
				</template>
			</card>
		</div>
	</article>
</template>

<style scoped>

</style>
