<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CardInterface, DeckInterface} from "@/types/modelInterfaces.ts"
import DeckPotfolioItem from "@/Components/Decks/Parts/DeckPotfolioItem.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"

defineOptions({layout: LayoutMain})

defineProps<{
	deck: DeckInterface,
}>()


</script>

<template>
	<section>
		<article-title
			:title="deck.title"
			:return-link="{
				label: 'retour aux decks',
				url: route('decks.index')
			}"
		/>

		<main class="flex flex-col gap-10 mt-10">
			<deck-potfolio-item
				class="grid grid-cols-2 gap-2"
				v-for="card in deck.cards"
				:key="card.id"
				:card="card"
			/>
		</main>
	</section>
</template>

<style scoped>

</style>
