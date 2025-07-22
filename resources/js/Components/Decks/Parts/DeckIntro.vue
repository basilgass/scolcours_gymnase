<script setup lang="ts">

import {inject} from "vue"
import {provideDeckData} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"

const deckData = inject<provideDeckData>('deckData')

</script>

<template>
	<div>
		Commencer ou redémarrer le deck ?

		<sc-button
			@click="deckData.reset()"
			class="py-5"
			type="primary"
		>
			Recommencer
		</sc-button>
	</div>
</template>

<style scoped>

</style>
