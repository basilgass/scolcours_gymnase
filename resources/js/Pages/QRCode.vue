<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {QrcodeSvg} from "qrcode.vue"

defineOptions({layout: LayoutMain})

const codes: string[] = [
	'https://g.scolcours.ch/tools/matrice-augmentee?matrix=2+5+-1%0A1+1+1%0A-3+4+5&droite=-2%0A2%0A35',
	'https://g.scolcours.ch/tools/matrice-augmentee?droite=53%0A-8%0A-31&matrix=-5+-3+9%0A6+-4+5%0A0+-3+-7',
	'https://g.scolcours.ch/tools/matrice-augmentee?droite=-2%0A4%0A5&matrix=-2+-7+-4%0A7+1+4%0A1+-6+-1',
]
</script>

<template>
	<main class="py-10">
		<h1 class="text-xl pb-10">
			QR Code
		</h1>
		<div class="grid grid-cols-1 md:grid-cols-3 place-items-center">
			<div
				v-for="(code, index) in codes"
				:key="`code-${index}`"
				class="bg-content"
			>
				<qrcode-svg
					:value="code"
					:size="200"
				/>
				<div class="text-center font-semibold my-3">
					exercice {{ index + 1 }}
				</div>
			</div>
		</div>
	</main>
</template>
