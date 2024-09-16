<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import { listeDeMots } from "@/helpers/liste-des-mots-francais"
import { listeDeMots as dictionary } from "@/helpers/liste-des-mots-francais-pli07"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { onKeyStroke } from "@vueuse/core"
import _ from "lodash"
import { computed, inject, ref } from "vue"

onKeyStroke([
	..."abcdefghijklmnopqrstuvwxyz".split(""),
	"Backspace", "Enter",
	"ArrowLeft", "ArrowRight"
], (e) => {
	if(gameIsRunning.value === false) {
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

defineOptions({ layout: LayoutMain })

const editMode = inject<boolean>("editMode")

interface IGuess {
	word: string,
	lettersClass: string[]
}

const WORD_LENGTH = ref<number>(5)
const WORD_LANGUAGE = ref<string>("fr")
const GUESSES_LIMIT = ref<number>(6)
const gameIsRunning = ref(false)
const target = ref<string>("")
const guesses = ref<IGuess[]>([])
const guessId = ref<number>(0)
const letterId = ref<number>(0)
const message = ref<string>("")

const guess = computed<string>(() => {
	return guesses.value[guessId.value]?.word ?? ""
})

function startGame() {
	gameIsRunning.value = true
	// Choose a word
	// The word must be "WORD_LENGTH" characters long
	// The word must not have more than 2 same letters.
	target.value = _.sample(availableWords.value)

	// Reset guesses
	guesses.value = Array.from({ length: GUESSES_LIMIT.value }, () => ({ word: " ".repeat(WORD_LENGTH.value), lettersClass: [] }))
	guessId.value = 0

	letterId.value = 0
}

function setLetter(letter: string) {
	// Current word

	// replace the nth letter
	guesses.value[guessId.value].word = guess.value.substring(0, letterId.value) + letter + guess.value.substring(letterId.value + 1)

	if (letterId.value < target.value.length - 1) {
		letterId.value++
	}
}

function selectLetter(row: number, index: number){
	if(row === guessId.value){
		letterId.value = index
	}
}
function backspace() {
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

function validate() {
	if (dictionary.indexOf(guess.value) === -1) {
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

const dictionaryWords = computed<string[]>(() => {
	return dictionary.filter(x => x.length === WORD_LENGTH.value)
})

const availableWords = computed<string[]>(() => {
	return listeDeMots.filter(x => x.length === WORD_LENGTH.value)
		.filter(word => {
			const letterCount: Record<string, number> = {}
			return word.split("").every(letter => {
				if (letterCount[letter] === undefined) {
					letterCount[letter] = 0
				}
				letterCount[letter]++
				return letterCount[letter] <= 2
			})
		})
})
const filteredWords = computed<string[]>(() => {
	if (guess.value.trim().length === 0) return []
	return dictionaryWords.value.filter(word => word.startsWith(guess.value.trim()))
})

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

</script>
<template>
	<article class="scolcours-container py-20">
		<div
			v-if="!gameIsRunning"
			class="max-w-lg mx-auto space-y-10"
		>
			<h2 class="text-2xl">
				Wordle
			</h2>
			<div class="grid grid-cols-3 gap-5">
				<form-maker
					v-model="WORD_LANGUAGE"
					label="langue"
					type="select"
				>
					<option
						selected
						value="fr"
					>
						français
					</option>
				</form-maker>
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
				<button
					@click="startGame"
					class="btn btn-lg btn-primary"
				>
					commencer
				</button>
			</div>
		</div>
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
					<div
						v-for="(letter, i) in value.word"
						:key="`letter-${index}-${i}`"
						:class="letterClass(index, i)"
						class="w-[2em] md:w-[3em] aspect-square grid place-items-center"
						@click="selectLetter(index, i)"
					>
						{{ letter }}
					</div>
				</div>
			</div>

			<div
				v-for="(row, index) in letterMapping"
				:key="`row-${index}`"
				class="flex gap-1 md:gap-2 mx-auto"
			>
				<button
					v-for="letter in row"
					:key="`key-${letter}`"
					:class="keyboard[letter]"
					class="w-[1.5em] md:w-[3em] aspect-square grid place-items-center"
					s
					@click="setLetter(letter)"
				>
					{{ letter }}
				</button>
				<button
					v-if="index===2"
					class="btn bg-white ml-3 py-0 md:py-3 px-5"
					@click="backspace"
				>
					<i class="bi bi-backspace" />
				</button>
			</div>
			<div class="flex flex-col gap-5">
				<button
					v-if="guessId < GUESSES_LIMIT"
					:class="guess.includes(' ') ? 'bg-gray-100' : 'bg-blue-300 hover:bg-blue-400'"
					:disabled="guess.includes(' ')"
					class="btn px-20"
					@click="validate"
				>
					{{ guess.includes(" ") ? "mot à compléter" : "valider" }}
				</button>
				<button
					v-else
					class="btn bg-orange-300 hover:bg-orange-400"
					@click="startGame"
				>
					Nouveau mot
				</button>
				<div>{{ message }}</div>
			</div>
			<div v-show="editMode">
				<div>Il y a {{ availableWords.length }} mots possible. Le mot à chercher: {{ target }}</div>
				<div class="font-code">
					{{ filteredWords.join(", ") }}
				</div>
			</div>
		</div>
	</article>
</template>

<style>

.letter-selected {
	@apply bg-blue-300;
}

.letter-unknown {
	@apply bg-gray-300;
}

.letter-not-present {
	@apply bg-gray-600 text-white;
}

.letter-wrong {
	@apply bg-gray-300;
}

.letter-misplaced {
	@apply bg-orange-600 text-white;
}

.letter-correct {
	@apply bg-green-600 text-white;
}
</style>
