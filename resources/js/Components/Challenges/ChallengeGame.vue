<script lang="ts" setup>

import {ChallengeGameState, ChallengeInterface, QuestionInterface} from "@/types/modelInterfaces"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import {useChallenge} from "@/Composables/useChallenge.ts"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"
import GameTimerBar from "@/Components/Challenges/Game/GameTimerBar.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
defineEmits<{ stateChange: [value: ChallengeGameState] }>()

const data = useChallenge(props.challenge)


</script>

<template>
	<article
		class="max-w-lg mx-auto "
	>
		<challenge-intro
			v-if="data.state.value === 'intro'"
			:challenge
			:score="data.store.score.value"
			:max-levels="data.config.value.maxLevels"
			:score-label="data.config.value.label"
			:format-score="data.config.value.labelFormat"
			@start="data.controls.start"
		/>
		<div v-else-if="data.state.value === 'running'">
			<!-- game header - current score, stats, ... -->
			<game-score-header
				:current="data.current"
				:results="data.store.results"
				:config="data.config.value"
			/>

			<!-- global timer -->
			<game-timer-bar
				v-if="data.config.value.globalTimer"
				:max="data.config.value.remainingTime"
				:value="data.store.results.elapsedTime"
				:inverted="data.config.value.invertedTimer"
			/>

			<!-- question timer -->
			<game-timer-bar
				v-if="data.config.value.questionTimer"
				:max="data.current.timeLimit.value"
				:value="data.store.results.questionElapsedTime"
				:inverted="data.config.value.invertedTimer"
			/>

			<!-- question component -->
			<question-show
				:key="`q-${data.store.results.level}-${data.store.answers.value.length}`"
				:question="data.current.question.value as QuestionInterface"
				show-input
				@validate="data.current.validate"
			/>
		</div>
		<challenge-results
			v-else-if="data.state.value === 'finished'"
			:answers="data.store.answers.value"
			:results="data.store.results"
			:score="data.store.score.value"
			:config="data.config.value"
			@start="data.controls.start"
			@cancel="data.state.value = 'intro'"
		/>
	</article>
</template>
