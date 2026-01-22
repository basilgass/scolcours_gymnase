<script setup lang="ts">
import {CardInterface} from "@/types/modelInterfaces.ts"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"
import {computed} from "vue"
import {computedCard} from "@/Components/Decks/Parts/DeckCardMaker.ts"

const props = defineProps<{
	card: CardInterface
}>()

const theCard = computed(() => computedCard(props.card))
</script>

<template>
	<div
		class="grid grid-cols-2 gap-2"
	>
		<DeckCardItemSide
			class="bg-content border shadow aspect-[4/3]"
			:block="theCard.recto"
			xs
		/>
		<DeckCardItemSide
			class="bg-content border shadow aspect-[4/3]"
			:block="theCard.verso"
			xs
		/>
	</div>
</template>

<style scoped>

</style>
