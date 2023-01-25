<template>
	<div
		class="grid place-items-center"
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

			<div class="w-full">
				<h3 class="uppercase text-center mt-5 my-2">
					résultats
				</h3>

				<div class="grid mx-auto gap-3 grid-cols-1 md:grid-cols-2">
					<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center">
						<div class="text-center flex flex-col justify-between h-full">
							<h4 class="text-xl uppercase ">
								score
							</h4>
							<div class="text-3xl">
								{{ props.challenge.user.score }}
							</div>
							<div class="text-sm">
								meilleur: {{ props.challenge.best.score }}
							</div>
						</div>
					</div>
					<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center">
						<div class="text-center flex flex-col justify-between h-full">
							<h4 class="text-xl uppercase">
								niveau
							</h4>
							<div class="text-3xl">
								{{ props.challenge.user.level }}
							</div>
							<div class="text-sm">
								meilleur: {{ props.challenge.best.level }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	challenge: {type: Object, required: true}
})

const emits = defineEmits(["start"])
</script>
