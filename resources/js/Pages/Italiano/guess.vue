<template>
	<article>
		<ArticleTitle title="Italia Unit" />
		<Link
			href="/italiano"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" />  retour
		</Link>
		
		<div v-if="!gameStopped">
			<div class="text-2xl my-10">
				{{ currentWordIt }}
			</div>

			<form-input
				v-model="userGuess"
				name="guess"
				:label="numberOfLetters>1?`entrer les ${numberOfLetters} premières lettres`:'entrer la première lettre'"
				@keyup.enter="suggestionEnter"
			/>

			<div class="text-xs">
				Mot {{ startIndex + 1 }} sur {{ availableWords.length }}
			</div>

			<div
				v-if="suggestions.length>0"
				ref="suggestionsWrapper"
				class="suggestions flex flex-col bg-white border rounded my-4 divide-y"
			>
				<div
					v-for="(word, index) in suggestions"
					:key="index"
					class="px-4 py-3 hover:bg-amber-100 transition-all duration-300 cursor-pointer"
					@click="suggestionClick(word)"
				>
					{{ word[0] }}
				</div>
			</div>

			<div class="mt-5">
				<button
					class="btn-cancel btn-xs"
					@click="unknownWord"
				>
					Je ne sais pas
				</button>
			</div>
		</div>

		<div
			v-if="gameStopped"
			class="mt-10 flex items-end justify-between"
		>
			<button
				class="btn-primary"
				@click="startGame"
			>
				Commencer
			</button>

			<form-number
				v-model="numberOfLetters"
				label="nombre de lettres min."
				name="nombre de lettres"
			/>

			<form-input
				v-model="unitsSelection"
				label="sélection des unités"
				name="selectionunit"
			/>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"

import {vocabulare} from "@/Pages/Italiano/italianoUnita"

let availableWords = ref([]),
	numberOfLetters = ref(2),
	userGuess = ref(""),
	determinants = ["il ", "la ", "le ", "lo ", "i ", "l'", "gli "],
	suggestions = computed(()=>{
		if(userGuess.value.length<numberOfLetters.value){return []}

		const txt = userGuess.value.toLowerCase()

		return availableWords.value.filter(x=> {
			for(let det of determinants){
				if(x[0].toLowerCase().startsWith(`${det}${txt}`)){
					return true
				}
			}

			return x[0].toLowerCase().startsWith(txt)
		})
	}),
	suggestionsWrapper = ref(null),
	startIndex = ref(0),
	cards = ref([]),
	unitsSelection = ref("1"),
	units = computed(() => {
		return unitsSelection.value.split(",").filter(x=>!isNaN(x)).map(x => +x)
	}),
	currentWordIt = computed(()=>{
		if (availableWords.value.length===0){return ""}
		return availableWords.value[startIndex.value][1]
	}),
	gameStopped = ref(true)


let startGame = function () {
	if(availableWords.value.length===0) {
		generateWords()
	}

	gameStopped.value = false
}

let continueGame = function (enter){
	userGuess.value = ""
	startIndex.value ++

	if(startIndex.value===availableWords.value){
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
	}
}

let generateWords = function() {
	// All words available
	startIndex.value = 0
	let words = []
	for (let unit in vocabulare) {
		if (units.value.includes(+unit)) {
			words = words.concat(vocabulare[unit])
		}
	}

	// availableWords.value = PiMath.Random.array(words, numberOfCards.value)
	availableWords.value = PiMath.Random.shuffle(words)

}

let suggestionEnter = function (){
	if(suggestions.value.length===1){
		suggestionClick(suggestions.value[0])
	}
}
let suggestionClick = function(word) {
	if(word[0] === availableWords.value[startIndex.value][0]){
		// Continue the game
		continueGame()
	}else{
		shake()
	}
}

let unknownWord = function () {
	availableWords.value.push([...availableWords.value[startIndex.value]])
	continueGame()
}


function shake() {
	suggestionsWrapper.value.style.setProperty("animation-name", "v-shake-horizontal")
	suggestionsWrapper.value.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		suggestionsWrapper.value.style.setProperty("animation-name", "")
	}, 500)

}
</script>
