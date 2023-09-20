<template>
	<div
		class="bg-white rounded shadow text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
	>
		<div v-if="$slots.title">
			<slot name="title" />
		</div>
		<div><slot /></div>
	</div>
</template>

<script setup>
// TODO: remove InfoTile as only used in QuizzQuestionProjection.vue
</script>
