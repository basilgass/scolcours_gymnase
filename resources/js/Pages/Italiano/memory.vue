<template>
	<article>
		<ArticleTitle title="Italia Unit" />
		<Link
			href="/italiano"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" />  retour
		</Link>

		<div
			v-if="cards.length>0"
			class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-4"
		>
			<div
				v-for="(card, index) in cards"
				:key="index"
				class="bg-white border rounded h-24 grid place-items-center p-3 cursor-pointer transform-all duration-300"
				:class="{
					'bg-green-600': card.found,
					'bg-amber-400': card.selected
				}"
				@click="showAllCards?null:selectCard(card)"
			>
				<span v-show="showAllCards || card.found || card.selected">
					{{ card.text }}
				</span>
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
				v-model="numberOfCards"
				label="nombre de cartes"
				name="nombre de cartes"
			/>

			<form-input
				v-model="unitsSelection"
				label="sélection des unités"
				name="selectionunit"
			/>
		</div>
		<div
			v-else
			class="mt-10 grid grid-cols-3 w-full"
		>
			<div>
				<button
					class="btn btn-xs bg-white"
					@click="showAllCards=!showAllCards"
				>
					Afficher toutes les fiches
				</button>
			</div>

			<div class="text-center">
				Mots {{ startIndex+1 }} à {{ startIndex + 1 + numberOfCards }} sur {{ availableWords.length }}
			</div>

			<div>
				<button
					v-show="gamePaused"
					class="btn btn-xs bg-success"
					@click="continueGame"
				>
					Continuer le jeu
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
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {vocabulare} from "@/Pages/Italiano/italianoUnita"

let availableWords = ref([]),
	startIndex = ref(0),
	cards = ref([]),
	unitsSelection = ref("1"),
	units = computed(() => {
		return unitsSelection.value.split(",").filter(x=>!isNaN(x)).map(x => +x)
	}),
	showAllCards = ref(false),
	numberOfCards = ref(12),
	gamePaused = ref(true),
	gameStopped = ref(true)

let startGame = function () {
	if(availableWords.value.length===0) {
		generateWords()
	}

	generateCards()
}
let continueGame = function (){
	startIndex.value = startIndex.value + numberOfCards.value + 1
	generateCards()
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
let generateCards = function () {
	if(startIndex.value > availableWords.value.length){
		alert("Bravo ! Tout le voc a été révisé !")
		availableWords.value = []
		startIndex.value = -1
		gameStopped.value = true
		return
	}

	let cardsList = []
	for (let word of availableWords.value.slice(startIndex.value, startIndex.value + numberOfCards.value)) {
		cardsList.push(word[0])
		cardsList.push(word[1])
	}

	cards.value = []
	for (let word of PiMath.Random.shuffle(cardsList)) {
		cards.value.push({
			text: word,
			selected: false,
			found: false
		})
	}

	gameStopped.value = false
	gamePaused.value = false
}

let selectCard = function (card) {
	if (card.found) {
		return
	}

	card.selected = true

	// get all selected cards.
	const selectedCards = cards.value.filter(c => c.selected)

	if (selectedCards.length === 1) {
		return
	}
	if (selectedCards.length > 2) {
		cards.value.map(c => c.selected = false)
		return
	}
	if (selectedCards.length === 2) {
		// Il y a deux cartes sélectionnées.
		for (let word of availableWords.value) {
			if ((selectedCards[0].text === word[0] && selectedCards[1].text === word[1]) ||
				selectedCards[0].text === word[1] && selectedCards[1].text === word[0]) {
				selectedCards.map(c => {
					c.selected = false
					c.found = true
				})

				// On vérifie si tout est terminé
				if (cards.value.filter(x => x.found).length === cards.value.length) {
					gamePaused.value = true
				}
				return
			}
		}
	}

	setTimeout(() => {
		selectedCards.map(c => {
			c.selected = false
		})
	}, 1000)
}

</script>
