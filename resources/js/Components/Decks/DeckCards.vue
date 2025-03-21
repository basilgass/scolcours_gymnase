<script
	lang="ts"
	setup
>

import type {CardInterface, UserCardInterface} from "@/types/modelInterfaces"
import {useSwipe} from "@vueuse/core"
import {Random} from "pimath"
import {computed, ref, useTemplateRef} from "vue"
import {makeCard} from "@/helpers/makeModel.ts"
import CardItem from "@/Components/Decks/CardItem.vue"
import ScButton from "@/Components/Ui/scButton.vue"


const props = defineProps<{
	cards: UserCardInterface[]
}>()


const cardsList = ref<CardInterface[]>(Random.shuffle(
	props.cards.map(card => makeCard(card))
))

const cardIndex = ref(0)
const cardSide = ref<"recto" | "verso">("recto")
const cardHide = ref<boolean>(false)

const restartDeck = function () {
	cardsList.value.forEach(result => delete result.result)
	cardIndex.value = 0
}

const cardResult = function (result: boolean) {
	// On cache la carte
	cardHide.value = true
	// On retourne la carte
	cardSide.value = "recto"
	// On stocke le résultat dans la carte.
	cardsList.value[cardIndex.value].result = result

	// Aller à la carte suivante.
	cardIndex.value++

	// Il n'y a plus d'élément qui sont non résolu - on s'arrête !
	if (cardsList.value.filter(card => card.result !== true).length === 0) {
		cardIndex.value = cardsList.value.length
		return
	}

	// On recherche la prochaine carte qui a un résultat false
	let counter = cardsList.value.length * 2

	// On a dépassé le nombre d'items dans la liste, on recommence à zéro.
	if (cardIndex.value >= cardsList.value.length) cardIndex.value = 0

	while (cardsList.value[cardIndex.value].result === true) {
		// La carte est résolue, on passe à la suivante
		cardIndex.value++

		// On a dépassé le nombre d'items dans la liste, on recommence à zéro.
		if (cardIndex.value >= cardsList.value.length) cardIndex.value = 0

		counter--
		if (counter === 0) {
			break
		}
	}

	setTimeout(() => {
		cardHide.value = false
	}, 500)
	//

}

let el = useTemplateRef<HTMLElement>('el')

const {lengthX} = useSwipe(el, {
	threshold: 50,
	onSwipeEnd(e, d) {
		// On évite le swipe par défaut (historique)
		// La carte doit être sur son côté verso
		if (cardSide.value === "recto") return

		// On doit avoir une assez grande distance
		if (Math.abs(lengthX.value) < 200) return

		// On applique le résultat.
		cardResult(d !== "right")
	}
})

const countCards = computed(() => {
	return {
		correct: cardsList.value.filter(x => x.result).length,
		asked: cardsList.value.filter(x => Object.hasOwn(x, "result")).length,
		length: cardsList.value.length
	}
})
</script>

<template>
	<article
		v-if="cardIndex < cardsList.length"
		ref="el"
		class="cursor-pointer relative w-full flex flex-col"
	>
		<!-- affichage des boutons pour valider ou non la carte -->
		<transition name="slide-up">
			<sc-button
				v-if="cardSide === 'verso'"
				type="delete"
				class="absolute z-10
				bottom-[50%] left-2 translate-y-[50%]
				flex justify-between
				w-[80px] h-[60px]
				transition-all duration-1000 ease-in-out"
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
				bottom-[50%] right-2 translate-y-[50%]
				flex justify-between
				w-[80px] h-[60px]
				transition-all duration-1000 ease-in-out"
				@click="cardResult(true)"
			>
				<i class="bi bi-hand-thumbs-up-fill" />
			</sc-button>
		</transition>

		<div class="w-full flex justify-between">
			<div>{{ countCards.length }} cartes</div>
			<div>
				<span class="text-green-600">{{ countCards.correct }}</span> /
				{{ countCards.asked }}
			</div>
		</div>

		<CardItem
			v-model="cardSide"
			:card="cardsList[cardIndex]"
		/>
	</article>


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

