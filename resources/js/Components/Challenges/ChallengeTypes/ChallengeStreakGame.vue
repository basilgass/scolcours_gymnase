<script lang="ts" setup>

import {useChallenge} from "@/Composables/useChallenge.ts"
import {ChallengeInterface, QuestionInterface} from "@/types/modelInterfaces"
import {ChallengeGameState} from "@/types/challengeInterfaces.ts"
import {watch} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import GameLevelStars from "@/Components/Challenges/Game/GameLevelStars.vue"
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
</script>

<template>
	<section class="p-3 max-w-[40em] mx-auto">
		<challenge-intro
			v-if="state === 'intro'"
			:challenge
			:score="score"
			:max-levels="maxLevels"
			score-label="streak"
			class="mt-4"
			@start="start"
		/>

		<div
			v-if="state === 'running'"
			class="text-center py-2"
		>
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
			<question-show
				:key="`q-${game.level}-${answers.length}`"
				:question="currentQuestion as QuestionInterface"
				show-input
				class="mt-4"
				@validate="validate"
			/>
		</div>

		<challenge-results
			v-if="state === 'finished'"
			class="flex flex-col gap-2"
			:results="game"
			:answers
			:score
			score-label="Streak"
			:current-score-display="String(game.score)"
			best-score-label="Meilleur streak"
			:best-score-display="String(Math.max(score?.score ?? 0, game.score))"
			:show-lives-and-deaths="false"
			:show-timer="false"
			@start="start"
			@cancel="state = 'intro'"
		/>
	</section>
</template>