<script setup lang="ts">

withDefaults(defineProps<{
	withThemes?: boolean
}>(), {
	withThemes: false
})
</script>

<template>
	<div :class="withThemes?'':'bg-content'">
		<header
			v-if="$slots['header']"
			class="px-3 py-2 border-b"
		>
			<slot name="header" />
		</header>
		<main class="p-3">
			<slot />
		</main>
		<footer
			v-if="$slots['footer']"
			class="px-3 py-2 border-t"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>


