<script setup lang="ts">

import { useClipboard } from "@vueuse/core"

const props = defineProps({
	tex: {type: String, required: true}
})

const { copy, copied } = useClipboard()

</script>

<template>
	<div class="relative text-xs text-gray-600 border bg-gray-100 px-3 py-2">
		<button
			class="bi absolute top-1 right-1"
			:class="copied ? 'bi-check-lg text-green-600' : 'bi-clipboard-fill text-gray-400'"
			@click="copy(props.tex)"
		/>
		<div
			class="font-code"
			v-html="props.tex.split('\n').join('<br/>')"
		/>
	</div>
</template>


