<template>
	<div class="chapter-exercise-wrapper mt-5">
		<div class="flex justify-between items-center">
			<h3 class="uppercase text-xs font-extralight">
				{{ title }}
			</h3>
			<div v-if="$slots.options">
				<slot name="options" />
			</div>
		</div>

		<div v-bind="$attrs">
			<slot />
		</div>
	</div>
</template>

<script setup>

let props = defineProps({
	title: {type: String, default: "Exemple"}
})

</script>
