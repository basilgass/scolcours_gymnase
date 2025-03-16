<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {UserDeckCardsInterface, UserDeckInterface} from "@/types/modelInterfaces"
import CardsShow from "@/Components/Decks/CardsShow.vue"

defineOptions({layout: LayoutProjection})

const props = defineProps<{
	deck: UserDeckInterface,
	cards: UserDeckCardsInterface[]
}>()

</script>

<template>
	<section>
		<header class="h-[6rem] p-3 bg-content">
			<h3 class="text-3xl">
				{{ deck.title }}
			</h3>

			<InertiaLink :href="route('decks.index')">
				<i class="bi bi-arrow-left-square mr-3" />
				retour aux decks
			</InertiaLink>
		</header>


		<!-- card mode -->
		<cards-show
			class="h-[calc(100vh-10rem)]
			max-w-[calc(100vw-2rem)]
			lg:max-w-3xl
			xl:max-w-4xl
			mx-auto"
			:cards
		/>
	</section>
</template>


