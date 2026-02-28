<script
	lang="ts"
	setup
>

//REFACTOR: Refactor pour le rendre plus propre et structuré.

import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {onKeyStroke} from "@vueuse/core"
import {computed, onMounted, ref} from "vue"
import axios from "axios"
import ScButton from "@/Components/Ui/Button/scButton.vue"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()

onKeyStroke([
	..."abcdefghijklmnopqrstuvwxyz".split(""),
	"Backspace", "Enter",
	"ArrowLeft", "ArrowRight"
], (e) => {
	if (gameIsRunning.value === false) {
		return
	}

	if (e.key === "Enter") {
		validate()
		return
	}
	if (e.key === "Backspace") {
		backspace()
		return
	}

	if (e.key === "ArrowLeft") {
		if (letterId.value > 0) {
			letterId.value--
		}
		return
	}

	if (e.key === "ArrowRight") {
		if (letterId.value < target.value.length - 1) {
			letterId.value++
		}
		return
	}

	if (e.key.length === 1) {
		setLetter(e.key.toUpperCase())
	}
})


interface IGuess {
	word: string,
	lettersClass: string[]
}

const WORD_LENGTH = ref<number>(5)
const WORD_LANGUAGE = ref<string>("fr")
const GUESSES_LIMIT = ref<number>(6)
const gameIsRunning = ref(false)

const target = ref<string>("")
const nextWord = ref<string>("")

const guesses = ref<IGuess[]>([])
const guessId = ref<number>(0)
const letterId = ref<number>(0)
const message = ref<string>("")

const guess = computed<string>(() => {
	return guesses.value[guessId.value]?.word ?? ""
})

function prepareNextWord() {
	axios.get(route('api.dico.fetch', {
			language: WORD_LANGUAGE.value,
			number: 1,
			size: WORD_LENGTH.value
		}
	))
		.then(response => {
			nextWord.value = response.data[0]
		})
		.catch(error => {
			console.error(error)
		})
}

async function startGame() {
	gameIsRunning.value = true

	target.value = nextWord.value
	// Choose a word
	// The word must be "WORD_LENGTH" characters long
	// The word must not have more than 2 same letters.
	prepareNextWord()


	// target.value = _.sample(availableWords.value)

	// Reset guesses
	guesses.value = Array.from({length: GUESSES_LIMIT.value}, () => ({
		word: " ".repeat(WORD_LENGTH.value),
		lettersClass: []
	}))
	guessId.value = 0

	letterId.value = 0
}

function setLetter(letter: string) {
	message.value = ""

	// Current word

	// replace the nth letter
	guesses.value[guessId.value].word = guess.value.substring(0, letterId.value) + letter + guess.value.substring(letterId.value + 1)

	if (letterId.value < target.value.length - 1) {
		letterId.value++
	}
}

function selectLetter(row: number, index: number) {
	if (row === guessId.value) {
		letterId.value = index
	}
}

function backspace() {
	message.value = ""

	// Remove the letter in the current position
	guesses.value[guessId.value].word = guess.value.substring(0, letterId.value) + " " + guess.value.substring(letterId.value + 1)

	// select previous item
	if (letterId.value > 0) {
		letterId.value--
	}
}

function letterClass(row: number, index: number) {
	if (row > guessId.value) {
		return "letter-unknown"
	}

	if (row === guessId.value) {
		return index === letterId.value ? "letter-selected" : "letter-unknown"
	}

	return guesses.value[row].lettersClass[index] ?? "letter-unknown"
}

async function validate() {
	const wordExists = await axios.get(route('api.dico.exists', {
		language: WORD_LANGUAGE.value,
		word: guess.value
	}))
		.then(response => {
			return response.data
		})
		.catch(error => {
			console.error(error)
			return false
		})

	if (!wordExists) {
		message.value = "Le mot n'existe pas !"
		return
	}

	const targetLetterCount: Record<string, number> = {}

	target.value.split("").forEach(letter => {
		if (targetLetterCount[letter] === undefined) {
			targetLetterCount[letter] = 0
		}
		targetLetterCount[letter]++
	})

	const lettersClass: string[] = []
	// Correct letters
	guess.value.split("").forEach((letter, index) => {
		if (target.value[index] === letter) {
			targetLetterCount[letter]--
			lettersClass.push("letter-correct")
		} else {
			lettersClass.push("letter-wrong")
		}
	})

	// Incorrect letters
	guess.value.split("").forEach((letter, index) => {
		if (lettersClass[index] === "letter-wrong") {
			if (target.value.indexOf(letter) === -1) {
				lettersClass[index] = "letter-wrong"
			} else {
				if (targetLetterCount[letter] > 0) {
					targetLetterCount[letter]--
					lettersClass[index] = "letter-misplaced"
				}
			}
		}
	})

	guesses.value[guessId.value] =
		{
			word: guess.value,
			lettersClass
		}

	if (target.value === guess.value) {
		message.value = "Bravo ! Vous avez trouvé le mot " + target.value
		guessId.value = GUESSES_LIMIT.value
		return
	}

	// Next id
	guessId.value++

	if (guessId.value >= GUESSES_LIMIT.value) {
		message.value = "Perdu ! Le bon mot était " + target.value
		return
	}

	// Reset the guess
	letterId.value = 0

	message.value = ""
}

