<template>
	<MainHeader :theme="theme" />
	<div class="min-h-screen bg-gray-100">
		<main class="scolcours-container  min-h-screen">
			<slot />
		</main>
		
		<main-footer />
	</div>
</template>

<script setup>
import MainHeader from '@/Components/MainHeader'
import MainFooter from '@/Components/MainFooter'

defineProps({
	theme: { type: Object, default: () => { return { title: 'Scolcours', slug: 'main' }} }
})
</script>
<style scoped>

</style>
