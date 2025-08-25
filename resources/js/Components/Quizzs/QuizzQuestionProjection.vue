<script setup lang="ts">
import { computed, PropType } from "vue"
import InfoTile from "@/Components/Ui/InfoTile.vue"
import { resultInterface } from "@/types"


const props = defineProps({
		quizzSession: { type: Object, required: true },
		usersCount: { type: Number, required: true },
		results: { type: Object as PropType<resultInterface[]>, required: true },
	}),
	nbAnswers = computed(() => props.results.length),
	nbCorrect = computed(
		() => props.results.filter((x) => x.pivot.result).length
	),
	ratioCorrect = computed(() => {
		return nbAnswers.value > 0
			? ((nbCorrect.value / nbAnswers.value) * 100).toFixed()
			: " - - "
	})

</script>

<template>
	<article class="grid place-items-center min-h-screen">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<info-tile class="max-w-lg text-3xl">
				<template #title>
					Réponses
				</template>
				{{ nbAnswers }} / {{ props.usersCount }}
			</info-tile>

			<info-tile class="max-w-lg text-3xl">
				<template #title>
					Juste
				</template>
				{{ ratioCorrect }}%
			</info-tile>

			<info-tile
				v-if="nbAnswers > props.usersCount * 0.1"
				class="col-span-1 md:col-span-2"
			>
				<template #title>
					Réponses
				</template>
				<div class="flex flex-wrap gap-10">
					<div
						v-for="(result, index) in props.results"
						:key="`result-${index}`"
						v-katex="result.pivot.answer"
					/>
				</div>
			</info-tile>
		</div>
	</article>
</template>