const letterMapping = [
	"QWERTZUIOP",
	"ASDFGHJKL",
	"YXCVBNM"
]

const keyboard = computed<Record<string, string>>(() => {
	const dict: Record<string, string> = {}
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
		if (letter !== "") {
			dict[letter] = "letter-unknown"
		}
	})

	// A keyboard letter is (dark gray = disabled) if the letter is in guesses[].word with bg-gray-300
	// A keyboard letter is (light green = enabled) if the letter is in guesses[].word with bg-green-300
	guesses.value.forEach((value, row) => {
		if (row >= guessId.value) {
			return
		}

		value.word.split("").forEach((letter, index) => {
			if (Object.hasOwn(dict, letter)) {
				if (dict[letter] === "letter-correct") {
					return
				}

				// It's a correct letter
				if (value.lettersClass[index] === "letter-correct") {
					dict[letter] = "letter-correct"
					return
				}

				if (dict[letter] === "letter-misplaced") {
					return
				}
				// It's a misplaced letter
				if (value.lettersClass[index] === "letter-misplaced") {
					dict[letter] = "letter-misplaced"
					return
				}

				dict[letter] = "letter-not-present"

			}
		})
	})
	return dict
})

onMounted(() => {
	// prepareNextWord()
	//
	// nextWord.value = "PATOU"
	//
	// startGame()
	//
	// "CAPOT".split("").forEach(letter => {
	// 	setLetter(letter)
	// })
	// validate()
})

</script>
<template>
	<article class="scolcours-container py-20">
		<!-- configuration -->
		<div
			v-if="!gameIsRunning"
			class="max-w-lg mx-auto space-y-10"
		>
			<h2 class="text-2xl">
				Wordle
			</h2>
			<div class="grid grid-cols-3 gap-5">
				<form-maker
					label="langue"
					type="select"
					v-model="WORD_LANGUAGE"
					:choices="{fr: 'français'}"
				/>
				<form-maker
					v-model="WORD_LENGTH"
					label="nombre de lettres"
					type="number"
				/>
				<form-maker
					v-model="GUESSES_LIMIT"
					label="nombre d'essais"
					type="number"
				/>
			</div>
			<div class="text-center">
				<sc-button
					@click="startGame"
					xl
					type="primary"
				>
					commencer
				</sc-button>
			</div>
		</div>

		<!-- game is running -->
		<div
			v-if="gameIsRunning"
			class="flex flex-col items-center gap-5"
		>
			<div class="flex flex-col gap-2">
				<div
					v-for="(value, index) in guesses"
					:key="`word-${index}`"
					class="flex gap-2"
				>
					<sc-button
						v-for="(letter, i) in value.word"
						:key="`letter-${index}-${i}`"
						:class="{
							'bg-blue-200': letterClass(index, i) === 'letter-selected',
							'bg-gray-300' : letterClass(index, i) === 'letter-wrong',
							'bg-gray-400 text-gray-700': letterClass(index, i) === 'letter-not-present',
							'outline-orange-400 bg-orange-200 text-orange-800': letterClass(index, i) === 'letter-misplaced',
							'outline-green-600 bg-green-300 text-green-800': letterClass(index, i) === 'letter-correct'
						}"
						p0
						class="w-[2em] md:w-[3em] aspect-square border border-slate-400 text-lg font-semibold"
						@click="selectLetter(index, i)"
					>
						{{ letter }}
					</sc-button>
				</div>
			</div>

			<div
				v-for="(row, index) in letterMapping"
				:key="`row-${index}`"
				class="flex gap-1 md:gap-2 mx-auto"
			>
				<sc-button
					v-for="letter in row"
					:key="`key-${letter}`"
					:class="{
						'bg-blue-200': keyboard[letter] === 'letter-selected',
						'bg-gray-300' : keyboard[letter] === 'letter-wrong',
						'bg-gray-400 text-gray-700': keyboard[letter] === 'letter-not-present',
						'outline-orange-400 bg-orange-200 text-orange-800': keyboard[letter] === 'letter-misplaced',
						'outline-green-600 bg-green-300 text-green-800': keyboard[letter] === 'letter-correct'
					}"
					p0
					class="w-[8vw] md:w-[3em] aspect-square grid place-items-center"
					@click="setLetter(letter)"
				>
					{{ letter }}
				</sc-button>
				<sc-button
					v-if="index === 2"
					class="ml-3 py-0 md:py-3 px-5"
					@click="backspace"
				>
					<i class="bi bi-backspace" />
				</sc-button>
			</div>

			<div class="flex flex-col gap-5">
				<sc-button
					v-if="guessId < GUESSES_LIMIT"
					:outline="guess.includes(' ')"
					:disabled="guess.includes(' ')"
					class="outline px-20"
					@click="validate"
				>
					{{ guess.includes(" ") ? "mot à compléter" : "valider" }}
				</sc-button>
				<sc-button
					v-else
					type="primary"
					@click="startGame"
				>
					Nouveau mot
				</sc-button>
				<div>{{ message }}</div>
			</div>

			<div v-show="editMode.enable">
				<div>Le mot à chercher: {{ target }}</div>
			</div>
		</div>
	</article>
</template>
