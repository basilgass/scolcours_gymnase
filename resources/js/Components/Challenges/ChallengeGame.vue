<script lang="ts" setup>

import ChallengeGameScore from "@/Components/Challenges/ChallengeGameScore.vue"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import StatBar from "@/Components/Ui/StatBar.vue"
import {ChallengeGameState, ChallengeInterface, QuestionInterface} from "@/types/modelInterfaces"
import {watch} from "vue"
import {useChallenge} from "@/Composables/useChallenge.ts"

const props = defineProps<{
	challenge: ChallengeInterface,
}>()

const challengeData = useChallenge(props.challenge)

const emits = defineEmits<{
	stateChange: [value: ChallengeGameState]
}>()

watch(challengeData.state, () => {
	emits('stateChange', challengeData.state.value)
})

</script>

<template>
	<section
		class="p-3 max-w-[40em] mx-auto"
	>
		<challenge-intro
			v-if="challengeData.state.value==='intro'"
			:challenge="challengeData.challenge.value"
			:score="challengeData.score.value"
			:max-levels="challengeData.maxLevels.value"
			class="mt-4"
			@start="challengeData.controls.start"
		/>

		<div v-if="challengeData.state.value==='running'">
			<!-- score display -->
			<ChallengeGameScore
				:game-level="challengeData.game.level"
				:game-level-score="challengeData.game.levelScore"
				:max-levels="challengeData.maxLevels.value"
				:game-score="challengeData.game.score"
				:next-level-after="challengeData.currentLevel.value.points_to_pass"
				:challenge-type="props.challenge.type"
				:target-score="challengeData.targetScore.value"
			/>

			<!-- Barre de temps descendante (classic, blitz, streak avec limite, precision avec limite) -->
			<stat-bar
				v-if="!['endurance', 'chrono'].includes(props.challenge.type) && challengeData.game.remainingTime > 0"
				class="my-2"
				:max="challengeData.game.remainingTime"
				:value="challengeData.game.elapsedTime"
				inverted
				:bar-label="`${Math.max(0, Math.round(challengeData.game.remainingTime - challengeData.game.elapsedTime))}s`"
				bar-label-class="text-gray-500"
			/>

			<!-- Barre ascendante pour chrono (progression vers la cible) -->
			<stat-bar
				v-else-if="props.challenge.type === 'chrono'"
				class="my-2"
				:max="challengeData.targetScore.value"
				:value="challengeData.game.score"
				:bar-label="`${Math.round(challengeData.game.elapsedTime)}s — ${challengeData.game.score}/${challengeData.targetScore.value}`"
				bar-label-class="text-gray-500"
			/>

			<!-- question display -->
			<question-show
				:key="`level-${challengeData.game.level}-question-${challengeData.result.value.length}`"
				:question="challengeData.currrentQuestion.value as QuestionInterface"
				show-input
				@validate="challengeData.controls.validate"
			/>
		</div>

		<challenge-results
			v-if="challengeData.state.value==='finished'"
			class="flex flex-col gap-2"
			:results="challengeData.game"
			:answers="challengeData.result.value"
			:challenge="challengeData.challenge.value"
			:score="challengeData.score.value"
			:challenge-type="props.challenge.type"
			@cancel="challengeData.state.value='intro'"
			@start="challengeData.controls.start"
		/>
	</section>
</template>


