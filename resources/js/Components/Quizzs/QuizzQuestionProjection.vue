<script setup lang="ts">
import {computed} from "vue"
import InfoTile from "@/Components/Ui/InfoTile.vue"
import {QuizzSessionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"


const props = defineProps<{
	quizzSession: QuizzSessionInterface,
	usersCount: number,
	scores: ScoreInterface<ScoreQuestionDataInterface>[]
}>()

const nbAnswers = computed(() => props.scores.filter(score => score.data?.answers?.length > 0).length)
const MIN_ANSWERS_BEFORE_DISPLAY = Math.min(Math.floor(props.usersCount / 2), 10)

const nbCorrect = computed(
	() => props.scores.filter((score) => score.is_resolved).length
)

const ratioCorrect = computed(() => {
	return nbAnswers.value > 0
		? ((nbCorrect.value / nbAnswers.value) * 100).toFixed()
		: " - - "
})

const answers = computed(() => {
	const answeredScores = props.scores.filter(score => score.data !== null)

	return [...new Set(answeredScores.map(score => score.data.answers[0]))]
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
				v-if="nbAnswers >= MIN_ANSWERS_BEFORE_DISPLAY"
				class="col-span-1 md:col-span-2"
			>
				<template #title>
					Réponses
				</template>
				<div class="flex flex-wrap gap-10">
					<div
						v-for="(answer, index) in answers"
						:key="`result-${index}`"
						v-katex.ascii="answer"
					/>
				</div>
			</info-tile>
		</div>
	</article>
</template>
