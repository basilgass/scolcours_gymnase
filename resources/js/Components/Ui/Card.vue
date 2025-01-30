<script setup lang="ts">

</script>

<template>
	<div class="bg-white dark:bg-gray-900">
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

<style scoped>

</style>
