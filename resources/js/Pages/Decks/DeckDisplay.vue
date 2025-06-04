<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {BlockInterface, CardInterface, DeckInterface, UserCardInterface} from "@/types/modelInterfaces"
import DeckCards from "@/Components/Decks/DeckCards.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {onMounted, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import axios from "axios"
import {makeUserCard} from "@/helpers/makeModel.ts"

defineOptions({layout: LayoutProjection})

const props = withDefaults(defineProps<{
		deck: DeckInterface,
		hideTitle?: boolean
	}>(),
	{
		hideTitle: true
	}
)

const cards = ref<UserCardInterface[]>([])

onMounted(() => {
	axios.get(route("decks.cards.fetch", {deck: props.deck.id}))
		.then((res) => {
			cards.value = res.data.map((c:CardInterface) => makeUserCard(c.recto, c.verso))
		})
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
			:cards
		/>
		<div v-else>
			<Card class="text-xl md:text-2xl p-10 min-h-[40vh] grid place-items-center">
				En attente des cartes...
			</Card>
		</div>
	</section>
</template>


