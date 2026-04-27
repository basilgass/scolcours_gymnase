<script lang="ts" setup>
// @ts-nocheck
import {ChallengeInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
const emits = defineEmits<{ stateChange: [value: ChallengeGameState] }>()

/**
const flash = useStoreFlashMessage()

const {
	state, game, score, currentQuestion, answers,
	currentLevel, maxLevels,
	generate, nextQuestion, checkAndAdvanceLevel, recordAnswer,
	startQuestionTimer,
	resetGame, beginGame, endGame, persistScore,
} = useChallenge(props.challenge)

watch(state, v => emits('stateChange', v))

function start() {
	resetGame({lives: props.challenge.lives, remainingTime: 0})
	generate()
	beginGame()
	startQuestionTimer()
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

function validate(answer: questionResultInterface) {
	recordAnswer(answer)

	if (answer.result) {
		game.score += game.level

		game.levelScore++
		// Le callback remet levelDeaths à 0 à chaque passage de niveau (logique propre à precision)
		const leveled = checkAndAdvanceLevel(() => {
			game.levelDeaths = 0
		})
		if (!leveled) nextQuestion()

		startQuestionTimer()
	} else {
		game.death++
		game.levelDeaths++
		game.levelScore = 0
		if (game.levelDeaths >= props.challenge.lives) end()
	}
}
 */
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
	</section>
</template>
