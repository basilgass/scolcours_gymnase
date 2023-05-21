<template>
	<div class="max-w-xl mx-auto keyboard">
		<button
			class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800"
			@click="emits('validate')"
		>
			<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
		</button>
	</div>
</template>
<script setup>
const emits = defineEmits(["validate"])
</script>
