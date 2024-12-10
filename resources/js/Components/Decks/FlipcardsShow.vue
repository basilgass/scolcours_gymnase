<script
	lang="ts"
	setup
>

import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import type {deckInterface, flipcardsInterface} from "@/types/modelInterfaces"
import {useSwipe} from "@vueuse/core"
import {Random} from "pimath"
import {computed, nextTick, PropType, ref} from "vue"

const props = defineProps({
	deck: {type: Object as PropType<deckInterface>, required: true}
})

const cardIndex = ref(0),
	cardSide = ref<"recto" | "verso">("recto"),
	cardHide = ref<boolean>(false),
	cardsList = ref<flipcardsInterface[]>(Random.shuffle(props.deck.flipcards))

const flip = function () {
	if (cardSide.value === "recto") {
		cardSide.value = "verso"
	}
}

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

let el = ref(null)
const {lengthX, isSwiping} = useSwipe(el, {
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
// const xClassTranslate = computed(() => {
// 	const sign = lengthX.value < 0 ? -1 : 1
// 	return isSwiping.value && cardSide.value === "verso" ?
// 		`translate: ${-sign * Math.min(Math.abs(lengthX.value) / 2, 75)}px` :
// 		`translate: 0px`
// })

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
		class="cursor-pointer relative"
	>
		<div class="absolute z-10 top-[-1.5rem] w-full flex justify-between">
			<div>{{ countCards.length }} cartes</div>
			<div>
				<span class="text-green-600">{{ countCards.correct }}</span> /
				{{ countCards.asked }}
			</div>
		</div>

		<transition name="slide-up">
			<div
				v-if="cardSide === 'verso'"
				class="fixed z-10 bottom-[2rem] left-0 flex justify-between w-full px-5 mt-2 transition-all duration-1000 ease-in-out"
			>
				<button
					class="btn bg-white hover:bg-red-100 transition-colors text-red-600 border border-red-600 px-5 lg:px-10"
					@click="cardResult(false)"
				>
					<i class="bi bi-hand-thumbs-down-fill" />
				</button>
				<button
					class="btn bg-white hover:bg-green-100 transition-colors text-green-600 border border-green-600 px-5 lg:px-10"
					@click="cardResult(true)"
				>
					<i class="bi bi-hand-thumbs-up-fill" />
				</button>
			</div>
		</transition>

		<div
			:class="{ 'is-flipped': cardSide==='verso' }"
			class="relative card transition duration-1000 w-full"
			@click="cardSide=cardSide==='verso'?'recto':'verso'"
		>
			<div class="card-face front min-h-[60vh]">
				<div
					class="bg-white w-full h-full rounded-xl px-5 py-3 grid place-items-center"
				>
					<!-- body -->
					<markdown-it
						:text="cardsList[cardIndex]['recto'].body"
						class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
					/>
					<!-- Illustration -->
					<illustration-show
						v-if="cardsList[cardIndex]['recto'].illustrations.length > 0"
						:illustration="cardsList[cardIndex]['recto'].illustrations[0]"
						class="h-full w-full max-w-[600px]"
						click-through
					/>
				</div>
			</div>
			<div class="card-face back min-h-[60vh]">
				<div
					class="bg-white w-full h-full rounded-xl px-5 py-3 grid place-items-center"
					:class="cardHide?'invisible':''"
				>
					<!-- body -->
					<markdown-it
						:text="cardsList[cardIndex]['verso'].body"
						class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
					/>
					<!-- Illustration -->
					<illustration-show
						v-if="cardsList[cardIndex]['verso'].illustrations.length > 0"
						:illustration="cardsList[cardIndex]['verso'].illustrations[0]"
						class="h-full w-full max-w-[600px]"
						click-through
					/>
				</div>
			</div>
		</div>
	</article>


	<div
		v-else
		class="min-w-[300px] min-h-[200px] grid place-items-center"
	>
		<div class="text-center flex flex-col gap-10">
			<div class="font-code text-3xl">
				Bravo ! Le deck de cartes est terminé !
			</div>

			<button
				class="btn btn-primary"
				@click="restartDeck"
			>
				recommencer
			</button>
		</div>
	</div>
</template>

<style scoped>
.card-face {
	@apply absolute w-full h-full transition-transform duration-500 shadow-xl border rounded-xl grid place-items-center;
	backface-visibility: hidden;
}

.front {
	transform: rotateY(0deg);
}

.back {
	transform: rotateY(180deg);
}

.card.is-flipped .front {
	transform: rotateY(-180deg);
}

.card.is-flipped .back {
	transform: rotateY(0deg);
}


</style>
