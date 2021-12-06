<template>
	<div class="min-h-screen flex flex-col">
		<main class="container mx-auto flex-1">
			<slot />
		</main>
		
		<div class="bg-black text-white h-64">
			Se connecter
		</div>
	</div>
</template>

<script>
export default {
	name: 'LayoutFullpage'
}
</script>

<style scoped>

</style>
