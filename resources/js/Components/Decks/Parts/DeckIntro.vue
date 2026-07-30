<script setup lang="ts">

import {inject} from "vue"
import {provideDeckData} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const injected = inject<provideDeckData>('deckData')
if (!injected) {
	throw new Error("deckData doit être fourni (voir DeckDisplay.vue).")
}
const deckData = injected

</script>

<template>
	<div class="flex flex-col gap-5 items-center">
		<h1
			v-katex.auto="deckData.title"
			class="text-4xl font-code"
		/>

		<sc-button
			class="py-5"
			type="primary"
			@click="deckData.reset()"
		>
			Commencer le deck
		</sc-button>
	</div>
</template>

<style scoped>

</style>
