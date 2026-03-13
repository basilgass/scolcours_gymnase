<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import {LanguageDataInterface} from "@/Pages/Languages/LanguageShow.vue"
import {Random} from "pimath"
import {inject, ref, watch} from "vue"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const languageData = inject<LanguageDataInterface>("LanguageData")

const cardTimeout = ref(1),
	numberOfCards = ref(4)

const {startGame, continueGame, currentWords, selectedWordsIndex} = useLanguage(languageData, {
	numberOfWords: numberOfCards
})

const cards = ref([])

watch(selectedWordsIndex, () => {
	let left = []
	let right = []
	for (const word of currentWords.value) {
		right.push({
			text: word.fr,
			selected: false,
			found: false
		})
		left.push({
			text: word.foreign,
			selected: false,
			found: false
		})
	}

	left = Random.shuffle(left)
	right = Random.shuffle(right)

	cards.value = []
	for (let i = 0; i < left.length; i++) {
		cards.value.push(left[i])
		cards.value.push(right[i])
	}
})

const selectCard = function (card) {
	if (card.found) {
		return
	}

	card.selected = true

	// get all selected cards.
	const selectedCards = cards.value.filter((c) => c.selected)

	// There is only one card selected => do nothing.
	if (selectedCards.length === 1) {
		return
	}

	// There are more than two cards selected => unselect all.
	if (selectedCards.length > 2) {
		cards.value.map((c) => (c.selected = false))
		return
	}

	// There are two cards selected
	// Check if they are the same !
	if (selectedCards.length === 2) {
		// Il y a deux cartes sélectionnées.
		for (const word of currentWords.value) {
			if (
				(selectedCards[0].text === word.fr &&
					selectedCards[1].text === word.foreign) ||
				(selectedCards[0].text === word.foreign &&
					selectedCards[1].text === word.fr)
			) {
				selectedCards.map((c) => {
					c.selected = false
					c.found = true
				})

				// On vérifie si tout est terminé
				if (cards.value.every((x) => x.found)) {
					// DESIGN: make an animation to remove all cards
					setTimeout(() => {
						// Make next group of items.
						continueGame()
					}, 500)

				}
				return
			}
		}
	}

	setTimeout(() => {
		selectedCards.map((c) => {
			c.selected = false
		})
	}, cardTimeout.value * 800)
}
</script>
<template>
	<article>
		<div
			v-if="cards.length > 0"
			class="grid grid-cols-2 gap-x-6 lg:gap-x-12 xl:gap-x-24 gap-y-4"
		>
			<div
				v-for="(card, index) in cards"
				:key="index"
				:class="{
					'bg-lime-50 border-green-600/30 text-slate-300 cursor-not-allowed':
						card.found,
					'bg-amber-200 border-amber-600 cursor-not-allowed':
						card.selected,
					'bg-white cursor-pointer': !card.found && !card.selected,
				}"
				class="text-lg border rounded-lg h-24 grid place-items-center p-3 transform-all duration-300"
				@click="
					card.found || card.selected
						? null
						: selectCard(card)
				"
			>
				<span>
					{{ card.text }}
				</span>
			</div>
		</div>

		<div v-if="languageData.state.value==='intro'">
			<div class="my-3">
				<h2 class="text-lg font-extralight mb-2 uppercase">
					configuration du memory
				</h2>
				<div class="flex gap-3">
					<form-maker
						v-model="numberOfCards"
						label="nombre de cartes"
						max="20"
						min="4"
						type="number"
					/>
				</div>
			</div>

			<div class="grid place-items-center mt-12">
				<sc-button
					v-show="languageData.units.value.length > 0"
					type="primary"
					class="px-20 py-10 text-2xl"
					@click="startGame"
				>
					Commencer
				</sc-button>
			</div>
		</div>
		<div
			v-else
			class="mt-10 grid w-full"
		>
			<div class="text-center">
				Mots {{ selectedWordsIndex + 1 }} à
				{{ selectedWordsIndex + 1 + numberOfCards }} sur
				{{ languageData.words.value.length }}
			</div>
		</div>
	</article>
</template>
