<script
	lang="ts"
	setup
>

import IllustrationShow from "@/Pages/Illustrations/IllustrationShow.vue"
import type { deckInterface, flipcardsInterface } from "@/types/modelInterfaces"
import { useSwipe } from "@vueuse/core"
import { Random } from "pimath"
import { computed, PropType, ref } from "vue"
import MarkdownIt from "../Ui/MarkdownIt.vue"

const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})

const cardIndex = ref(0),
	cardSide = ref<"recto" | "verso">("recto"),
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
	// On stocke le résultat dans la carte.
	cardsList.value[cardIndex.value].result = result

	// Aller à la carte suivante.
	cardSide.value = "recto"
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
}

let el = ref(null)
const { lengthX, isSwiping } = useSwipe(el, {
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
const xClassTranslate = computed(() => {
	const sign = lengthX.value < 0 ? -1 : 1
	return isSwiping.value && cardSide.value === "verso" ?
		`translate: ${-sign * Math.min(Math.abs(lengthX.value) / 2, 75)}px` :
		`translate: 0px`
})

</script>

<template>
	<article
		v-if="cardIndex < cardsList.length"
		ref="el"
		class="cursor-pointer
			relative"
	>
		<!-- <div class="absolute left-3 lg:left-6 top-[50%] text-red-500">
			<i class="bi bi-hand-thumbs-down-fill" />
		</div>
		<div class="absolute right-3 lg:right-6 top-[50%] text-green-500">
			<i class="bi bi-hand-thumbs-up-fill" />
		</div> -->

		<div
			:class="xClassTranslate"
			class="grid place-items-center
			 bg-white rounded-xl shadow-lg p-5 min-h-[50vh]"
			@click="flip"
		>
			<!-- body -->
			<markdown-it
				class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				:text="cardsList[cardIndex][cardSide].body"
			/>
			<!-- Illustration -->
			<illustration-show
				v-if="cardsList[cardIndex].recto.illustrations.length > 0"
				class="h-full w-full max-w-[600px]"
				:illustration="cardsList[cardIndex][cardSide].illustrations[0]"
			/>
		</div>


		<div class="min-h-[3em]">
			<transition name="fade">
				<div
					v-if="cardSide === 'verso'"
					class="flex justify-between w-full px-5 mt-2 transition-opacity duration-500 ease-in-out"
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

<style scoped></style>
