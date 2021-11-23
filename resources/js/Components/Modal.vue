<template>
	<div
			class="fixed top-0 left-0 w-full h-full min-h-screen bg-gray-700/80"
			@click.stop="$emit('close')"
		>
		<div
				class="flex h-full w-full items-center justify-center"
			>
			<div
					class="relative"
					@click.stop
				>
				<div
						class="absolute top-3 right-3
						border rounded-full
						h-8 w-8
						flex items-center justify-center
						hover:text-gray-700 text-gray-200
						hover:border-gray-700 transition-all duration-500"
						@click="$emit('close')"
					>
					<i class="bi bi-x-lg" />
				</div>
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup>
	defineEmits(["close"])
</script>

<style scoped>

</style>
