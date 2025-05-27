<script lang="ts" setup>

import {useMagicKeys, whenever} from "@vueuse/core"
import {usePage} from "@inertiajs/vue3"

const displayStyle = defineModel<"side-by-side" | "editor" | "preview">()

const keys = useMagicKeys()
whenever(keys.ctrl_alt_left, () => {
	displayStyle.value = 'editor'
})
whenever(keys.ctrl_alt_right, () => {
	displayStyle.value = 'preview'
})
whenever(keys.ctrl_alt_up, () => {
	displayStyle.value = 'side-by-side'
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
			title="ctrl+alt+left"
		>
			<i class="bi bi-card-text" />
		</button>
		<button
			:class="displayStyle==='side-by-side'?'text-black':'text-gray-400'"
			@click="displayStyle='side-by-side'"
			title="ctrl+alt+up"
		>
			<i class="bi bi-layout-split" />
		</button>
		<button
			:class="displayStyle==='preview'?'text-black':'text-gray-400'"
			@click="displayStyle='preview'"
			title="ctrl+alt+rigth"
		>
			<i class="bi bi-image" />
		</button>
	</div>
</template>
