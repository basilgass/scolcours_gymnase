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
			<div class="bg-grey-300 border border-600 rounded">
				{{ currentWord.fr }} --> {{ currentWord.foreign }}
			</div>

			<div>
				<div class="text-xl text-center">
					{{ currentWord.fr }}
				</div>
				<div class="keyboard">
					<button
						v-for="(key, index) in foreignLetters"
						:key="`${key}-${index}`"
						class="key bg-white"
					>
						{{ key }}
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
	localStorageKey = computed(()=>{
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

	gameStopped.value = false

}

let continueGame = function (enter) {
	startIndex.value++

	if (startIndex.value === availableWords.value.length) {
		alert("Félicitations - tu as fait tout ton voc !")
		gameStopped.value = true
		availableWords.value = []
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

let foreignLetters = computed(()=>{
		// not used letters:
		return PiMath.Random.shuffle(currentWord.value.foreign.split("")
			.filter(x=>excludeLetters.value.indexOf(x)===-1)
		)
	}),
	excludeLetters =[" ", ",", "'", ".", "!", "?"]

function shake(index) {
	let item = suggestionsWrapper.value.children[index]

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
				"index": startIndex.value + (addToIndex?addToIndex:0),
				"words": availableWords.value
			}
		)
	)
}
function removeFromLcalStorage() {
	localStorage.removeItem(localStorageKey.value)
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
