<script
	lang="ts"
	setup
>
// Set the main layout.
import LayoutMain from "@/Layouts/LayoutMain.vue"

import LanguageGuess from "@/Components/Languages/LanguageGuess.vue"
import LanguageList from "@/Components/Languages/LanguageList.vue"
import LanguageMemory from "@/Components/Languages/LanguageMemory.vue"
import LanguageType from "@/Components/Languages/LanguageType.vue"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import type {BookInterface, TranslationUnitInterfaceExtended, TranslationWord} from "@/types/modelInterfaces"
import {computed, provide, Ref, ref} from "vue"
import LanguageDecks from "@/Components/Languages/LanguageDecks.vue"
import LanguageMatch from "@/Components/Languages/LanguageMatch.vue"

defineOptions({layout: LayoutMain})

interface LanguageInterface {
	game: "list" | "type" | "memory" | "guess" | "deck" | "match",
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
	words: Ref<TranslationWord[]>
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

/** Current game state:
 * intro:   the game is in configuration mode
 * running: the game is running
 * finished: the game is waiting for either restart or choose other units or configure...
 */
const state = ref<"intro" | "running" | "finished">("intro")

const words = ref<TranslationWord[]>([])
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

const wrongWords = computed(() => {
	return words.value.filter(x => x.result === false)
})
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

		<!-- load the corresponding game config -->
		<div v-if="state!=='finished'">
			<language-list v-if="game === 'list'" />
			<language-type v-else-if="game === 'type'" />
			<language-guess v-else-if="game === 'guess'" />
			<language-memory v-else-if="game === 'memory'" />
			<language-decks v-else-if="game === 'deck'" />
			<language-match v-else-if="game === 'match'" />
		</div>

		<div
			v-if="state==='finished'"
			class="grid place-items-center space-y-5"
		>
			<div class="text-3xl">
				Bravo !
			</div>
			<div class="text-xl">
				Vous avez parcouru {{ words.length }} mots.
			</div>

			<div>
				<button
					class="btn-primary px-20 py-10 text-2xl"
					@click="state='intro'"
				>
					Retour à la configuration
				</button>
			</div>
			<div
				class="text-xl"
				v-if="wrongWords.length>0"
			>
				Mais vous avez fait quelques {{ wrongWords.length }} fautes.

				<table class="text-xs">
					<thead>
						<tr>
							<th>français</th>
							<th>{{ props.language.name }}</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="w in wrongWords"
							:key="`${w.foreign}`"
						>
							<td>{{ w.fr }}</td>
							<td>{{ w.foreign }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>
</template>
