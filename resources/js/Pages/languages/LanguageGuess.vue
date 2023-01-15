<template>
	<article>
		<ArticleTitle :title="language" />

		<Link
			:href="`/${language}`"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" />  retour
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

			<form-input
				ref="suggestInput"
				v-model="userGuess"
				name="guess"
				:label="numberOfLetters>1?`entrer les ${numberOfLetters} premières lettres`:'entrer la première lettre'"
				:disabled="unknownWordAnswer!==''"
				@keyup.enter="suggestionEnter"
				@keyup="resetUnknowns"
			/>

			<div class="text-xs flex justify-between">
				<div>Mot {{ startIndex + 1 }} sur {{ availableWords.length }}</div>
				<div v-if="unknownCount>0">
					{{ unknownCount }} erreur{{ unknownCount>1?'s':'' }}
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

			<div class="mt-10 flex items-end gap-10">
				<form-number
					v-model="numberOfLetters"
					label="nombre de lettres min."
					name="nombre de lettres"
				/>
				<button
					class="btn-primary"
					@click="startGame"
				>
					Commencer
				</button>
			</div>
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
import {computed, nextTick, ref, watch} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import LanguageUnitsSelector from "@/Pages/languages/LanguageUnitsSelector.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: ()=>[]}
})
let unitsSelection = ref([]),
	availableWords = ref([]),
	numberOfLetters = ref(2),
	userGuess = ref(""),
	determinants = computed(()=>{
		if(props.language==="italiano"){
			return ["il ", "la ", "le ", "lo ", "i ", "l'", "gli "]
		}else if(props.language==="english"){
			return ["a ", "to ", "the ", "an "]
		}

		return []
	}),
	suggestionsItems = ref([]),
	suggestionsWrapper = ref(null),
	startIndex = ref(0),
	currentWordForeign = computed(()=>{
		if (availableWords.value.length===0){return ""}
		return availableWords.value[startIndex.value].fr
	}),
	unknownWordAnswer = ref(""),
	unknownWordForeign = ref(""),
	unknownWordExamples = ref([]),
	unknownWordDefinition = ref(""),
	unknownCount = ref(0),
	gameStopped = ref(true),
	suggestInput = ref(null)


let startGame = function () {
	if(unitsSelection.value.length===0){
		alert("sélectionner au moins une unité !")
		return
	}
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
	resetUnknowns()

	if(startIndex.value===availableWords.value.length){
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
	}

	nextTick(()=>suggestInput.value.focus())
}

let generateWords = function() {
	// All words available
	startIndex.value = 0
	let words = []
	for(let values of unitsSelection.value.map(x=>x.words)){
		words = words.concat(values)
	}

	availableWords.value = PiMath.Random.shuffle(words)
}

let suggestionEnter = function (){
	if(suggestionsItems.value.length===1){
		suggestionClick(0)
	}
}
let suggestionClick = function(index) {
	if(suggestionsItems.value[index].foreign === availableWords.value[startIndex.value].foreign){
		// Continue the game
		continueGame()
	}else{
		shake(index)

		// Add the translation for one second.
		suggestionsItems.value[index].hint = true

		defineUnknowns(suggestionsItems.value[index])
		setTimeout(()=>suggestionsItems.value[index].hint = false, 2000)
	}
}

let defineUnknowns = function(item) {
	unknownWordForeign.value = item.foreign
	unknownWordExamples.value = item.examples.split("|")
	unknownWordDefinition.value = item.definition
}
let resetUnknowns = function(){
	unknownWordForeign.value = ""
	unknownWordExamples.value = []
	unknownWordDefinition.value = ""
}

let unknownWord = function () {
	// add item at the end
	const item = {...availableWords.value[startIndex.value]}
	if(!item.errors){
		item.errors = 1
	}else{
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




}

function shake(index) {
	let item = suggestionsWrapper.value.children[index]

	item.style.setProperty("animation-name", "v-shake-horizontal")
	item.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		item.style.setProperty("animation-name", "")
	}, 500)
}

watch(userGuess, (newValue, oldValue)=>{
	const txt = userGuess.value.toLowerCase()

	suggestionsItems.value = availableWords.value
		.filter(x=> {
			// C'est un rajout qui vient de "Je ne sais pas".
			if(x.errors>0){return false}

			let translation = x.foreign.toLowerCase()
			// On filtre les déterminants
			for(let det of determinants.value){
				if(translation.startsWith(det)){
					translation = translation.substring(det.length)
					break
				}
			}

			// Le mot cherché a moins de lettre que le nombre de lettres actuelles.
			if(txt === translation){
				return true
			}

			// On retourne uniquement s'il commence
			return txt.length>=numberOfLetters.value && translation.startsWith(txt)
		}).map(x=>{
			return {
				foreign: x.foreign,
				fr: x.fr,
				hint: false,
				examples: x.examples,
				definition: x.definition
			}
		})
})
</script>
