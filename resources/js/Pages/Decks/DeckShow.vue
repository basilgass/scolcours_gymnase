<script
	lang="ts"
	setup
>
import FlipcardsShow from "@/Components/Decks/FlipcardsShow.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type { DeckInterface } from "@/types/modelInterfaces"
import { PropType } from "vue"

defineOptions({ layout: LayoutProjection })
const props = defineProps({
	deck: { type: Object as PropType<DeckInterface>, required: true }
})
</script>

<template>
	<section>
		<header class="mb-5">
			<h3 class="text-3xl">
				{{ deck.title }}
			</h3>
			<div class="font-code text-xs">
				{{ deck.slug }}
			</div>
			<InertiaLink :href="route('decks.index')">
				<i class="bi bi-arrow-left-square mr-3" />
				retour aux decks
			</InertiaLink>
		</header>

		<!-- card mode -->
		<FlipcardsShow
			class="w-full mt-10"
			:deck="props.deck"
		/>
	</section>
</template>

<style scoped></style>
