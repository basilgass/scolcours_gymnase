<script setup lang="ts">

import { PropType } from "vue"

const displayStyle = defineModel({
	type: String as PropType<"side-by-side" | "editor" | "preview">,
})
</script>
<template>
	<div class="flex text-xs gap-3 fixed bottom-1 right-1 bg-white border shadow px-3 py-1 z-10">
		<button
			@click="displayStyle='editor'"
			:class="displayStyle==='editor'?'text-black':'text-gray-400'"
		>
			<i class="bi bi-card-text" />
		</button>
		<button
			@click="displayStyle='side-by-side'"
			:class="displayStyle==='side-by-side'?'text-black':'text-gray-400'"
		>
			<i class="bi bi-layout-split" />
		</button>
		<button
			@click="displayStyle='preview'"
			:class="displayStyle==='preview'?'text-black':'text-gray-400'"
		>
			<i class="bi bi-image" />
		</button>
	</div>
</template>
