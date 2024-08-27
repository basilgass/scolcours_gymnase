<script
	lang="ts"
	setup
>

import FlipcardsShow from "@/Components/Decks/FlipcardsShow.vue";
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue";
import type { deckInterface } from "@/types/modelInterfaces";
import { PropType } from "vue";

defineOptions({ layout: LayoutFullpage })

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
		<Link :href="route('decks.index')">
		<i class="bi bi-arrow-left-square mr-3" />retour aux decks
		</Link>

		<!-- card mode -->
		<FlipcardsShow :deck="props.deck" />
	</section>
</template>

<style scoped></style>
