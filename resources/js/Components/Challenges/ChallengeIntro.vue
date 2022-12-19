<template>
	<div
		class="h-[40vh] grid place-items-center"
	>
		<div class="flex flex-col items-center gap-3">
			<div class="w-full space-y-2">
				<div class="flex justify-between w-full">
					<div>Nombre de vies</div>
					<div>{{ challenge.lives }}</div>
				</div>

				<div class="flex justify-between w-full">
					<div>Niveaux de diffcultés</div>
					<div>{{ challenge.maxLevel }}</div>
				</div>
				<div
					v-if="challenge.duration > 0"
					class="flex justify-between w-full"
				>
					<div>Temps</div>
					<div>{{ challenge.duration }}</div>
				</div>
			</div>
			<button
				class="btn-success btn-xl hover:scale-110 transition-all"
				@click="emits('start')"
			>
				Commencer le challenge
			</button>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	challenge: {type: Object, required: true}
})

const emits = defineEmits(["start"])
</script>
