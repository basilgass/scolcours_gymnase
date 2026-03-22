<script lang="ts" setup>

import {useChallenge} from "@/Composables/useChallenge.ts"
import {ChallengeInterface, QuestionInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import {computed, watch} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"
import GameTimerBar from "@/Components/Challenges/Game/GameTimerBar.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import StatBar from "@/Components/Ui/StatBar.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
const emits = defineEmits<{ stateChange: [value: ChallengeGameState] }>()

const flash = useStoreFlashMessage()

const {
	state, game, score, currentQuestion, answers,
	currentLevel, maxLevels,
	generate, nextQuestion, checkAndAdvanceLevel, recordAnswer,
	startGlobalTimer, startQuestionTimer,
	resetGame, beginGame, endGame, persistScore,
} = useChallenge(props.challenge)

watch(state, v => emits('stateChange', v))

const targetScore = computed(() =>
	props.challenge.levels[props.challenge.levels.length - 1]?.points_to_pass ?? 10
)

function formatTime(v: number): string {
	return v > 0 ? `${Math.round(v)}s` : '—'
}

function start() {
	resetGame({lives: 0, remainingTime: 0})
	generate()
	beginGame()
	startGlobalTimer()
	startQuestionTimer()
}

function end() {
	endGame()

	if (game.score < targetScore.value) {
		flash.info("Objectif non atteint !")
		return
	}

	const isFirst = (score.value?.score ?? 0) === 0
	const improved = isFirst || game.elapsedTime < (score.value?.score ?? Infinity)

	score.value.score = improved ? game.elapsedTime : score.value.score
	score.value.data.level = Math.max(game.level, score.value?.data?.level ?? 0)
	score.value.data.current_score = game.elapsedTime
	score.value.data.current_level = game.level

	persistScore().then(() => {
		if (improved) {
			flash.success(`Bravo, nouveau meilleur temps : ${Math.round(game.elapsedTime)}s`)
		} else {
			flash.info("Vous n'avez pas amélioré votre temps... dommage !")
		}
	})
}

function validate(answer: questionResultInterface) {
	recordAnswer(answer)

	if (answer.result) {
		game.score += game.level
		game.levelScore++

		if (game.score >= targetScore.value) {
			end()
			return
		}

		const leveled = checkAndAdvanceLevel()
		if (!leveled) nextQuestion()
		startQuestionTimer()
	} else {
		game.death++
		game.levelScore = 0
		// Pas de game over sur erreur pour chrono
	}
}
</script>

<template>
	<section class="p-3 max-w-[40em] mx-auto">
		<challenge-intro
			v-if="state === 'intro'"
			:challenge
			:score="score"
			:max-levels="maxLevels"
			score-label="temps"
			:format-score="formatTime"
			class="mt-4"
			@start="start"
		/>

		<div v-if="state === 'running'">
			<game-score-header
				:score="`${game.score} / ${targetScore}`"
				score-label="objectif"
				:right-value="`${Math.round(game.elapsedTime)}s`"
				right-label="temps écoulé"
				:max-levels="maxLevels"
				:game-level="game.level"
				:game-level-score="game.levelScore"
				:next-level-after="currentLevel?.points_to_pass"
			/>
			<stat-bar
				class="my-2"
				:max="targetScore"
				:value="game.score"
				:bar-label="`${game.score} / ${targetScore}`"
				bar-label-class="text-gray-500"
			/>
			<question-show
				:key="`q-${game.level}-${answers.length}`"
				:question="currentQuestion as QuestionInterface"
				show-input
				@validate="validate"
			/>
		</div>

		<challenge-results
			v-if="state === 'finished'"
			class="flex flex-col gap-2"
			:results="game"
			:answers
			:score
			score-label="Temps"
			:current-score-display="formatTime(game.elapsedTime)"
			best-score-label="Meilleur temps"
			:best-score-display="formatTime(score?.score ?? 0)"
			:show-lives-and-deaths="false"
			:show-timer="false"
			@start="start"
			@cancel="state = 'intro'"
		/>
	</section>
</template>