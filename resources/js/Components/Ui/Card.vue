<script lang="ts" setup>

const slots = defineSlots<{
	header(),
	default()
	footer()
}>()
</script>

<template>
	<div class="bg-white rounded shadow">
		<div
			v-if="slots['header']"
			class="h-[3em] text-lg px-3 flex flex-col items-center"
		>
			<slot name="header" />
		</div>
		<slot />
		<slot name="footer" />
	</div>
</template>

<style scoped>

</style>
