<script lang="ts" setup>
// @ts-nocheck
import {ChallengeInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"
import GameTimerBar from "@/Components/Challenges/Game/GameTimerBar.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
const emits = defineEmits<{ stateChange: [value: ChallengeGameState] }>()

/**
const flash = useStoreFlashMessage()

const {
	state, game, score, currentQuestion, answers,
	currentLevel, maxLevels, generatedTimeLimits, generatedId,
	generate, nextQuestion, checkAndAdvanceLevel, recordAnswer,
	startGlobalTimer, startQuestionTimer,
	resetGame, beginGame, endGame, persistScore,
} = useChallenge(props.challenge)

watch(state, v => emits('stateChange', v))

const currentQuestionTimeLimit = computed(() =>
	generatedTimeLimits.value[generatedId.value] ?? null
)

function startCurrentQuestionTimer() {
	startQuestionTimer({
		timeLimit: currentQuestionTimeLimit.value,
		onExpire: onFailure,
	})
}

function start() {
	resetGame({lives: props.challenge.lives, remainingTime: props.challenge.time_limit})
	generate()
	beginGame()
	startGlobalTimer(elapsed => {
		if (elapsed >= game.remainingTime) end()
	})
	startCurrentQuestionTimer()
}

function end() {
	endGame()

	const delta = game.score - (score.value?.score ?? 0)
	const deltaLevel = game.level - (score.value?.data?.level ?? 0)

	score.value.score = Math.max(game.score, score.value?.score ?? 0)
	score.value.data.level = Math.max(game.level, score.value?.data?.level ?? 0)
	score.value.data.current_score = game.score
	score.value.data.current_level = game.level

	persistScore().then(() => {
		if (delta > 0) {
			flash.success(`Bravo, vous avez amélioré votre score de ${delta} point${delta > 1 ? 's' : ''}`)
		} else if (deltaLevel > 0) {
			flash.success(`Bravo, vous avez amélioré votre niveau !`)
		} else {
			flash.info("Vous n'avez pas amélioré votre score... dommage !")
		}
	})
}

function onFailure() {
	game.death++
	game.levelScore = 0

	if (props.challenge.lives && (game.lives - game.death <= 0)) {
		end()
		return
	}

	nextQuestion()
	startCurrentQuestionTimer()
}

function validate(answer: questionResultInterface) {
	recordAnswer(answer)

	if (answer.result) {
		game.score += game.level

		game.levelScore++
		const leveled = checkAndAdvanceLevel()
		if (!leveled) nextQuestion()

		startCurrentQuestionTimer()
	} else {
		onFailure()
	}
} */
</script>

<template>
	<section class="p-3 max-w-[40em] mx-auto">
		<game-score-header
			:score="game.score"
			score-label="score"
			:right-value="`${game.levelScore} / ${currentLevel?.points_to_pass}`"
			:right-label="game.level === maxLevels ? 'niveau max' : 'prochain niveau'"
			:max-levels="maxLevels"
			:game-level="game.level"
			:game-level-score="game.levelScore"
			:next-level-after="currentLevel?.points_to_pass"
		/>
		<game-timer-bar
			v-if="game.remainingTime > 0"
			class="my-2"
			:max="game.remainingTime"
			:value="game.elapsedTime"
			inverted
		/>
		<game-timer-bar
			v-if="currentQuestionTimeLimit"
			class="my-1"
			:max="currentQuestionTimeLimit"
			:value="game.questionElapsedTime"
			inverted
		/>
	</section>
</template>
