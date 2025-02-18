<script setup lang="ts">
// TODO: remove InfoTile as only used in QuizzQuestionProjection.vue
</script>

<template>
	<div
		class="bg-white rounded-sm shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
	>
		<div v-if="$slots.title">
			<slot name="title" />
		</div>
		<div><slot /></div>
	</div>
</template>
