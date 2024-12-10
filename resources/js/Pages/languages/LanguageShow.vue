<script
	lang="ts"
	setup
>

import LanguageGuess from "@/Components/Languages/LanguageGuess.vue"
import LanguageList from "@/Components/Languages/LanguageList.vue"
import LanguageMemory from "@/Components/Languages/LanguageMemory.vue"
import LanguageType from "@/Components/Languages/LanguageType.vue"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"
import { useLanguage } from "@/Components/Languages/useLanguage"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
// Set the main layout.
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { BookInterface, TranslationUnitInterfaceExtended, TranslationWord } from "@/types/modelInterfaces"
import { computed, ComputedRef, provide, Ref, ref } from "vue"
import LanguageDecks from "@/Components/Languages/LanguageDecks.vue"

defineOptions({ layout: LayoutMain })

interface LanguageInterface {
	game: "list" | "type" | "memory" | "guess",
	language: {
		slug: string,
		name: string,
		determinants: string,
		books: BookInterface[]
	},
}

export interface LanguageDataInterface extends LanguageInterface {
	units: Ref<TranslationUnitInterfaceExtended[]>,
	state: Ref<"intro" | "running" | "finished">,
	words: ComputedRef<TranslationWord[]>
}

// Degine the props coming in (save for all)
const props = defineProps<LanguageInterface>()

// Make the units data reactive
/**
 * props.units.map(unit => {
 * 		return {
 * 			...unit,
 * 			selected: false,
 * 			words: []
 * 		}
 * 	})
 */
const unitsSelection = ref<TranslationUnitInterfaceExtended[]>([])

const { selectedWords } = useLanguage(unitsSelection)

/** Current game state:
 * intro:   the game is in configuration mode
 * running: the game is running
 * finished: the game is waiting for either restart or choose other units or configure...
 */
const state = ref<"intro" | "running" | "finished">("intro")

// Get the words for the currently selected units
const words = computed(() => selectedWords(false))

provide<LanguageDataInterface>("LanguageData", {
	language: props.language,
	game: props.game,
	state,
	units: unitsSelection,
	words
})

// Check if there was something in the localStorage.
const localStorageKey = computed(() => {
	return `scolcours_${props.game}_${props.language}`
})

const hasLocalData = ref(false)
if (localStorage.getItem(localStorageKey.value)) {
	hasLocalData.value = true
}

</script>

<template>
	<section class="scolcours-container">
		<ArticleTitle :title="language.name" />

		<InertiaLink
			:href="`/${language.slug}`"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" /> retour
		</InertiaLink>

		<LanguageUnitsSelector
			class="mt-6"
			v-show="state === 'intro'"
			:books="language.books"
			v-model="unitsSelection"
		/>

		<!-- Local storage detection
		TODO : how to "load" the data ? -> make a component for the "intro" for each games.
		-->
		<!-- <button
			v-if="hasLocalData && state==='intro'"
			class="btn-success px-20 py-10 text-2xl"
		>
			continuer
		</button> -->

		<!-- load the corresponding game -->
		<div v-if="words.length > 0">
			<language-list v-if="game === 'list'" />
			<language-type v-else-if="game === 'type'" />
			<language-guess v-else-if="game === 'guess'" />
			<language-memory v-else-if="game === 'memory'" />
			<language-decks v-else-if="game === 'deck'" />
		</div>
	</section>
</template>
