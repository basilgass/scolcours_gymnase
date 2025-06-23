<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {CardInterface, DeckInterface} from "@/types/modelInterfaces"
import DeckCards from "@/Components/Decks/DeckCards.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {onMounted, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import axios from "axios"
import {makeCard} from "@/helpers/makeModel.ts"

defineOptions({layout: LayoutProjection})

const props = withDefaults(defineProps<{
		deck: DeckInterface,
		hideTitle?: boolean
	}>(),
	{
		hideTitle: true
	}
)

const cards = ref<CardInterface[]>(props.deck.cards ?? [])

onMounted(() => {
	if (props.deck.cards.length === 0) {
		// Ne recherche les cartes que si elles ne sont pas chargées...
		axios.get(route("api.decks.cards.index", {deck: props.deck.id}))
			.then((res) => {
				cards.value = res.data.map((c: CardInterface) => makeCard(c.recto, c.verso))
			})
	}
})
</script>

<template>
	<section>
		<article-title
			:title="deck.title"
			:return-link="{
				label: 'retour aux decks',
				url: route('decks.index')
			}"
			v-if="!hideTitle"
		/>


		<!-- card mode -->
		<deck-cards
			v-if="cards.length>0"
			:cards="deck.cards"
		/>
		<div v-else>
			<Card class="text-xl md:text-2xl p-10 min-h-[40vh] grid place-items-center">
				En attente des cartes...
			</Card>
		</div>
	</section>
</template>


