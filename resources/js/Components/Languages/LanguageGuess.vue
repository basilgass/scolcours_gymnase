<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import {LanguageDataInterface} from "@/Pages/languages/LanguageShow.vue"
import type {TranslationWord} from "@/types/modelInterfaces"
import {computed, inject, nextTick, ref} from "vue"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"
import {shake} from "@/helpers/helperFunctions.ts"

// Game configuration
const numberOfLetters = ref(2)

// Default gameplay
const languageData = inject<LanguageDataInterface>("LanguageData")
const {startGame, continueGame, selectedWords, selectedWordsIndex} = useLanguage(languageData, {
	startGameCallback: () => {
		nextTick(() => suggestInput.value.focus())
	}
})

function nextWord(){
	// Reset the input (user guess)
	userGuess.value = ""

	// Hide the answer helper.
	resetUnknowns()

	// Continue the game
	continueGame()

	// if the game is not finished, select the input.
	nextTick(() => suggestInput.value.focus())
}

// Specific gameplay
const userGuess = ref("")

const determinants = computed<string[]>(() => {
	return languageData.language.determinants.split(",")
})
const suggestionsWrapper = ref(null)
const currentWordForeign = computed(() => {
	return selectedWords.value[selectedWordsIndex.value].fr
})

const unknownWordAnswer = ref("")
const unknownWordForeign = ref("")
const unknownWordExamples = ref([])
const unknownWordDefinition = ref("")
const unknownCount = ref(0)
const suggestInput = ref(null)
const suggestionEnter = function () {
	if (suggestionsItems.value.length === 1) {
		suggestionClick(0)
	}
}

let suggestionTimeout: number = null

const suggestionClick = function (index: number) {
	// Highlight the word
	selectedSuggestion.value = index

	if (suggestionsItems.value[index].foreign === selectedWords.value[selectedWordsIndex.value].foreign) {
		// We found the good word !
		selectedWords.value[selectedWordsIndex.value].result = true

		// Disabled the input.
		unknownWordAnswer.value = ""

		// Continue the game after 1 second.
		setTimeout(() => {
			nextWord()
		}, 800)
	} else {
		selectedWords.value[selectedWordsIndex.value].result = false
		shake(suggestionsWrapper.value.children[index])

		defineUnknowns(suggestionsItems.value[index])
		window.clearTimeout(suggestionTimeout)
		suggestionTimeout = setTimeout(() => {
			selectedSuggestion.value = undefined
		}, 2000)

	}

	// On sauvegarde la valeur en mémoire...
	// saveToLocalStorage()
}

const defineUnknowns = function (item: TranslationWord) {
	unknownWordForeign.value = item.foreign
}
const resetUnknowns = function () {
	unknownWordAnswer.value = ""
	unknownWordForeign.value = ""
	selectedSuggestion.value = undefined
}

/**
 * User has clicked on "unknown word"
 * 1. add the item at the end of the list
 * 2. increment the number of errors for this word
 *
 */
const unknownWord = function () {
	// duplicate the word
	const item = {...selectedWords.value[selectedWordsIndex.value]}

	// increment the number of errors
	if (!item.errors) {
		item.errors = 1
	} else {
		item.errors++
	}

	// Add it to the end of the words list.
	selectedWords.value.push({...item})

	// Increment the global unknown words / errors.
	unknownCount.value++

	// set the unknown word - it disabled the userGuess input
	unknownWordAnswer.value = item.foreign

	// show the definition
	defineUnknowns(item)

	// update the localStorage with the new values.
	// saveToLocalStorage(1)

	// reset the suggestion input
	userGuess.value = ""

}


function stripDeterminant(text: string): string {
	for (const det of determinants.value) {
		if (text.startsWith(det)) {
			return text.substring(det.length).trim()
		}
	}

	return text
}

const suggestionsItems = computed<TranslationWord[]>(() => {
	const txt = stripDeterminant(userGuess.value.toLowerCase())


	return selectedWords.value
		.filter(x => {
			// C'est un rajout qui vient de "Je ne sais pas".
			if (x.errors > 0) {
				return false
			}

			let translation = x.foreign.toLowerCase()

			// On filtre les déterminants
			translation = stripDeterminant(translation)

			// Le mot cherché a moins de lettre que le nombre de lettres actuelles.
			if (txt === translation) {
				return true
			}

			// On retourne uniquement s'il commence
			return txt.length >= numberOfLetters.value && translation.startsWith(txt)
		})
})
const selectedSuggestion = ref<number>(undefined)


