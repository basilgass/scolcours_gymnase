<!--<info>
parameters:

code:
</info>-->
<script lang="ts" setup>

// TODO: doit être reformaté pour une meilleure lisibilité

import {flashInterface} from "@/types"
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, inject, onMounted, ref} from "vue"
import axios from "axios"

const flash = inject<flashInterface>("flash")

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const parameters = computed<string[]>(() => {
	if (!props.illustration.parameters) return []

	return props.illustration.parameters.split(",")
})

const wordTries = ref(0)

const referenceWord = ref<string>("")

const originalCharacters = computed(() => {
	return referenceWord.value
		.split("")
		.filter(char => char !== " ")
})

/**
 * Get the duplicated characters in the code
 * and the number of each
 */
const duplicatedCharacters = computed<Record<string, number>>(() => {
	const characters = referenceWord.value
		.split("")
		.filter(char => char !== " ")

	const duplicates = characters.reduce((acc, char) => {
		if (acc[char] === undefined) {
			acc[char] = 1
		} else {
			acc[char]++
		}
		return acc
	}, {})

	// Remove the characters that are not duplicated
	Object.keys(duplicates).forEach(key => {
		if (duplicates[key] === 1) {
			delete duplicates[key]
		}
	})

	refreshDivisions(duplicates)

	return duplicates
})

const hasDuplicates = computed(() => {
	return Object.keys(duplicatedCharacters.value).length > 0
})

// Determine the max length of the word, based on len=# parameter
const randomWordLength = computed(() => {
	// Find the item from parameters computed properties that starts with len=
	const len = parameters.value.find(x => x.startsWith("len="))

	// If the item is found, return the value after the equal sign
	if (len) return parseInt(len.split("=")[1])

	return 0
})

const outputLength = computed(() => {
	const len = parameters.value.find(x => x.startsWith("output="))

	return len ? parseInt(len.split("=")[1]) : referenceWord.value.length
})

// Determine if the words to use can contain duplicated letters or not, based on the existing parameter: dup
const withoutDuplicateLetters = computed(() => {
	// If the number of letters from the reference word is different than the output length, we must not have duplicates !
	if (outputLength.value !== referenceWord.value.length) return true

	// Find the item from parameters computed properties that starts with dup=
	return parameters.value.find(x => x === "no-dup") !== undefined
})

// Get the letters from the code
// and remove the letters in currentWord (the word that the user is trying to find)
// Do not remove duplicated characters
const availableLetters = computed(() => {
	const originalLetters = referenceWord.value
		.split("")
		.filter(char => char !== " ")

	// Remove the letters that are already in the currentWord
	currentWord.value.split("").forEach(element => {
		const index = originalLetters.indexOf(element)
		if (index !== -1) {
			originalLetters.splice(index, 1)
		}
	})

	return originalLetters
})

const currentLetter = ref(0)

const currentWord = ref("")

const possibilities = ref([])

const divisions = ref([])

function refreshDivisions(duplicates) {
	divisions.value = []

	// No duplicates.
	if (Object.keys(duplicates).length === 0) {
		return
	}

	Object.keys(duplicates).forEach(() => {
		divisions.value.push(false)
	})
}

function addLetter(element) {
	possibilities.value.push(availableLetters.value.length)
	currentWord.value += element
	currentLetter.value++
}

function applyDivision(index: number, value: number, letter: string) {
	// The division is enabled - cannot be removed !
	divisions.value[index] = true

	// Flash a message
	flash.success(
		`Il y a \\(${value}! = ${factoriel(value)}\\) façons de réarranger les lettres ${letter}`,
		{timeout: 5 * 1000}
	)
}

function factoriel(n) {
	if (n === 0) {
		return 1
	}
	return n * factoriel(n - 1)
}

const searchingForAWord = ref(false)

const nextWord = ref<string>("")

function prepareNextWord() {
	axios.get(
		route("dico.fetch", {
				language: 'fr',
				number: 1,
				size: randomWordLength.value,
			common: 1,
				withoutDuplicateLetters: withoutDuplicateLetters.value ? 1 : 0
			}
		))
		.then(response => {
			return nextWord.value = response.data[0]
		})
		.catch(error => {
			console.log(error.response.data.message)
			return []
		})
}

async function startOver(init?: boolean) {
	// On n'est pas en initialisation - nouveau mot.
	if (!init) wordTries.value++

	// Réinitialisation des valeurs de bases.
	currentWord.value = ""
	currentLetter.value = 0
	possibilities.value = []
	divisions.value = []

	// On récupère le mot
	if (
		props.illustration.parameters?.includes("rnd") ||
		props.illustration.code === "" ||
		wordTries.value > 0
	) {

		searchingForAWord.value = true

		// Filter the list of word to show only the words with the right length
		referenceWord.value = nextWord.value

		prepareNextWord()

		searchingForAWord.value = false
		return
	}

	referenceWord.value = props.illustration.code

}

const tex = computed(() => {
	if (referenceWord.value.length === outputLength.value) return permutation()

	return arrangement()
})

