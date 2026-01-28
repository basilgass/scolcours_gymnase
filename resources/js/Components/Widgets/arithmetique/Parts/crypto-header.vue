<script setup lang="ts">

import {computed} from "vue"

const props = defineProps<{
	text: {
		clear: string,
		cipher: string,
		key: string,
		expanded?: string
	},
	parameters: Record<string, string | boolean>,
}>()

/* =======================
   Show booleans
======================= */
const showClearText = computed(() => {
	return props.parameters.clear || props.parameters.text
})
const showCipherText = computed(() => {
	return props.parameters.code || props.parameters.text
})
const showExpandedKey = computed(() => {
	return props.parameters.expanded || props.parameters.text
})

</script>

<template>
	<div class="overflow-x-auto whitespace-nowrap">
		<table>
			<tbody>
				<tr
					v-if="showClearText"
					class="h-8"
				>
					<td class="font-semibold pr-5">
						texte claire
					</td>
					<td class="font-code tracking-[0.65rem]">
						{{ text.clear }}
					</td>
				</tr>
				<tr
					v-if="showExpandedKey && text.expanded"
					class="h-8"
				>
					<td class="font-semibold pr-5">
						clé
					</td>
					<td class="font-code tracking-[0.65rem]">
						{{ text.expanded }}
					</td>
				</tr>
				<tr
					v-if="showCipherText"
					class="h-8"
				>
					<td class="font-semibold pr-5">
						texte codé
					</td>
					<td class="font-code tracking-[0.65rem]">
						{{ text.cipher }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>

</style>
