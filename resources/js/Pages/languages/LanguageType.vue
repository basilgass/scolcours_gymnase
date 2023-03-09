<template>
	<article>
		<ArticleTitle :title="language" />

		<Link
			:href="`/${language}`"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" /> retour
		</Link>

		<div
			v-if="gameStopped"
		>
			<LanguageUnitsSelector
				:units="props.units"
				@update="unitsSelection=$event"
			/>

			<button
				class="btn-primary"
				@click="startGame"
			>
				Commencer
			</button>
		</div>
		<div v-else>
			<div
				v-admin
				class="bg-grey-300 border border-600 rounded"
			>
				{{ currentWord.fr }} --> {{ currentWord.foreign }}
			</div>

			<div class="space-y-10">
				<div class="text-xl text-center">
					{{ currentWord.fr }}
				</div>

				<div class="flex flex-wrap gap-2 justify-center bg-white px-5 py-3 text-lg">
					<div
						v-for="(key, index) in resultLetters"
						:key="`found-${index}`"
						:class="{
							'p-2 w-8 border-b-2 border-gray-200': key.key!==' ',
							'p-0 w-3': key.key===' ',
							'bg-white': key.key !== ' ' && index!==currentIndex,
							'is-active': index===currentIndex
						}"
						class="text-center text-lg font-code h-[2.5em]"
					>
						<span
							v-show="key.visible"
							v-text="key.key"
						/>
					</div>
				</div>

				<div
					ref="typoButtons"
					class="keyboard flex flex-wrap gap-4 justify-center max-w-xl mx-auto"
				>
					<button
						v-for="(key, index) in foreignLetters"
						:key="`${key.key}-${index}`"
						:class="{
							'bg-white hover:scale-105 hover:shadow': !key.used,
							'bg-gray-200 disabled text-gray-400 cursor-not-allowed': key.used
						}"
						class="p-2 w-14 h-14 border border-gray-200 rounded transition-all"
						@click="key.used?'':validateKey(index)"
					>
						{{ key.key }}
					</button>
				</div>
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
import {computed, nextTick, onMounted, ref, watch} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import LanguageUnitsSelector from "@/Pages/languages/LanguageUnitsSelector.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: () => []}
})
let unitsSelection = ref([]),
	localStorageKey = computed(() => {
		return `scolcours_type_${props.language}`
	}),
	availableWords = ref([]),
	startIndex = ref(0),
	currentWord = computed(() => {
		return availableWords.value[startIndex.value]
	}),
	gameStopped = ref(true)

let startGame = function () {
	if (unitsSelection.value.length === 0) {
		alert("sélectionner au moins une unité !")
		return
	}
	if (availableWords.value.length === 0) {
		generateWords()
	}

	// The game has been started - store the value in the localStorage.
	saveToLocalStorage()

	buildResult()

	gameStopped.value = false

}

let continueGame = function (enter) {
	startIndex.value++

	if (startIndex.value === availableWords.value.length) {
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
	} else {
		buildResult()
	}
}

let generateWords = function () {
	// All words available
	startIndex.value = 0
	let words = []
	for (let values of unitsSelection.value.map(x => x.words)) {
		words = words.concat(values)
	}

	availableWords.value = PiMath.Random.shuffle(words)
}

function shake(item) {
	item.style.setProperty("animation-name", "v-shake-horizontal")
	item.style.setProperty("animation-duration", "500ms")

	setTimeout(() => {
		item.style.setProperty("animation-name", "")
	}, 500)
}

function saveToLocalStorage(addToIndex) {
	localStorage.setItem(localStorageKey.value,
		JSON.stringify(
			{
				"index": startIndex.value + (addToIndex ? addToIndex : 0),
				"words": availableWords.value
			}
		)
	)
}

function removeFromLocalStorage() {
	localStorage.removeItem(localStorageKey.value)
}


let typoButtons = ref(null),
	excludeLetters = ref([" ", ",", "'", ".", "!", "?", "(", ")", "-"]),
	foreignLetters = ref([]),
	resultLetters = ref([]),
	buildResult = function () {
		let theWord = currentWord.value.foreign

		// Modify the word
		if(theWord.endsWith(", a, i, e")){
			theWord = theWord.split(", a, i, e")[0]
		}
		if(theWord.endsWith(", i")){
			theWord = theWord.split(", i")[0]
		}
		if(theWord.split(", -").length===2){
			theWord = theWord.spit(", -")[0]
		}

		foreignLetters.value = PiMath.Random.shuffle(theWord.split("")
			.filter(key => excludeLetters.value.indexOf(key) === -1)
			.map(key => {
				return {
					key: key.toUpperCase(),
					used: false
				}
			})
		)

		resultLetters.value = theWord.split("").map((key, index)=>{
			return {
				index,
				key: key.toUpperCase(),
				visible: excludeLetters.value.indexOf(key) !== -1
			}
		})

		// Tell we are watching the first letter
		currentIndex.value = 0
	},
	currentIndex = ref(-1),
	validateKey = function (index) {
		if (resultLetters.value[currentIndex.value].key === foreignLetters.value[index].key) {
			resultLetters.value[currentIndex.value].visible = true
			foreignLetters.value[index].used = true

			// finished ?
			currentIndex.value++
			if (currentIndex.value >= resultLetters.value.length) {
				continueGame()
				return
			}
			while (resultLetters.value[currentIndex.value].visible) {
				currentIndex.value++
				if (currentIndex.value >= resultLetters.value.length) {
					continueGame()
					return
				}
			}
		} else {
			shake(typoButtons.value.children[index])
		}
	}


onMounted(() => {
	// let previousData = localStorage.getItem(localStorageKey.value)
	// if (previousData) {
	// 	if (confirm("Il y a des valeurs en mémoire... continuer ?")) {
	// 		const localData = JSON.parse(previousData)
	// 		startIndex.value = localData.index
	// 		availableWords.value = localData.words
	// 		gameStopped.value = false
	//
	// 	}else{
	// 		removeFromLcalStorage()
	// 	}
	// }
})
</script>
