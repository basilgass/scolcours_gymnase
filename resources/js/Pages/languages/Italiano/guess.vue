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
			<div
				class="flex justify-between items-baseline"
			>
				<div class="text-2xl my-10">
					{{ currentWordIt }}
				</div>
				<div
					v-show="availableWords[startIndex].length===3"
					class="text-red-600"
				>
					{{ availableWords[startIndex][2]+1 }}ème tentative
				</div>
			</div>

			<form-input
				ref="suggestInput"
				v-model="userGuess"
				name="guess"
				:label="numberOfLetters>1?`entrer les ${numberOfLetters} premières lettres`:'entrer la première lettre'"
				@keyup.enter="suggestionEnter"
			/>

			<div class="text-xs flex justify-between">
				<div>Mot {{ startIndex + 1 }} sur {{ availableWords.length }}</div>
				<div v-if="unknownCount>0">
					{{ unknownCount }} erreur{{ unknownCount>1?'s':'' }}
				</div>
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
import {computed, nextTick, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"

import {vocabulare} from "@/Pages/languages/Italiano/italianoUnita"

let availableWords = ref([]),
	numberOfLetters = ref(2),
	userGuess = ref(""),
	determinants = ["il ", "la ", "le ", "lo ", "i ", "l'", "gli "],
	suggestions = computed(()=>{
		if(userGuess.value.length<numberOfLetters.value){return []}

		const txt = userGuess.value.toLowerCase()

		return availableWords.value.filter(x=> {
			// C'est un rajout qui vient de "Je ne sais pas".
			if(x.length===3){return false}
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
	unitsSelection = ref("1"),
	units = computed(() => {
		return unitsSelection.value.split(",").filter(x=>!isNaN(x)).map(x => +x)
	}),
	currentWordIt = computed(()=>{
		if (availableWords.value.length===0){return ""}
		return availableWords.value[startIndex.value][1]
	}),
	unknownWordAnswer = ref(""),
	unknownCount = ref(0),
	gameStopped = ref(true),
	suggestInput = ref(null)


let startGame = function () {
	if(availableWords.value.length===0) {
		generateWords()
	}

	gameStopped.value = false

	nextTick(()=>{
		suggestInput.value.focus()
	})

}

let continueGame = function (enter){
	userGuess.value = ""
	startIndex.value ++
	unknownWordAnswer.value = ""

	if(startIndex.value===availableWords.value.length){
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
	}

	suggestInput.value.focus()
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
	let word = availableWords.value[startIndex.value]
	if(word.length===2){
		availableWords.value.push([...word, 1])
	}else{
		availableWords.value.push([word[0], word[1], word[2]+1])
	}

	unknownWordAnswer.value = word[0]
	unknownCount.value++
}


function shake() {
	suggestionsWrapper.value.style.setProperty("animation-name", "v-shake-horizontal")
	suggestionsWrapper.value.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		suggestionsWrapper.value.style.setProperty("animation-name", "")
	}, 500)

}
</script>
