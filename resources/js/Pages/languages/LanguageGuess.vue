<script setup lang="ts">
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import { computed, nextTick, onMounted, PropType, ref, watch } from "vue"
import { PiMath } from "pimath/esm"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { TranslationUnitInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Object as PropType<TranslationUnitInterface[]>, default: () => {}}
})
const unitsSelection = ref([]),
	localStorageKey = computed(() => {
		return `scolcours_guess_${props.language}`
	}),
	availableWords = ref([]),
	numberOfLetters = ref(2),
	userGuess = ref(""),
	determinants = computed(() => {
		if (props.language === "italiano") {
			return ["il ", "la ", "le ", "lo ", "i ", "l'", "gli "]
		} else if (props.language === "english") {
			return ["a ", "to ", "the ", "an "]
		}

		return []
	}),
	suggestionsItems = ref([]),
	suggestionsWrapper = ref(null),
	startIndex = ref(0),
	currentWordForeign = computed(() => {
		if (availableWords.value.length === 0) {
			return ""
		}
		return availableWords.value[startIndex.value].fr
	}),
	unknownWordAnswer = ref(""),
	unknownWordForeign = ref(""),
	unknownWordExamples = ref([]),
	unknownWordDefinition = ref(""),
	unknownCount = ref(0),
	gameStopped = ref(true),
	suggestInput = ref(null)


const startGame = function () {
	if (unitsSelection.value.length === 0) {
		alert("sélectionner au moins une unité !")
		return
	}
	if (availableWords.value.length === 0) {
		generateWords()
	}

	// The game has been started - store the value in the localStorage.
	saveToLocalStorage()

	gameStopped.value = false

	nextTick(() => {
		suggestInput.value.focus()
	})

}

const continueGame = function () {
	userGuess.value = ""
	startIndex.value++
	unknownWordAnswer.value = ""
	resetUnknowns()

	if (startIndex.value === availableWords.value.length) {
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
	}

	nextTick(() => suggestInput.value.focus())
}

const generateWords = function () {
	// All words available
	startIndex.value = 0
	let words = []
	for (const values of unitsSelection.value.map(x => x.words)) {
		words = words.concat(values)
	}

	availableWords.value = PiMath.Random.shuffle(words)
}

const suggestionEnter = function () {
	if (suggestionsItems.value.length === 1) {
		suggestionClick(0)
	}
}
const suggestionClick = function (index) {
	if (suggestionsItems.value[index].foreign === availableWords.value[startIndex.value].foreign) {
		// Continue the game
		availableWords.value[startIndex.value].found = true
		continueGame()
	} else {
		availableWords.value[startIndex.value].found = false
		shake(index)

		// Add the translation for one second.
		suggestionsItems.value[index].hint = true

		defineUnknowns(suggestionsItems.value[index])
		setTimeout(() => suggestionsItems.value[index].hint = false, 2000)
	}

	// On sauvegarde la valeur en mémoire...
	saveToLocalStorage()
}

const defineUnknowns = function (item) {
	unknownWordForeign.value = item.foreign
	unknownWordExamples.value = item.examples.split("|")
	unknownWordDefinition.value = item.definition
}
const resetUnknowns = function () {
	unknownWordForeign.value = ""
	unknownWordExamples.value = []
	unknownWordDefinition.value = ""
}

const unknownWord = function () {
	// add item at the end
	const item = {...availableWords.value[startIndex.value]}
	if (!item.errors) {
		item.errors = 1
	} else {
		item.errors++
	}
	availableWords.value.push({...item})
	unknownCount.value++

	// reset the suggestion input
	userGuess.value = ""
	// lock the suggestion input.

	// set the unknown word
	unknownWordAnswer.value = item.foreign
	// show the definition
	defineUnknowns(item)

	// Save the localStorage.
	saveToLocalStorage(1)

}

function shake(index) {
	const item = suggestionsWrapper.value.children[index]

	item.style.setProperty("animation-name", "v-shake-horizontal")
	item.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		item.style.setProperty("animation-name", "")
	}, 500)
}

watch(userGuess, () => {
	const txt = userGuess.value.toLowerCase()

	suggestionsItems.value = availableWords.value
		.filter(x => {
			// C'est un rajout qui vient de "Je ne sais pas".
			if (x.errors > 0) {
				return false
			}

			let translation = x.foreign.toLowerCase()
			// On filtre les déterminants
			for (const det of determinants.value) {
				if (translation.startsWith(det)) {
					translation = translation.substring(det.length)
					break
				}
			}

			// Le mot cherché a moins de lettre que le nombre de lettres actuelles.
			if (txt === translation) {
				return true
			}

			// On retourne uniquement s'il commence
			return txt.length >= numberOfLetters.value && translation.startsWith(txt)
		}).map(x => {
			return {
				foreign: x.foreign,
				fr: x.fr,
				hint: false,
				examples: x.examples,
				definition: x.definition
			}
		})
})

