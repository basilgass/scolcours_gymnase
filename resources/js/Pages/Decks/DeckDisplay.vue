<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {CardInterfaceExtended, DeckInterface, provideDeckData} from "@/types/modelInterfaces"
import DeckCards from "@/Components/Decks/DeckCards.vue"
import DeckRestart from "@/Components/Decks/Parts/DeckRestart.vue"
import {computed, provide, ref, useTemplateRef} from "vue"
import {computedCard} from "@/Components/Decks/Parts/DeckCardMaker.ts"
import {Random} from "pimath"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"
import DeckIntro from "@/Components/Decks/Parts/DeckIntro.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreCardDataInterface} from "@/types/scoreInterfaces.ts"

defineOptions({layout: LayoutProjection})

const props = defineProps<{
	deck: DeckInterface,
}>()

const scoreStore = useStoreScore()
const score = await scoreStore.getScore('Deck', props.deck.id)

const cards = ref<CardInterfaceExtended[]>(props.deck.cards
	.map((card) => {
		const data = card.user?.data as ScoreCardDataInterface
		return {
			...computedCard(card),
			// On ajoute les valeurs éphémères.
			current_appearances: data?.current_appearances ?? 0,
			current_score: data?.current_score ?? null,
			current_time_spent: data?.current_score ?? 0,
		}
	}))

const currentCardId = ref<number>(Random.number(0, cards.value.length - 1))
const intro = ref<boolean>(true)
const loggedIn = computed(() => usePage().props.auth.user !== undefined)
const running = computed(() => currentCardId.value === null)

provide<provideDeckData>('deckData', {
	currentCardId,
	cards,
	running,
	intro,
	loggedIn,
	done: () => {
		if (intro.value) {
			return
		}

		currentCardId.value = null
		const number_of_first_resolved = cards.value
			.filter(card => card.current_appearances === 1)
			.length

		// résultat du deck -> score
		score.score = Math.round(number_of_first_resolved / cards.value.length * 100)
		score.is_resolved = score.is_resolved ||
			(number_of_first_resolved === cards.value.length)

		// update the deck score.
		scoreStore.updateScore(score)
	},
	reset: async () => {
		const ids = cards.value.map(card => card.id)
		const scores = await scoreStore.getScores('Card', ids)

		scores.forEach(score => {
			scoreStore.resetData(score)
		})

		// Mise à zéro des informations des cartes.
		cards.value.forEach((card) => {
			// On ajoute les valeurs éphémères.
			card.current_appearances = 0
			card.current_score = null
			card.current_time_spent = 0
		})

		flipcards.value.restartDeck()
		intro.value = false

	}
})

function updateDeck(score: number) {
	if (loggedIn.value) {
		axios.patch(route('api.students.scores.update', {score: props.deck.user.id}), {
			score
		})
	}
}

const flipcards = useTemplateRef<InstanceType<typeof DeckCards>>('flipcards')

</script>

<template>
	<section>
		<!-- card mode -->
		<deck-intro v-show="intro" />
		<div v-show="!intro">
			<deck-restart
				v-show="!intro && running"
			/>
			<suspense>
				<deck-cards
					ref="flipcards"
					v-show="!intro && !running"
					@deck-done="updateDeck"
				/>
			</suspense>
		</div>
	</section>
</template>


