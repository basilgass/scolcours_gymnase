<script
	lang="ts"
	setup
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {DeckInterface, UserDeckInterface} from "@/types/modelInterfaces"
import {PropType} from "vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

const props = defineProps({
	decks: {type: Array as PropType<UserDeckInterface[]>, required: true}
})


</script>

<template>
	<section class="scolcours-container">
		<h3 class="text-3xl py-4">
			Decks de révision
		</h3>

		<div
			v-if="decks.length>0"
			class="flex flex-col gap-3"
		>
			<div
				v-for="deck in decks"
				:key="deck.id"
				class="bg-content p-3 flex justify-between"
			>
				<div>
					<h3
						v-katex.auto="deck.title"
						class="font-semibold"
					/>
					<div v-katex.auto="deck.description" />

					<div>{{ deck.number_of_cards }} cartes</div>


					<details>
						<summary>
							voir le code
						</summary>
						<pre>{{ deck }}</pre>
					</details>
				</div>

				<div>
					<sc-button :href="route('decks.show', deck.id)">
						{{ deck.running ? 'continuer' : 'commencer' }}
					</sc-button>
				</div>
			</div>
		</div>
	</section>
</template>