function permutation() {
	const indice = [originalCharacters.value.length, ...Object.values(duplicatedCharacters.value)].filter(x => x.toString() !== "").join(",")

	// Numérateur
	const numerator = possibilities.value.join("\\cdot ")

	// Il n'y a pas de répétitions de lettres - pas de divisions
	if (divisions.value.length === 0 || divisions.value.every(x => !x)) {
		if (availableLetters.value.length === 0) {
			// Il n'y a plus de lettres disponibles
			// Le numérateur peut se réduire à une factorielle.
			return `P_{ ${indice} } = ${numerator} = ${possibilities.value[0]}! = ${factoriel(possibilities.value[0])}`
		} else {
			return `P_{ ${indice} } = ${numerator}`
		}
	}


	// Il y a des répétitions de lettres - il faut diviser
	const divisors = Object.values(duplicatedCharacters.value)
		.map((value, index) => divisions.value[index] ? `${value}!` : "")
		.filter(x => x !== "")
		.join("\\cdot ")
	const divisorResult = Object.values(duplicatedCharacters.value)
		.map((value, index) => divisions.value[index] ? factoriel(value) : 1)
		.reduce((acc, value) => acc * value, 1)

	if (availableLetters.value.length === 0) {
		// Il n'y a plus de lettres disponibles
		// Le numérateur peut se réduire à une factorielle.
		return `P_{ ${indice} } = \\frac{ ${numerator} }{ ${divisors} } = \\frac{ ${possibilities.value[0]}! }{ ${divisors} } = \\frac{ ${possibilities.value.reduce((acc, value) => acc * value, 1)} }{ ${divisors} } = ${possibilities.value.reduce((acc, value) => acc * value, 1) / divisorResult}  `
	}
	return `P_{ ${indice} } = \\frac{ ${numerator} }{ ${divisors} }`
}

function arrangement() {
	const name = `A_{ ${referenceWord.value.length} }^{ ${outputLength.value} }`
	// Numérateur
	const numerator = possibilities.value.join("\\cdot ")

	// currentWord length is smaller  outputLength : not finished
	if (currentWord.value.length < outputLength.value) {
		return `${name} = ${numerator}`
	}

	// currentWord is same length than the outputLength -> it's finished and must display more data
	const n = possibilities.value[0]
	const d = n - outputLength.value
	return `${name} = ${numerator} = \\frac{ ${n}! }{ (${n} - ${outputLength.value})! } = ${factoriel(n) / factoriel(d)}`
}

const isFinished = computed(() => {
	// No more available letters and all the divisions are done
	return currentWord.value.length === outputLength.value && divisions.value.every(x => x)
})

// Load the first word
startOver(true)

onMounted(()=>{
	prepareNextWord()
})

</script>
<template>
	<article class="relative">
		<div
			v-if="searchingForAWord"
			class="grid place-items-center absolute inset-0 bg-gray-800 bg-opacity-95 text-white"
		>
			<p>à la recherche d'un mot</p>
		</div>

		<!-- CurrentWord -->
		<div class="display-word flex gap-4 p-3 bg-gray-200">
			<div
				v-for="index of outputLength"
				:key="`output-${index}`"
				:class="currentLetter=== index ? 'bg-sky-300' : ''"
				class="border border-gray-600 shadow-sm bg-white grid place-items-center w-12 h-12"
			>
				{{ currentWord[index - 1] ?? "" }}
			</div>
		</div>

		<!-- Available letters -->
		<div
			class="p-3"
			v-show="!isFinished"
		>
			<h2 class="font-extralight">
				Choisir une lettre parmi {{ availableLetters.length }}
			</h2>
			<div class="available-letters keyboard flex gap-2 pt-3">
				<button
					v-for="(element, index) of availableLetters"
					:key="`${element}-${index}`"
					class="border bg-gray-300 p-4 key px-4! hover:shadow-sm"
					@click="addLetter(element)"
				>
					{{ element }}
				</button>
			</div>
		</div>

		<!-- Duplicated characters -->
		<div
			v-if="hasDuplicates"
			class="flex flex-col gap-3 border-t p-3"
		>
			<h2 class="font-extralight">
				Il y a des lettres qui se répètent
			</h2>
			<div
				v-for="(value, char, index) of duplicatedCharacters"
				:key="char"
				class="flex justify-center gap-4"
			>
				<div>{{ char }} <span v-katex="'\\longrightarrow'" /> {{ value }} fois</div>
				<button
					:class="divisions[index] ? 'btn-primary' : 'btn-secondary'"
					class="btn btn-xs"
					@click="applyDivision(index, value, char as string)"
				>
					diviser par <span v-katex="`${value}!`" />
				</button>
			</div>
		</div>

		<!--  Display result -->
		<div class="border-t p-3">
			<h2 class="font-extralight mt-3">
				Le nombre de mots différents est de
			</h2>
			<div
				v-katex.left.boxed="tex"
			/>
		</div>

		<!-- Nouveau mot -->
		<div class="p-3">
			<button
				v-if="isFinished"
				class="btn btn-primary"
				@click="startOver()"
			>
				Nouveau mot
			</button>
		</div>
	</article>
</template>
