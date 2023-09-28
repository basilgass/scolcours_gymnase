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
			v-if="cards.length>0"
			class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4"
		>
			<div
				v-for="(card, index) in cards"
				:key="index"
				:class="{
					'bg-lime-50 border-green-600/30 text-slate-300 cursor-not-allowed': card.found,
					'bg-amber-200 border-amber-600 cursor-not-allowed': card.selected,
					'bg-white cursor-pointer': !card.found && !card.selected,
				}"
				class="text-lg border rounded-lg h-24 grid place-items-center p-3 transform-all duration-300"
				@click="(showAllCards || (card.found||card.selected))?null:selectCard(card)"
			>
				<span v-show="showAllCards || card.found || card.selected">
					{{ card.text }}
				</span>
			</div>
		</div>

		<div
			v-if="gameStopped"
		>
			<LanguageUnitsSelector
				:units="props.units"
				@update="unitsSelection=$event"
			/>

			<div class="my-3">
				<h2 class="text-lg font-extralight mb-2 uppercase">configuration du memory</h2>
				<div class="flex gap-3">
					<form-kit
							type="number"
							min="10"
							max="100"
							v-model="numberOfCards"
							label="nombre de cartes"
					/>

					<form-kit
							type="number"
							v-model="cardTimeout"
							min="1"
							max="5"
							label="durée d'affichage [seconde]"
					/>
				</div>
			</div>

			<div class="grid place-items-center mt-12">
				<button
						class="btn-primary px-20 py-10 text-2xl"
						@click="startGame"
						v-show="unitsSelection.length>0"
				>
					Commencer
				</button>
			</div>
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
				Mots {{ startIndex + 1 }} à {{ startIndex + 1 + numberOfCards }} sur {{ availableWords.length }}
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
import FormNumber from "@/Components/Form/FormNumber.vue"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: () => []}
})
let unitsSelection = ref([]),
	availableWords = ref([]),
	startIndex = ref(0),
	cards = ref([]),
	cardTimeout = ref(1),
	showAllCards = ref(false),
	numberOfCards = ref(12),
	gamePaused = ref(true),
	gameStopped = ref(true)

let startGame = function () {
	if (availableWords.value.length === 0) {
		generateWords()
	}

	generateCards()
}
let continueGame = function () {
	startIndex.value = startIndex.value + numberOfCards.value + 1
	generateCards()
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
let generateCards = function () {
	if (startIndex.value > availableWords.value.length) {
		alert("Bravo ! Tout le voc a été révisé !")
		availableWords.value = []
		startIndex.value = -1
		gameStopped.value = true
		return
	}

	let cardsList = []
	for (let word of availableWords.value.slice(startIndex.value, startIndex.value + numberOfCards.value)) {
		cardsList.push(word.foreign)
		cardsList.push(word.fr)
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
			if ((selectedCards[0].text === word.fr && selectedCards[1].text === word.foreign) ||
				selectedCards[0].text === word.foreign && selectedCards[1].text === word.fr) {
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
	}, cardTimeout.value*1000)
}

</script>
