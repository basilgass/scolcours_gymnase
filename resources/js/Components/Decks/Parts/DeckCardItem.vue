<script setup lang="ts">
/**
 * DeckCardItem
 * This component is used to display a card in a deck.
 * It is only a display component, it does not handle any logic.
 */
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import {CardInterface} from "@/types/modelInterfaces"
import {ref} from "vue"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"

withDefaults(defineProps<{
	card: CardInterface,
	initSide?: 'recto' | 'verso'
}>(), {
	initSide: 'recto'
})

const cardSide = defineModel<'recto' | 'verso'>()
const emits = defineEmits<{
	flip: [e: 'recto' | 'verso']
}>()

const cardHide = ref<boolean>(false)

function flip() {
	// Change the cardside
	cardSide.value = cardSide.value === 'recto' ? 'verso' : 'recto'

	emits('flip', cardSide.value)
}

</script>
<template>
	<div
		:class="{
			'is-flipped': cardSide==='verso'
		}"
		class="relative
		card
		aspect-[4/3] portrait:aspect-[3/4]
		max-h-[calc(100vh-10rem)] max-w-[95vw]
		transition duration-1000"
		@click="flip"
	>
		<DeckCardItemSide
			class="absolute inset-0
			transition-transform duration-500
			shadow-xl
			front"
			:block="card['recto']"
		/>
		<DeckCardItemSide
			class="absolute inset-0
			transition-transform duration-500
			shadow-xl
			back"
			:block="card['verso']"
		/>
	</div>
</template>
<style scoped>
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
