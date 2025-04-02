<script setup lang="ts">
/**
 * CardItem
 * This component is used to display a card in a deck.
 * It is only a display component, it does not handle any logic.
 */
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import {CardInterface} from "@/types/modelInterfaces"
import {ref} from "vue"

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
		<div
			class="absolute inset-0
			transition-transform duration-500
			shadow-xl grid place-items-center
			backface-hidden
			front"
		>
			<div
				class="bg-content
					w-full h-full
					rounded-xl px-5 py-3
					grid place-items-center"
			>
				<!-- body -->
				<markdown-it
					:text="card['recto'].body"
					class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				/>
				<!-- Illustration -->
				<illustration-show
					v-if="card['recto'].illustrations.length > 0"
					:illustration="card['recto'].illustrations[0]"
					class="h-full w-full max-w-[600px]"
					click-through
				/>
			</div>
		</div>
		<div
			class="absolute inset-0
			transition-transform duration-500
			shadow-xl grid place-items-center
			backface-hidden
			 back"
		>
			<div
				class="bg-content
					w-full h-full
					rounded-xl px-5 py-3
					grid place-items-center"
				:class="cardHide?'invisible':''"
			>
				<!-- body -->
				<markdown-it
					:text="card['verso'].body"
					class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				/>
				<!-- Illustration -->
				<illustration-show
					v-if="card['verso'].illustrations.length > 0"
					:illustration="card['verso'].illustrations[0]"
					class="h-full w-full max-w-[600px]"
					click-through
				/>
			</div>
		</div>
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