function saveToLocalStorage(addToIndex?: number) {
	localStorage.setItem(localStorageKey.value,
		JSON.stringify(
			{
				"index": startIndex.value + (addToIndex ? addToIndex : 0),
				"words": availableWords.value,
				"unknowns": unknownCount.value
			}
		)
	)
}

function removeFromLcalStorage() {
	localStorage.removeItem(localStorageKey.value)
}

onMounted(() => {
	const previousData = localStorage.getItem(localStorageKey.value)
	if (previousData) {
		if (confirm("Il y a des valeurs en mémoire... continuer ?")) {
			const localData = JSON.parse(previousData)
			startIndex.value = localData.index
			availableWords.value = localData.words
			unknownCount.value = localData.unknowns

			gameStopped.value = false

		} else {
			removeFromLcalStorage()
		}
	}

})
</script>
<template>
	<article>
		<ArticleTitle :title="language" />

		<Link
			:href="`/${language}`"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" /> retour
		</Link>

		<div v-if="!gameStopped">
			<div
				class="flex justify-between items-baseline"
			>
				<div class="text-2xl my-10">
					{{ currentWordForeign }}
				</div>
				<div
					v-show="availableWords[startIndex].errors"
					class="text-red-600"
				>
					{{ availableWords[startIndex].errors }}ème tentative
				</div>
			</div>

			<form-maker
				ref="suggestInput"
				v-model="userGuess"
				:disabled="unknownWordAnswer!==''"
				:label="numberOfLetters>1?`entrer les ${numberOfLetters} premières lettres`:'entrer la première lettre'"
				name="guess"
				@keyup="resetUnknowns"
				@keyup.enter="suggestionEnter"
			/>

			<div class="text-xs flex justify-between">
				<div>Mot {{ startIndex + 1 }} sur {{ availableWords.length }}</div>
				<div v-if="unknownCount>0">
					{{ unknownCount }} erreur{{ unknownCount > 1 ? 's' : '' }}
				</div>
			</div>

			<div
				v-if="suggestionsItems.length>0"
				ref="suggestionsWrapper"
				class="suggestions flex flex-col bg-white border rounded my-4 divide-y"
			>
				<div
					v-for="(word, index) in suggestionsItems"
					:key="index"
					class="px-4 py-3 hover:bg-amber-100 transition-all duration-300 cursor-pointer flex justify-between"
					@click="suggestionClick(index)"
				>
					<div>
						{{ word.foreign }}
					</div>
					<transition name="fade-right">
						<div v-show="word.hint">
							{{ word.fr }}
						</div>
					</transition>
				</div>
			</div>

			<div class="mt-5 flex gap-3">
				<button
					v-show="unknownWordAnswer===''"
					class="btn-cancel btn-xs"
					@click="unknownWord"
				>
					Je ne sais pas
				</button>
				<div v-text="unknownWordAnswer" />
				<button
					v-show="unknownWordAnswer!==''"
					class="btn-primary btn-xs"
					@click="continueGame"
				>
					continuer
				</button>
			</div>

			<div v-if="unknownWordForeign.length>0">
				<h2 class="text-xl font-semibold mt-10">
					{{ unknownWordForeign }}
				</h2>
				<div
					v-if="unknownWordExamples.length>0"
					class="mt-5"
				>
					<h3 class="border-t text-lg pt-3 mb-3 font-semibold">
						exemples
					</h3>
					<div class="flex flex-col gap-2">
						<div
							v-for="(example, index) in unknownWordExamples"
							:key="`example-${index}`"
							v-text="example"
						/>
					</div>
				</div>

				<div
					v-if="unknownWordDefinition.length>0"
					class="mt-5"
				>
					<h3 class="border-t text-lg pt-3 mb-3 font-semibold">
						définition
					</h3>
					<div v-text="unknownWordDefinition" />
				</div>
			</div>
		</div>

		<div
			v-if="gameStopped"
		>
			<LanguageUnitsSelector
				:units="props.units"
				@update="unitsSelection=$event"
			/>

			<div class="my-3">
				<h2 class="text-lg font-extralight mb-2 uppercase">
					configuration des suggestions
				</h2>
				<div class="flex gap-3">
					<form-maker
						type="number"
						v-model="numberOfLetters"
						label="nombre de lettres min."
						name="nombre de lettres"
					/>
				</div>
			</div>

			<div class="grid place-items-center mt-12">
				<button
					class="btn-primary px-20 py-10 text-2xl"
					@click="startGame"
					v-show="unitsSelection.length>0"
				>
					Commencer
				</button>
			</div>
		</div>
	</article>
</template>
