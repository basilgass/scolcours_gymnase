<script lang="ts" setup>
// @ts-nocheck
import {ChallengeInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import GameLevelStars from "@/Components/Challenges/Game/GameLevelStars.vue"

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
	resetGame({lives: 0, remainingTime: 0})
	generate()
	beginGame()
	startQuestionTimer()
}

function end() {
	endGame()

	const delta = game.score - (score.value?.score ?? 0)

	score.value.score = Math.max(game.score, score.value?.score ?? 0)
	score.value.data.level = Math.max(game.level, score.value?.data?.level ?? 0)
	score.value.data.current_score = game.score
	score.value.data.current_level = game.level

	persistScore().then(() => {
		if (delta > 0) {
			flash.success(`Bravo, nouveau record : ${game.score} bonne${game.score > 1 ? 's' : ''} réponse${game.score > 1 ? 's' : ''} !`)
		} else {
			flash.info("Vous n'avez pas battu votre record... dommage !")
		}
	})
}

function validate(answer: questionResultInterface) {
	recordAnswer(answer)

	if (answer.result) {
		game.score++

		game.levelScore++
		const leveled = checkAndAdvanceLevel()
		if (!leveled) nextQuestion()

		startQuestionTimer()
	} else {
		end()
	}
}
 */
</script>

<template>
	<section class="p-3 max-w-[40em] mx-auto">
		<div class="text-6xl font-bold">
			{{ game.score }}
		</div>
		<div class="text-sm text-gray-400 mt-1">
			streak en cours
		</div>
		<div
			v-if="maxLevels > 1"
			class="flex justify-center gap-1 mt-2"
		>
			<game-level-stars
				:max-levels="maxLevels"
				:game-level="game.level"
				:game-level-score="game.levelScore"
				:next-level-after="currentLevel?.points_to_pass"
			/>
		</div>
	</section>
</template>
