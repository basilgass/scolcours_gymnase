<script
	lang="ts"
	setup
>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {DeckInterface} from "@/types/modelInterfaces"
import DeckDisplay from "@/Pages/Decks/DeckDisplay.vue"

defineOptions({layout: LayoutProjection})


const props = withDefaults(defineProps<{
		deck: DeckInterface,
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


		<!--		 card mode -->
		<suspense>
			<deck-display :deck />
		</suspense>
	</section>
</template>


