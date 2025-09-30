<script lang="ts" setup>

import ChallengeGameScore from "@/Components/Challenges/ChallengeGameScore.vue"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import StatBar from "@/Components/Ui/StatBar.vue"
import {useGenerator} from "@/Composables/useGenerator"
import {
	ChallengeGameState,
	ChallengeInterface,
	GeneratorInterface,
	QuestionDynamicInterface,
	QuestionInterface
} from "@/types/modelInterfaces"
import {computed, reactive, ref, watch} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterface.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()

const props = defineProps<{
	challenge: ChallengeInterface,
}>()


const state = ref<ChallengeGameState>("intro")
const game = reactive<ChallengeGameInterface>({
	score: 0,
	level: 0,
	levelScore: 0,
	lives: 10,
	death: 0,
	elapsedTime: 0,
	remainingTime: 0
})
const questionId = ref(0)
const questions = ref<QuestionDynamicInterface[]>([])
const answers = ref<ChallengeAnswerInterface[]>([])

const generator = computed<GeneratorInterface>(() => {
	if (props.challenge.generators.length === 0) return null
	return props.challenge.generators[Math.min(game.level - 1, props.challenge.generators.length - 1)]
})

const emits = defineEmits<{
	stateChange: [value: ChallengeGameState]
}>()


function generate() {
	// Generate a number of question
	questions.value = useGenerator(generator.value).list(20)
		.map(g => useGenerator(generator.value).question(g))
}

function reset() {
	game.score = 0
	game.level = 1
	game.levelScore = 0
	game.death = 0
	game.elapsedTime = 0
	game.remainingTime = props.challenge.duration * 60
	game.lives = props.challenge.lives
	game.death = 0
	questions.value = []
	questionId.value = 0
	answers.value = []
}

function start() {
	// Reset the game
	reset()

	// Generate the questions
	generate()

	// Start the game
	state.value = "running"

	// Interval -> move it to specific place !
	timerInterval = setInterval(() => {
		game.elapsedTime += timerIntervalSpeed.value / 1000
		if (game.elapsedTime > game.remainingTime) {
			stop()
		}
	}, timerIntervalSpeed.value)
}

/**
 * Stop the game. When finished:
 * state = 'finished'
 * store the user score to DB
 */
function stop() {
	// Stop the timer
	clearInterval(timerInterval)
	timerInterval = null

	// Store the new values
	store()

	// Change state
	state.value = 'finished'
}

/**
 * Store the user score to the database.
 * (if the user is logged in)
 */
const scoreStore = useStoreScore()
const score = await scoreStore.getScore<ScoreChallengeDataInterface>('Challenge', props.challenge.id)

function store() {
	// Résultat du challenge
	const delta = game.score - score.score

	// Mise à jour des scores globaux.
	score.score = Math.max(game.score, score.score)
	score.data.level = Math.max(game.level, score.data.level)

	// Mise à jour des scores courants
	score.data.current_score = game.score
	score.data.current_level = game.level
	scoreStore.updateScore(score)
		.then(() => {
			if (delta > 0) {
				flash.success(
					`Bravo, vous avez amélioré votre score de ${delta} point${
						delta > 1 ? "s" : ""
					}`
				)
			} else {
				flash.info(
					"Vous n'avez pas amélioré votre score... dommage !"
				)
			}
		})
}

/**
 * Validate the answer: success or fail
 * @param answer
 */
function validate(answer: questionResultInterface) {
	// store the answer
	const question = questions.value[questionId.value].block.body
		.replace("$a", answer.tex)

	answers.value.push({
		question,
		...answer
	})

	// Continue or stop the game
	if (answer.result) {
		successAnswer()
	} else {
		failedAnswer()
	}

}

/**
 * When the user has a correct answer, update the score and go to the next question.
 */
function successAnswer() {
	// Increase both score and levelScore
	game.score += game.level
	game.levelScore++

	// if the score reaches some bonuses...
	checkBonusScore()

	// Maybe we reached a new level ?
	checkLevel()

	// Go to the next question
	questionId.value++

	// Check if we have still enough question
	if (questionId.value >= questions.value.length) {
		generate()
		questionId.value = 0
	}
}

/**
 * When a new score is reached, the level can change
 * When it changes, it must:
 * - check for bonuses.
 * - generate a new list of questions.
 */
function checkLevel() {
	if (game.levelScore >= props.challenge.nextLevelAfter) {
		// Reset the score level
		game.levelScore = 0

		// Increase the level (if it can)
		if (game.level < props.challenge.maxLevel) game.level++

		// Trigger the new level bonuses
		checkBonusLevel()

		// The level has changed, so has the generator.
		questionId.value = 0
		questions.value = []

	}
}

/**
 * When the user reach a particular trigger score.
 * It can increase the number of lives
 * it can increase the remaining time.
 */
function checkBonusScore() {
	if (props.challenge.bonusScoreTrigger) {
		if (props.challenge.bonusScoreLife) {
			game.lives += props.challenge.bonusScoreLife
		}

		if (props.challenge.bonusScoreTime) {
			game.remainingTime += props.challenge.bonusScoreTime
		}
	}
}

/**
 * When the user go to a next level
 * it can increase the number of lives or remaining time.
 */
function checkBonusLevel() {
	if (props.challenge.bonusLevelTime) {
		game.remainingTime += props.challenge.bonusLevelTime
	}

	if (props.challenge.bonusLevelLife) {
		game.lives += props.challenge.bonusLevelLife
	}
}

/**
 * When the user fail, it can
 * stop the game if #death >= # lives
 */
function failedAnswer() {
	// Increase the number of error
	game.death++

	// Reset the actual level progression
	game.levelScore = 0

	// Stop the game if necessary
	if (props.challenge.lives && (game.lives - game.death <= 0)) {
		stop()
	}
}

/**
 * timer variable to store and interrupt the game.
 */
let timerInterval: ReturnType<typeof setInterval> = null,
	timerIntervalSpeed = ref(1000)


watch(state, () => {
	emits('stateChange', state.value)
})
</script>

<template>
	<section
		class="p-3 max-w-[40em] mx-auto"
	>
		<challenge-intro
			v-if="state==='intro'"
			:challenge
			:score
			class="mt-4"
			@start="start"
		/>

		<div v-if="state==='running'">
			<!-- score display and timer -->
			<ChallengeGameScore
				:challenge="challenge"
				:game="game"
			/>

			<stat-bar
				class="my-2"
				:max="game.remainingTime"
				:value="game.elapsedTime"
				inverted
				:bar-label="`${(game.remainingTime-game.elapsedTime)}s`"
				bar-label-class="text-gray-500"
			/>

			<!-- question display -->
			<question-show
				:key="`level-${game.level}-question-${questionId}`"
				:question="questions[questionId] as QuestionInterface"
				show-input
				@validate="validate"
			/>
		</div>

		<challenge-results
			v-if="state==='finished'"
			class="flex flex-col gap-2"
			:results="game"
			:answers
			:challenge
			:score
			@cancel="state='intro'"
			@start="start"
		/>
	</section>
</template>

