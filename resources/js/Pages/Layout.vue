<template>
	<MainHeader :theme="theme" />
	<div class="min-h-screen flex flex-col bg-gray-100 pb-36">
		<main class="scolcours-container">
			<slot />
		</main>
	</div>
</template>

<script>
	import MainHeader from "@/Components/MainHeader"
	import MainAside from "@/Components/MainAside"

	export default {
		name: "Layout",
		components: {MainAside, MainHeader},
		props: {
			showAside: {type: Boolean, default: true},
			theme: {type: Object, default: {title: "ScolCours"}}
		}
	}
</script>
<style scoped>

</style>
