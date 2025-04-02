<script
	lang="ts"
	setup
>

/**
 * DeckCards
 * This component is used to display a deck of cards.
 * It handles the logic of the deck.
 */

import type {UserCardInterface} from "@/types/modelInterfaces"
import {computed, onMounted, reactive, ref, useTemplateRef} from "vue"
import CardItem from "@/Components/Decks/CardItem.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {makeCard} from "@/helpers/makeModel.ts"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"


const props = defineProps<{
	cards: UserCardInterface[]
}>()

const cardsList = ref<UserCardInterface[]>(props.cards)

// const cardIndex = ref(0)
const cardSide = ref<"recto" | "verso">("recto")
const currentCard = ref<UserCardInterface>()

function getNextCard() {
	// Logique concernant la suite du deck
	// 1. Il n'y a plus d'élément qui sont non résolu - on s'arrête !
	// 2. On recherche la prochaine carte qui a un current_score autre que 1
	const availableCards = cardsList.value.filter(card => card.current_score !== 1)

	if (availableCards.length === 0) {
		currentCard.value = undefined
		return
	}


	// Get the next item.
	const weights = availableCards.map(card => {
		return (1 - card.current_score) / (card.current_appearances + 1)
	})

	const totalWeights = weights.reduce((sum, weight) => sum + weight, 0)

	let random = Math.random() * totalWeights
	for (let i = 0; i < availableCards.length; i++) {
		if (random < weights[i]) {
			currentCard.value = availableCards[i]
			return
		}

		random -= weights[i]
	}

	currentCard.value = undefined
}

onMounted(() => {
	getNextCard()
})

/**
 * Determine the result of the card.
 * true: the user knows the answer
 * false: the user does not know the answer
 *
 * @param result
 */
function cardResult(result: boolean) {
	// Sauvegarde des données de la carte.
	updateCard(result).finally(() => {
		// On retourne la carte (pour l'effet visuel)
		cardSide.value = "recto"

		// Aller à la carte suivante.
		// cardIndex.value++
		getNextCard()
	})
}

/**
 * Restart the deck of cards.
 * Available only when the deck is finished.
 */
const restartDeck = function () {
	cardsList.value.forEach(item => {
		item.current_score = 0.5
		item.current_appearances = 0
		item.current_time_spent = 0
	})

	getNextCard()
}

/**
 * Cards statistics
 * @type {ComputedRef<{correct: number, asked: number, length: number}>}
 *
 * length: number of cards in the deck
 * asked: number of cards that have been asked
 * correct: number of cards that have been correctly answered
 */
const countCards = computed(() => {
	return {
		correct: cardsList.value.filter(x => x.current_score === 1).length,
		asked: cardsList.value.filter(x => x.current_score !== 0).length,
		length: cardsList.value.length
	}
})

/**
 * Current card statistics
 */
const currentCardStats = reactive<{ startTime: number, endTime: number | null, numberOfFlips: number }>({
	startTime: Date.now(),
	endTime: null,
	numberOfFlips: 0
})

function flipCard() {
	if (cardSide.value === 'verso') {
		currentCardStats.numberOfFlips++
	}
}

async function updateCard(result: boolean) {

	// The card has appeared
	currentCard.value.current_appearances++

	// Traitement de la carte:
	// result = true => increase the score
	// result = false => decrease the score
	if (result) {
		currentCard.value.current_score = Math.min(1, currentCard.value.current_score * 2)
	} else {
		currentCard.value.current_score = Math.max(0.125, currentCard.value.current_score / 2)
	}


	// Calcul du temps de réponse
	currentCardStats.endTime = Date.now()
	const durationInSeconds = Math.round((currentCardStats.endTime - currentCardStats.startTime) / 1000)

	currentCard.value.current_time_spent += durationInSeconds

	currentCard.value.success = currentCard.value.success + (result ? 1 : 0)
	currentCard.value.appearances = currentCard.value.appearances + 1
	currentCard.value.time_spent = currentCard.value.time_spent + durationInSeconds

	// Si l'utilisateur est connecté, on envoie les données au serveur
	if (usePage().props.auth.user) {
		axios.post(route('decks.updateCard', {
				card: currentCard.value.id
			}), {
				...currentCard.value
			}
		).then(() => {
			// Replace the card in the list
			const index = cardsList.value.findIndex(card => card.id === currentCard.value?.id)

			if (index) {
				cardsList.value[index] = currentCard.value
			}
		}).catch(err => {
			console.error(err)
		})
	}

}

</script>

<template>
	<article
		v-if="currentCard"
		class="cursor-pointer relative w-full flex flex-col gap-5 p-5"
	>
		<!-- affichage des boutons pour valider ou non la carte -->
		<transition name="slide-up">
			<sc-button
				v-if="cardSide === 'verso'"
				type="delete"
				class="absolute z-10
				bottom-7 left-7
				flex justify-between
				w-[80px] h-[60px]
				transition-all duration-200 ease-in-out"
				@click="cardResult(false)"
			>
				<i class="bi bi-hand-thumbs-down-fill" />
			</sc-button>
		</transition>

		<transition name="slide-up">
			<sc-button
				v-if="cardSide === 'verso'"
				type="add"
				class="absolute z-10
				bottom-7 right-7
				flex justify-between
				w-[80px] h-[60px]
				transition-all duration-1000 ease-in-out"
				@click="cardResult(true)"
			>
				<i class="bi bi-hand-thumbs-up-fill" />
			</sc-button>
		</transition>

		<!-- affichage des statistiques -->
		<div class="w-full flex justify-between">
			<div>score: {{ currentCard.current_score }}</div>
			<div>{{ countCards.length }} cartes</div>
			<div>
				<span class="text-green-600">{{ countCards.correct }}</span> /
				{{ countCards.asked }}
			</div>
		</div>

		<!-- afficher de la carte -->
		<CardItem
			v-model="cardSide"
			:key="`card-${currentCard.id}`"
			:card="makeCard(currentCard)"
			@flip="flipCard"
		/>
	</article>


	<!-- Le deck est terminé -->
	<div
		v-else
		class="min-w-[300px] min-h-[200px] grid place-items-center"
	>
		<div class="text-center flex flex-col gap-10">
			<div class="font-code text-3xl">
				Bravo ! Le deck de cartes est terminé !
			</div>

			<sc-button
				@click="restartDeck"
				class="py-5"
			>
				recommencer
			</sc-button>
		</div>
	</div>
</template>

