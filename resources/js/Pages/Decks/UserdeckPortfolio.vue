<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {UserCardInterface} from "@/types/modelInterfaces.ts"
import {makeCard} from "@/helpers/makeModel.ts"
import DeckPotfolioItem from "@/Components/Decks/Parts/DeckPotfolioItem.vue"

defineOptions({layout: LayoutMain})

defineProps<{
	deck: {
		id: number,
		title: string,
	},
	cards: UserCardInterface[]
}>()


</script>

<template>
	<section>
		<header>
			Affichage de toutes les cartes
		</header>

		<main class="flex flex-col gap-10">
			<deck-potfolio-item
				class="grid grid-cols-2 gap-2"
				v-for="card in cards"
				:key="card.id"
				:card="makeCard(card)"
			/>
		</main>
	</section>
</template>

<style scoped>

</style>
