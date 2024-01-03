<script lang="ts">
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"

export default {
	layout: LayoutFullpage
}
</script>

<script lang="ts" setup>

import FlipcardsIndex from "@/Components/Decks/FlipcardsIndex.vue"
import { deckInterface } from "@/types/modelInterfaces"
import { PropType } from "vue"
import FlipcardsLearn from "@/Components/Decks/FlipcardsLearn.vue"


const props = defineProps({
	deck: { type: Object as PropType<deckInterface>, required: true }
})
</script>

<template>
	<section>
		<h3 class="text-3xl">
			{{ deck.title }}
		</h3>
		<div class="font-code text-xs">
			{{ deck.slug }}
		</div>
		
		<!-- card mode -->
		<flipcards-learn :deck="props.deck" />
	</section>
</template>

<style scoped>

</style>
