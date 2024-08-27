<script lang="ts" setup>

import FlipcardsIndex from "@/Components/Decks/FlipcardsIndex.vue";
import LayoutMain from "@/Layouts/LayoutMain.vue";
import type { deckInterface } from "@/types/modelInterfaces";
import { PropType } from "vue";

defineOptions({ layout: LayoutMain })

const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})
</script>

<template>
	<section class="my-5 scolcours-container">
		<h3 class="text-3xl">
			{{ deck.title }}
		</h3>
		<div class="font-code text-xs">
			{{ deck.slug }}
		</div>
		<Link :href="route('decks.index')">
		Retour à la liste des decks
		</Link>

		<!-- view mode -->
		<flipcards-index :deck="props.deck" />
	</section>
</template>

<style scoped></style>