// TODO: Language system : restore the game from localStorage -> make something global
// const localStorageKey = computed(() => {
// 	return `scolcours_guess_${languageData.language}`
// })
//
// function saveToLocalStorage(addToIndex?: number) {
// 	localStorage.setItem(localStorageKey.value,
// 		JSON.stringify(
// 			{
// 				"index": startIndex.value + (addToIndex ? addToIndex : 0),
// 				"words": words.value,
// 				"unknowns": unknownCount.value
// 			}
// 		)
// 	)
// }
// function removeFromLocalStorage() {
// 	localStorage.removeItem(localStorageKey.value)
// }
// onMounted(() => {
// 	const previousData = localStorage.getItem(localStorageKey.value)
// 	if (previousData) {
// 		if (confirm("Il y a des valeurs en mémoire... continuer ?")) {
// 			const localData = JSON.parse(previousData)
// 			words.value = localData.words as GuessWord[]
// 			startIndex.value = localData.index as number
// 			unknownCount.value = localData.unknowns as number
//
// 			languageData.state.value = "running"
// 		} else {
// 			removeFromLocalStorage()
// 		}
// 	}
// })
</script>
<template>
	<article>
		<div v-if="languageData.state.value === 'running'">
			<div class="flex justify-between items-baseline">
				<div class="text-2xl my-10">
					{{ currentWordForeign }}
				</div>
				<div
					v-show="selectedWords[selectedWordsIndex]?.errors"
					class="text-red-600"
				>
					{{ selectedWords[selectedWordsIndex]?.errors }}ème tentative
				</div>
			</div>

			<form-maker
				ref="suggestInput"
				v-model="userGuess"
				:disabled="unknownWordAnswer !== ''"
				:label="numberOfLetters > 1 ? `entrer les ${numberOfLetters} premières lettres` : 'entrer la première lettre'"
				autcomplete="off"
				name="guess"
				@keyup="resetUnknowns"
				@keyup.enter="suggestionEnter"
			/>

			<div class="text-xs flex justify-between">
				<div>Mot {{ selectedWordsIndex + 1 }} sur {{ selectedWords.length }}</div>
				<div v-if="unknownCount > 0">
					{{ unknownCount }} erreur{{ unknownCount > 1 ? "s" : "" }}
				</div>
			</div>

			<div
				v-if="suggestionsItems.length > 0"
				ref="suggestionsWrapper"
				class="suggestions flex flex-col bg-white border rounded my-4 divide-y"
			>
				<div
					v-for="(word, index) in suggestionsItems"
					:key="`${word.foreign}-${index}`"
					class="px-4 py-3 hover:bg-amber-100 transition-all duration-300 cursor-pointer flex justify-between overflow-hidden relative"
					@click="suggestionClick(index)"
				>
					<div>
						{{ word.foreign }}
						<transition name="slide-fade-left">
							<i
								v-show="selectedSuggestion === index && word.foreign === selectedWords[selectedWordsIndex].foreign"
								class="bi bi-check text-green-600"
							/>
						</transition>
					</div>
					<transition name="slide-fade-right">
						<div v-show="selectedSuggestion === index">
							{{ word.fr }}
						</div>
					</transition>
				</div>
			</div>

			<div class="mt-5 flex gap-3">
				<button
					v-show="unknownWordAnswer === ''"
					class="btn btn-cancel btn-xs"
					@click="unknownWord"
				>
					Je ne sais pas
				</button>
				<div v-text="unknownWordAnswer" />
				<button
					v-show="unknownWordAnswer !== ''"
					class="btn btn-primary btn-xs"
					@click="nextWord"
				>
					continuer
				</button>
			</div>

			<div
				v-if="unknownWordForeign.length > 0 &&
					unknownWordExamples.length > 0 &&
					unknownWordDefinition.length > 0"
			>
				<h2 class="text-xl font-semibold mt-10">
					{{ unknownWordForeign }}
				</h2>
			</div>
		</div>

		<div v-else-if="languageData.state.value === 'intro'">
			<div class="my-3">
				<h2 class="text-lg font-extralight mb-2 uppercase">
					configuration des suggestions
				</h2>
				<div class="flex gap-3">
					<form-maker
						v-model="numberOfLetters"
						label="nombre de lettres min."
						name="nombre de lettres"
						type="number"
					/>
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
