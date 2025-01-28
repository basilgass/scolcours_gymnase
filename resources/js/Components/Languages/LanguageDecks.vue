<script lang="ts" setup>
import {LanguageDataInterface} from "@/Pages/languages/LanguageShow.vue"
import {computed, inject} from "vue"
import type {BlockInterface, DeckInterface} from "@/types/modelInterfaces.ts"
import FlipcardsShow from "@/Components/Decks/FlipcardsShow.vue"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"

// languageData is the reactive data from the parent component.
// it contains all the words, units, and the current state of the game.
const languageData = inject<LanguageDataInterface>("LanguageData")

// useLanguage is a composable function that returns the selected unit's words
// and provide de methods to run the game.
const {startGame} = useLanguage(languageData)

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

const cards = computed(()=>{
	return languageData.words.value.map((word, index) => {
		return {
			id: index,
			recto: makeBlockFromString(word.foreign),
			verso: makeBlockFromString(word.fr),
			result: null
		}
	})
})

const deck = computed<DeckInterface | null>(() => {
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

		<div v-if="languageData.state.value==='intro'">
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
					class="btn btn-primary px-20 py-10 text-2xl"
					@click="startGame"
				>
					Commencer
				</button>
			</div>
		</div>
	</article>
</template>
