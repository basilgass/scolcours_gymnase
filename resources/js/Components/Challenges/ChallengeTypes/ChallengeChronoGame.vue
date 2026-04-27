<script lang="ts" setup>
// @ts-nocheck
import {ChallengeInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"
import StatBar from "@/Components/Ui/StatBar.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
const emits = defineEmits<{ stateChange: [value: ChallengeGameState] }>()


/**
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

 */
</script>

<template>
	<section class="p-3 max-w-[40em] mx-auto">
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
	</section>
</template>
