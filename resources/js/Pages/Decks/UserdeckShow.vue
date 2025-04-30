<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {UserCardInterface, UserDeckInterface} from "@/types/modelInterfaces"
import DeckCards from "@/Components/Decks/DeckCards.vue"

defineOptions({layout: LayoutProjection})

withDefaults(defineProps<{
		deck: UserDeckInterface,
		cards: UserCardInterface[],
		hideTitle?: boolean
	}>(),
	{
		hideTitle: true
	}
)

</script>

<template>
	<section>
		<header
			v-if="!hideTitle"
			class="h-[6rem] p-3 bg-content"
		>
			<h3 class="text-3xl">
				{{ deck.title }}
			</h3>

			<InertiaLink :href="route('decks.index')">
				<i class="bi bi-arrow-left-square mr-3" />
				retour aux decks
			</InertiaLink>
		</header>


		<!-- card mode -->
		<deck-cards
			:cards
		/>
	</section>
</template>


