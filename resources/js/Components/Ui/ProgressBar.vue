<template>
	<div class=" min-w-[400px]">
		<div class="border border-green-700 rounded bg-green-50">
			<div
				class="bg-green-500 h-2"
				:style="`width: ${percent}%`"
			/>
		</div>
	</div>
</template>
<script setup>

defineProps({
	percent: {type: Number, required: true}
})
</script>
