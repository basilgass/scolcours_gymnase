<script setup lang="ts">
import {CardInterface} from "@/types/modelInterfaces.ts"
import DeckCardItemSide from "@/Components/Decks/Parts/DeckCardItemSide.vue"

defineProps<{
	card: CardInterface
}>()

</script>

<template>
	<div
		class="grid grid-cols-2 gap-2"
	>
		<DeckCardItemSide
			class="bg-content border shadow aspect-[4/3]"
			:block="card.recto"
			xs
		/>
		<DeckCardItemSide
			class="bg-content border shadow aspect-[4/3]"
			:block="card.verso"
			xs
		/>
	</div>
</template>

<style scoped>

</style>
