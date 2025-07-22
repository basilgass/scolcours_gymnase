<script setup lang="ts">

import DeckPotfolioItem from "@/Components/Decks/Parts/DeckPotfolioItem.vue"
import {computed, inject} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {CardInterfaceExtended, provideDeckData} from "@/types/modelInterfaces.ts"

const deckData = inject<provideDeckData>('deckData')

const summaryList = computed<CardInterfaceExtended[]>(() => {
	return deckData.cards.value
		.filter(card => card.current_appearances > 1)
		.toSorted((a, b) => {
			return b.current_appearances - a.current_appearances
		})
})

const deckResult = computed<number>(()=>{
	return 100 - Math.round(summaryList.value.length / deckData.cards.value.length * 100)
})

function resetDeck(){
	console.log('RESET DECK')
	deckData.reset()
}

</script>

<template>
	<div
		class="grid grid-cols-1 px-10 my-20"
	>
		<div class="text-center flex flex-col gap-10">
			<div class="font-code text-3xl">
				Bravo ! Le deck de cartes est terminé !
			</div>

			<sc-button
				@click="resetDeck"
				class="py-5"
				type="primary"
			>
				recommencer
			</sc-button>
		</div>
		<div class="mt-20 space-y-10">
			<h3 class="text-3xl text-center font-semibold">
				Classement
			</h3>

			<div class="flex gap-5 justify-center flex-wrap">
				<div class="bg-content size-[150px] grid place-items-center">
					<div class="text-center">
						<div class="text-3xl">
							{{ deckResult }}
							<span class="text-lg">%</span>
						</div>
						<div>
							de réussites
						</div>
					</div>
				</div>

				<div class="bg-content size-[150px] grid place-items-center">
					<div class="text-center">
						<div class="text-3xl">
							{{ summaryList.length }}
						</div>
						<div>
							cartes non sues
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-5 max-w-3xl mx-auto">
				<div
					v-for="card in summaryList"
					:key="`summary-card-${card.id}`"
				>
					<div>
						{{ card.current_appearances }} essais
					</div>
					<deck-potfolio-item
						class="grid grid-cols-2 gap-2"
						:card="card"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
