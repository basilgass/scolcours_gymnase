<script setup lang="ts">
import MainFooter from "@/Components/MainFooter.vue"
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<main class="container mx-auto flex-1 px-2 md:px-0">
			<slot />
		</main>

		<MainFooter />
	</div>
</template>

