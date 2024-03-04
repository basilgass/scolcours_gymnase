<script lang="ts">
import MainFooter from "@/Components/MainFooter.vue"

export default {
	name: "LayoutFullpage",
	components: {MainFooter}
}
</script>

<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<main class="container mx-auto flex-1">
			<slot />
		</main>

		<MainFooter />
	</div>
</template>

