<script
	lang="ts"
	setup
>

// Set the main layout.
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { computed, ComputedRef, provide, Ref, ref } from "vue"
import type { TranslationUnitInterfaceExtended, TranslationWord } from "@/types/modelInterfaces"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"
import LanguageList from "@/Components/Languages/LanguageList.vue"
import LanguageType from "@/Components/Languages/LanguageType.vue"
import LanguageGuess from "@/Components/Languages/LanguageGuess.vue"
import LanguageMemory from "@/Components/Languages/LanguageMemory.vue"
import { useLanguage } from "@/Components/Languages/useLanguage"

interface LanguageInterface {
	game: "list" | "type" | "memory" | "guess",
	code: "it" | "en" | "de",
	language: "italiano" | "english" | "deutsch",
}

interface LanguagePropsInterface extends LanguageInterface {
	units: TranslationUnitInterfaceExtended[]
}

export interface LanguageDataInterface extends LanguageInterface {
	units: Ref<TranslationUnitInterfaceExtended[]>,
	state: Ref<"intro" | "running" | "finished">,
	words: ComputedRef<TranslationWord[]>
}

defineOptions({ layout: LayoutMain })

// Degine the props coming in (save for all)
const props = defineProps<LanguagePropsInterface>()

// Make the units data reactive
const unitsSelection = ref<TranslationUnitInterfaceExtended[]>(
	props.units.map(unit => {
		return {
			...unit,
			selected: false,
			words: []
		}
	}))

const { selectedWords } = useLanguage(unitsSelection.value)

/** Current game state:
 * intro:   the game is in configuration mode
 * running: the game is running
 * finished: the game is waiting for either restart or choose other units or configure...
 */
const state = ref<"intro" | "running" | "finished">("intro")

// Get the words for the currently selected units
const words = computed(() => selectedWords(false))

provide<LanguageDataInterface>("LanguageData", {
	code: props.code,
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
		<ArticleTitle :title="language" />

		<Link :href="`/${language}`" class="hover:pl-2 transition-all duration-300">
		<i class="bi bi-arrow-bar-left" /> retour
		</Link>

		<LanguageUnitsSelector v-show="state === 'intro'" v-model="unitsSelection" />

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
		</div>
	</section>
</template>
