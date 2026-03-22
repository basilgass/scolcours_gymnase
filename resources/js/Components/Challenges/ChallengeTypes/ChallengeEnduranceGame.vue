<script lang="ts" setup>

import {useChallenge} from "@/Composables/useChallenge.ts"
import {ChallengeInterface, QuestionInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import {watch} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import GameScoreHeader from "@/Components/Challenges/Game/GameScoreHeader.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"

const props = defineProps<{ challenge: ChallengeInterface }>()
const emits = defineEmits<{ stateChange: [value: ChallengeGameState] }>()

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
		const leveled = checkAndAdvanceLevel()
		if (!leveled) nextQuestion()
		startQuestionTimer()
	} else {
		game.death++
		game.levelScore = 0
		if (props.challenge.lives && (game.lives - game.death <= 0)) end()
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
			class="mt-4"
			@start="start"
		/>

		<div v-if="state === 'running'">
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
			score-label="Score"
			:current-score-display="String(game.score)"
			best-score-label="Meilleur score"
			:best-score-display="`${Math.max(score?.score ?? 0, game.score)} / ${score?.score ?? 0}`"
			:show-lives-and-deaths="true"
			:show-timer="false"
			:extra-stats="[{label: 'Niveau atteint', value: game.level}]"
			@start="start"
			@cancel="state = 'intro'"
		/>
	</section>
</template>