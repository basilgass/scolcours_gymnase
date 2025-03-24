<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {QrcodeSvg} from "qrcode.vue"

defineOptions({layout: LayoutMain})
</script>

<template>
	<main class="bg-conttent">
		<div class="grid grid-cols-1 md:grid-cols-3">
			<qrcode-svg
				:value="'https://g.scolcours.ch/tools/matrice-augmentee?matrix=2+5+-1%0A1+1+1%0A-3+4+5&droite=-2%0A2%0A35'"
				:size="200"
			/>
			<qrcode-svg
				:value="'https://g.scolcours.ch/tools/matrice-augmentee?droite=53%0A-8%0A-31&matrix=-5+-3+9%0A6+-4+5%0A0+-3+-7'"
				:size="200"
			/>
			<qrcode-svg
				:value="'https://g.scolcours.ch/tools/matrice-augmentee?droite=-2%0A4%0A5&matrix=-2+-7+-4%0A7+1+4%0A1+-6+-1'"
				:size="200"
			/>
		</div>
	</main>
</template>

<style scoped>

</style>
