import {TranslationWord} from "@/types/modelInterfaces"
import {Random} from "pimath"
import {MaybeRef, ref, unref} from "vue"
import {LanguageDataInterface} from "@/Pages/Languages/LanguageShow.vue"


export function useLanguage(languageData: LanguageDataInterface, options?: {
	numberOfWords?: MaybeRef<number>,
	startGameCallback?: ()=>void,
}) {

	const selectedWords = ref<TranslationWord[]>([])
	const selectedWordsIndex = ref<number>(-1)
	const currentWords = ref<TranslationWord[]>([])

	const generateWords = function (): TranslationWord[] {
		if (languageData.words.value.length === 0) {
			return []
		}

		if (selectedWordsIndex.value < 0 ||
			selectedWordsIndex.value >= languageData.words.value.length) {
			return []
		}

		const n = unref(options?.numberOfWords) || 1
		const words = []
		for (let i = 0; i < n; i++) {
			words.push(selectedWords.value[selectedWordsIndex.value+i])
		}
		return words
	}

	const getListOfWordsFromUnits = function (random?: boolean): TranslationWord[] {
		// All words available
		let words = []
		const selectedUnits = languageData.units.value.filter(x => x.selected)

		for (const values of selectedUnits.map(x => x.words)) {
			words = words.concat(values)
		}

		return (random === undefined || random) ? Random.shuffle(words) : words
	}

	const startGame = function () {
		if (!languageData) {
			alert('Il faut sélectionner une langue.')
			return
		}

		// there is at least one unit selected
		const selectedUnits = languageData.units.value.filter(x => x.selected)

		if (selectedUnits.length === 0) {
			alert('Il faut sélectionner au moins une unité.')
			return
		}

		// tous les mots (pas besoin de les rendre aléatoires)
		languageData.words.value = getListOfWordsFromUnits(false)

		// Get the selected words
		selectedWords.value = getListOfWordsFromUnits().map(x=>{
			return {
				...x,
				result: undefined,
				errors: 0
			}
		})

		// Generate the words
		selectedWordsIndex.value = 0
		currentWords.value = generateWords()

		// Callback
		if (options?.startGameCallback) {
			options.startGameCallback()
		}

		// Change the game state
		languageData.state.value = 'running'

	}

	const continueGame = function () {
		// Select the next word
		selectedWordsIndex.value = selectedWordsIndex.value + currentWords.value.length

		// Check if the game is finished
		if (selectedWordsIndex.value >= selectedWords.value.length) {
			languageData.state.value = 'finished'
			// alert('Le jeu est terminé.')
			return
		}

		// Generate the next set of words
		currentWords.value = generateWords()
	}

	return {
		startGame,
		continueGame,
		selectedWords,
		selectedWordsIndex,
		currentWords,
		getListOfWordsFromUnits
	}
}
