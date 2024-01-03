<script lang="ts" setup>

import { ref } from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { useSwipe } from "@vueuse/core"

const props = defineProps({
	deck: { type: Object, required: true }
})

const cardIndex = ref(0),
	cardSide = ref<"recto" | "verso">("recto"),
	cardsList = ref(props.deck.flipcards)

const flip = function() {
	if (cardSide.value === "recto") {
		cardSide.value = "verso"
	}
}

const restartDeck = function() {
	cardsList.value.forEach(result=>delete result.result)
	cardIndex.value = 0
}

const cardResult = function(result) {
	// On stocke le résultat dans la carte.
	cardsList.value[cardIndex.value].result = result

	// Aller à la carte suivante.
	cardIndex.value++
	cardSide.value = "recto"

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
useSwipe(el, {
	threshold: 60,
	onSwipeEnd(e, d) {
		if (cardSide.value === "recto") return

		cardResult(d !== "right")
	}
})

</script>

<template>
	<div
		v-if="cardIndex<cardsList.length"
	>
		<div
			ref="el"
			class="min-h-[200px] bg-white m-5 rounded-xl shadow grid place-items-center cursor-pointer"
			@click="flip"
		>
			<markdown-it
				:text="cardsList[cardIndex][cardSide].body"
				text-class="text-xl md:text-3xl"
			/>
		</div>
		<transition name="fade">
			<div
				v-show="cardSide==='verso'"
				class="flex justify-between w-full px-5"
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

</style>
