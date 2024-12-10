<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import {LanguageDataInterface} from "@/Pages/languages/LanguageShow.vue"
import {Random} from "pimath"
import {computed, inject, ref} from "vue"
import DeckIndex from "@/Pages/Decks/DeckIndex.vue"
import type {BlockInterface, deckInterface, flipcardsInterface} from "@/types/modelInterfaces.ts"
import FlipcardsShow from "@/Components/Decks/FlipcardsShow.vue"

const languageData = inject<LanguageDataInterface>("LanguageData")

console.log(languageData)
const startIndex = ref(0),
	cards = ref<flipcardsInterface[]>([]),
	cardTimeout = ref(1),
	showAllCards = ref(false),
	numberOfCards = ref(12),
	gamePaused = ref(true),
	gameStopped = ref(true)

const startGame = function () {
	generateCards()
}
const continueGame = function () {
	startIndex.value = startIndex.value + numberOfCards.value + 1
	generateCards()
}

function makeBlockFromString(str: string): BlockInterface {
	return {
		id: 0,
		title: null,
		active: true,
		order: null,
		merge: null,
		switch: null,
		type: str,
		body: str,
		template: null,
		illustrationsGrid: null,
		illustrations: [],
		script: null,
		json: null
	}
}

const generateCards = function () {

	// Generate a deck.
	cards.value = languageData.words.value.map((word, index) => {
		return {
			id: index,
			recto: makeBlockFromString(word.foreign),
			verso: makeBlockFromString(word.fr),
			result: null
		}
	})

	gameStopped.value = false
	gamePaused.value = false
}

const deck = computed<deckInterface | null>(() => {
	if (languageData.language.books.length === 0) {
		return null
	}

	return {
		id: 0,
		title: languageData.language.name,
		slug: null,
		chapter: {id: 0, slug: null},
		theme_id: 0,
		flipcards: cards.value
	}
})

</script>
<template>
	<article>
		<div
			v-if="cards.length > 0"
			class="min-h-[80vh] my-10"
		>
			<flipcards-show
				:deck="deck"
			/>
		</div>

		<div v-if="gameStopped">
			<div class="my-3">
				<h2 class="text-lg font-extralight mb-2 uppercase">
					configuration du deck
				</h2>
				<div class="flex gap-3">
					direction
				</div>
			</div>

			<div class="grid place-items-center mt-12">
				<button
					v-show="languageData.units.value.length > 0"
					class="btn-primary px-20 py-10 text-2xl"
					@click="startGame"
				>
					Commencer
				</button>
			</div>
		</div>
		<div
			v-else
			class="mt-10 grid grid-cols-3 w-full"
		>
			<div>
				<button
					class="btn btn-xs bg-white"
					@click="showAllCards = !showAllCards"
				>
					Afficher toutes les fiches
				</button>
			</div>

			<div class="text-center">
				Mots {{ startIndex + 1 }} à
				{{ startIndex + 1 + numberOfCards }} sur
				{{ languageData.words.value.length }}
			</div>

			<div>
				<button
					v-show="gamePaused"
					class="btn btn-xs bg-success"
					@click="continueGame"
				>
					Continuer le jeu
				</button>
			</div>
		</div>
	</article>
</template>
