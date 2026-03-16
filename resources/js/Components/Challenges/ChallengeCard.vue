<script setup lang="ts">
import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {ref} from "vue"
import {router} from "@inertiajs/vue3";

const props = defineProps<{
	challenge: ChallengeInterface
}>()

const score = ref<ScoreInterface<ScoreChallengeDataInterface>>()
useStoreScore().getScore("Challenge", props.challenge.id)
	.then((sc: ScoreInterface<ScoreChallengeDataInterface>) => score.value = sc)

function onChallengeCardClick() {
	router.visit(route('challenges.quick', {slug: props.challenge.slug}))
}
</script>

<template>
	<card
		header-theme
		class="transition hover:shadow-lg cursor-pointer"
		@click="onChallengeCardClick"
	>
		<template #header>
			<div
				v-katex.auto="challenge.title"
				class="font-lg font-semibold"
			/>

		</template>

		<div class="grid place-items-center">
			<div
				v-if="score && score.attempts"
				class="w-full max-w-50 mx-3"
			>
				<div class="grid grid-cols-3 gap-3 text-center">
					<div>
						<div class="text-3xl font-semibold">
							{{ score.score }}
						</div>
						<div class="text-xs">
							pts
						</div>
					</div>
					<div>
						<div class="text-3xl font-semibold">
							{{ score.data.level }}
						</div>
						<div class="text-xs">
							niv
						</div>
					</div>
					<div>
						<div class="text-3xl font-semibold">
							{{ score.attempts }}
						</div>
						<div class="text-xs">
							essais
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				pas encore fait...
			</div>
		</div>
	</card>
</template>

<style scoped>

</style>
