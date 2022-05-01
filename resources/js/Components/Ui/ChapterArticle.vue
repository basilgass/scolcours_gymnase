<template>
	<div class="bg-white px-4 py-2 rounded shadow grid grid-cols-1 gap-10">
		<div class="flex justify-between items-center">
			<h2 class="chapter-menu text-xl my-4">
				<slot name="title" />
			</h2>
			<div v-if="$slots.options!==undefined">
				<slot name="options" />
			</div>
		</div>
		<slot />
	</div>
</template>
<script setup>

</script>
