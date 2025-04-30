<script lang="ts" setup>
import {LanguageDataInterface} from "@/Pages/languages/LanguageShow.vue"
import {computed, inject} from "vue"
import type {UserCardInterface, UserDeckInterface} from "@/types/modelInterfaces.ts"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"
import {makeUserCard, makeUserDeck} from "@/helpers/makeModel.ts"
import UserdeckShow from "@/Pages/Decks/UserdeckShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"

// languageData is the reactive data from the parent component.
// it contains all the words, units, and the current state of the game.
const languageData = inject<LanguageDataInterface>("LanguageData")

// useLanguage is a composable function that returns the selected unit's words
// and provide de methods to run the game.
const {startGame} = useLanguage(languageData)

const cards = computed<UserCardInterface[]>(() => {
	return languageData.words.value.map((word) => {
		return makeUserCard(word.fr, word.foreign)
	})
})

const deck = computed<UserDeckInterface | null>(() => {
	if (languageData.language.books.length === 0) {
		return null
	}

	return makeUserDeck(`deck de ${languageData.language.name}`, cards.value)
})

</script>
<template>
	<article>
		<div
			v-if="cards.length > 0"
			class="min-h-[80vh] my-10"
		>
			<userdeck-show
				:deck
				:cards
				hide-title
			/>
		</div>

		<div v-if="languageData.state.value==='intro'">
			<div class="grid place-items-center mt-12">
				<sc-button
					v-show="languageData.units.value.length > 0"
					class="px-20 py-10 text-2xl"
					type="primary"
					@click="startGame"
				>
					Commencer
				</sc-button>
			</div>
		</div>
	</article>
</template>
