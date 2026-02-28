<script
	lang="ts"
	setup
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {DeckInterface} from "@/types/modelInterfaces"
import {PropType} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

defineOptions({layout: LayoutMain})

const props = defineProps({
	decks: {type: Array as PropType<DeckInterface[]>, required: true}
})

// Chargement des scores
// TODO: récupérer l'info pour connaître le status d'un deck.
const scores = useStoreScore()
scores.getScores("Deck", props.decks.map(deck => deck.id))
	.then(res => {
		console.log(res)

	})

</script>

<template>
	<section>
		<article-title
			title="decks"
		/>

		<filtered-list
			:list="decks"
			list-class="grid
			grid-cols-1 md:grid-cols-2 xl:grid-cols-3
			gap-2 md:gap-3 xl:gap-5"
			title="decks"
			no-title
			:filter-by-theme="(deck)=>deck.chapter?.theme_id"
		>
			<template #card="{ item }: { item: DeckInterface }">
				<Card
					v-theme.border="item.chapter?.theme_id ?? false"
					:class="{
						'border-l-8':item.chapter?.theme_id,
						'opacity-20': !item.active
					}"
				>
					<div>
						<h3
							v-katex.auto="item.title"
							class="font-semibold"
						/>

						<div>{{ item.cards_count }} cartes</div>
					</div>

					<template #footer>
						<div class="flex justify-between">
							<sc-button
								xs
								:href="route('decks.portfolio', {deck: item.slug})"
							>
								portfolio
							</sc-button>
							<sc-button
								xs
								type="primary"
								:href="route('decks.show', item.slug)"
							>
								<i class="bi bi-play" />commencer
							</sc-button>
						</div>
					</template>
				</Card>
			</template>
		</filtered-list>
	</section>
</template>

