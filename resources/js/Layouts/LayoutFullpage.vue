<script setup lang="ts">
import MainFooter from "@/Components/MainFooter.vue"

</script>

<template>
	<div class="min-h-screen flex flex-col">
		<main class="container mx-auto flex-1">
			<slot />
		</main>

		<MainFooter />
	</div>
</template>

