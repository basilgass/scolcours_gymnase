<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {QrcodeSvg} from "qrcode.vue"

defineOptions({layout: LayoutMain})

const codes: string[] = []
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
