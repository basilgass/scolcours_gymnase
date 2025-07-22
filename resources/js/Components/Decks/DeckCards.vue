<script
	lang="ts"
	setup
>

import type {CardInterfaceExtended, provideDeckData} from "@/types/modelInterfaces"
import {computed, inject, onMounted, reactive, ref} from "vue"
import DeckCardItem from "@/Components/Decks/Parts/DeckCardItem.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreCardDataInterface} from "@/types/scoreInterfaces.ts"

const deckData = inject<provideDeckData>('deckData')
const currentCard = ref<CardInterfaceExtended | null>(null)
const cardSide = ref<"recto" | "verso">("recto")

// Retourne la liste filtrée et dans l'ordre descendant d'apparition

// On récupère la carte suivante aléatoirement, en fonction :
// - du score
// - du nombre d'apparitions
function getNextCard() {
	// Logique concernant la suite du deck
	// 1. Il n'y a plus d'élément qui sont non résolu - on s'arrête !
	// 2. On recherche la prochaine carte qui a un current_score autre que 1
	const availableCards = deckData.cards.value.filter(card => card.current_score !== 1)

	if (availableCards.length === 0) {
		// C'est terminé ! Lancer l'update du deck.
		deckData.done()
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
			deckData.currentCardId.value = currentCard.value.id
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
	updateCard(result)
		.finally(() => {
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
	getNextCard()
}

const deckProgression = computed<number>(() => {
	// Somme des scores.
	const correct = deckData.cards.value.reduce((acc, card) => {
		return acc + (card.current_score ?? 0)
	}, 0)

	// Nombre total de cartes.
	const length = deckData.cards.value.length

	return Math.round(correct / length * 100)
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

async function updateCard_toDB(result: boolean, durationInSeconds: number) {
	// Si l'utilisateur n'est pas connecté ou s'il s'agit d'une carte virtuel.
	if (!deckData.loggedIn.value || !(currentCard.value.id > 0)) {
		return
	}

	const scoreStore = useStoreScore()
	const score = await scoreStore.getScore<ScoreCardDataInterface>('Card', currentCard.value.id)

	// Update the current score.
	score.data.current_score = currentCard.value.current_score
	score.data.current_appearances = currentCard.value.current_appearances
	score.data.current_time_spent = currentCard.value.current_time_spent

	// Update the overall score attempts.
	score.data.appearances++
	score.data.success += result ? 1 : 0
	score.data.time_spent += durationInSeconds

	// Sauvegarder directement dans le score de la carte.
	scoreStore.updateScore(score)
		.then(() => {
			// Que faire après une mise à jour de la carte ?
			const index = deckData.cards.value.findIndex(card => card.id === currentCard.value?.id)
			if (index) {
				deckData.cards.value[index] = currentCard.value
			}
		})
}

async function updateCard(result: boolean) {
	// La carte est apparue - incrément
	currentCard.value.current_appearances++

	// Calcul du temps de réponse
	currentCardStats.endTime = Date.now()
	const durationInSeconds = Math.round((currentCardStats.endTime - currentCardStats.startTime) / 1000)
	currentCard.value.current_time_spent += durationInSeconds

	// Calculs du score actuel.
	currentCard.value.current_score = updateCard_currentScore(result)

	updateCard_toDB(result, durationInSeconds)
}

function updateCard_currentScore(result: boolean): number {
	if (result) {
		// si c'est le premier : score = 1
		if (currentCard.value.current_score === null) {
			return 1
		}

		if (currentCard.value.current_score === 0) {
			return Math.max(0.125, 1 / currentCard.value.current_appearances)
		}

		return Math.min(1, currentCard.value.current_score * 2)
	}

	// La réponse est mauvaise.
	if (currentCard.value.current_score === null ||
		currentCard.value.current_score === 0 ||
		currentCard.value.current_score <= 0.125
	) {
		return 0
	}

	return Math.max(0.125, currentCard.value.current_score / 2)
}

defineExpose({restartDeck})

</script>

<template>
	<article
		v-if="currentCard"
		class="cursor-pointer
		relative
		lg:max-w-3xl
			xl:max-w-4xl
			mx-auto
		flex flex-col gap-5
		p-5"
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
			<div>
				score: {{
					currentCard.current_score === null ? 'nouvelle carte' : `${Math.round(currentCard.current_score * 100)}%`
				}}
			</div>
			<div>{{ deckData.cards.value.length }} cartes</div>
			<div>
				<span class="text-green-600">{{ deckProgression }}%</span>
			</div>
		</div>

		<!-- afficher de la carte -->
		<DeckCardItem
			v-model="cardSide"
			:key="`card-${currentCard.id}`"
			:card="currentCard"
			@flip="flipCard"
		/>
	</article>
</template>

