<script lang="ts" setup>

import { PropType } from "vue"

const displayStyle = defineModel({
	type: String as PropType<"side-by-side" | "editor" | "preview">
})
</script>
<template>
	<div
		class="flex text-xs gap-3 fixed bottom-1 left-1
	bg-white
	border shadow px-3 py-1 z-10"
	>
		<button
			:class="displayStyle==='editor'?'text-black':'text-gray-400'"
			@click="displayStyle='editor'"
		>
			<i class="bi bi-card-text" />
		</button>
		<button
			:class="displayStyle==='side-by-side'?'text-black':'text-gray-400'"
			@click="displayStyle='side-by-side'"
		>
			<i class="bi bi-layout-split" />
		</button>
		<button
			:class="displayStyle==='preview'?'text-black':'text-gray-400'"
			@click="displayStyle='preview'"
		>
			<i class="bi bi-image" />
		</button>
	</div>
</template>
