<template>
	<MainHeader :theme="theme" />
	<div class="min-h-screen flex flex-col bg-gray-100 pb-36">
		<main class="scolcours-container">
			<slot />
		</main>
	</div>
</template>

<script setup>
	import MainHeader from "@/Components/MainHeader"

	defineProps({
		theme: { type: Object, default: ()=>{ return { title: "Scolcours", slug: "main" }} }
	})
</script>
<style scoped>

</style>
