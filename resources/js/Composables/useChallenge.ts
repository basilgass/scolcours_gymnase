import {
	ChallengeGameState,
	ChallengeInterface,
	GeneratorInterface,
	QuestionDynamicInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import {computed, ComputedRef, reactive, ref, toRef} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"
import {Random} from "pimath"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterface.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"


export function useChallenge(challengeMaybeRef: ChallengeInterface | ComputedRef<ChallengeInterface>) {

	const flash = useStoreFlashMessage()

	const state = ref<ChallengeGameState>("intro")
	const challenge = toRef(challengeMaybeRef)
	const generators = toRef<GeneratorInterface[]>(challenge.value.generators)

	const game = reactive<ChallengeGameInterface>({
		score: 0,
		level: 0,
		levelScore: 0,
		lives: 10,
		death: 0,
		elapsedTime: 0,
		remainingTime: 0
	})
	const generatedId = ref(0)
	const generatedQuestions = ref<QuestionDynamicInterface[]>([])
	const currrentQuestion = computed(() => {
		return generatedQuestions.value[generatedId.value] ?? null
	})
	const answers = ref<ChallengeAnswerInterface[]>([])

	function gameReset() {
		game.score = 0
		game.level = 1
		game.levelScore = 0
		game.death = 0
		game.elapsedTime = 0
		game.remainingTime = challenge.value.duration * 60
		game.lives = challenge.value.lives
		game.death = 0

		generatedQuestions.value = []
		generatedId.value = 0
		answers.value = []
	}


	const levelGenerators = computed(() => getGenerators(game.level))

	function getGenerators(level: number) {
		const delta = challenge.value.generatorsGrouping
		const length = generators.value.length

		const totalGroups = Math.ceil(length / delta)

		// clamp du level
		const safeLevel = Math.min(level - 1, totalGroups)

		const start = safeLevel * delta
		const end = start + delta

		return generators.value.slice(start, end)
	}

	function updateLevel(): number {
		if (game.level >= maxLevels.value) return maxLevels.value

		if (game.levelScore >= challenge.value.nextLevelAfter) {
			// Reset the score level
			game.levelScore = 0

			// Increase the level
			game.level++

			// Trigger the new level bonuses
			checkBonusLevel()

			// The level has changed, so has the generator.
			generate()
		}
	}

	/**
	 * Informations calculées
	 */
	const maxLevels = computed(() => {
		if (!challenge.value.generatorsGrouping) return challenge.value.generators.length

		return Math.ceil(challenge.value.generators.length / challenge.value.generatorsGrouping)
	})

	/**
	 * Création des questions
	 * @param nb
	 */
	function generate(nb?: number): QuestionDynamicInterface[] {
		nb = nb === undefined || nb <= 0 ? 20 : nb

		generatedId.value = 0

		const questions: QuestionDynamicInterface[] = []
		levelGenerators.value.forEach(gen => {
			questions.push(...useGenerator(gen).list(nb))
		})

		generatedQuestions.value = levelGenerators.value.length > 1
			? Random.shuffle(questions)
			: questions

		// on mélange toutes les questions si nécessaires.
		return generatedQuestions.value
	}


	let timerInterval: ReturnType<typeof setInterval> = null,
		timerIntervalSpeed = ref(1000)

	function start() {
		// Reset the game
		gameReset()

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

	function stop() {
		// Stop the timer
		stopTimer()

		// Store the new values
		store()

		// Change state
		state.value = 'finished'
	}

	function stopTimer() {
		clearInterval(timerInterval)
		timerInterval = null
	}

	function validate(answer: questionResultInterface) {
		// store the answer
		const question = generatedQuestions.value[generatedId.value].block.body
			.replace("$a", answer.tex)

		answers.value.push({
			question,
			...answer
		})

		// Continue or stop the game
		if (answer.result) {
			_successAnswer()
		} else {
			_failedAnswer()
		}

	}

	function _successAnswer() {
		// Increase both score and levelScore
		game.score += game.level
		game.levelScore++

		// if the score reaches some bonuses...
		checkBonusScore()

		// Go to the next question
		generatedId.value++

		// Maybe we reached a new level ? this resets everything!
		updateLevel()

		// Check if we have still enough question
		if (generatedId.value >= levelGenerators.value.length) {
			generate()
		}
	}

	function _failedAnswer() {
		// Increase the number of error
		game.death++

		// Reset the actual level progression
		game.levelScore = 0

		// Stop the game if necessary
		if (challenge.value.lives && (game.lives - game.death <= 0)) {
			stop()
		}
	}

	// BONUS SCORES
	function checkBonusScore() {
		if (challenge.value.bonusScoreTrigger) {
			if (challenge.value.bonusScoreLife) {
				game.lives += challenge.value.bonusScoreLife
			}

			if (challenge.value.bonusScoreTime) {
				game.remainingTime += challenge.value.bonusScoreTime
			}
		}
	}

	function checkBonusLevel() {
		if (challenge.value.bonusLevelTime) {
			game.remainingTime += challenge.value.bonusLevelTime
		}

		if (challenge.value.bonusLevelLife) {
			game.lives += challenge.value.bonusLevelLife
		}
	}


	const scoreStore = useStoreScore()
	const score = ref<ScoreInterface<ScoreChallengeDataInterface>>()
	scoreStore
		.getScore<ScoreChallengeDataInterface>('Challenge', challenge.value.id)
		.then(sc => score.value = sc)

	function store() {
		// Résultat du challenge
		const delta = game.score - score.value.score
		const deltaLevel = game.level - score.value.data.level

		// Mise à jour des scores globaux.
		score.value.score = Math.max(game.score, score.value.score)
		score.value.data.level = Math.max(game.level, score.value.data.level)

		// Mise à jour des scores courants
		score.value.data.current_score = game.score
		score.value.data.current_level = game.level

		scoreStore.updateScore(score.value)
			.then(() => {
				if (delta > 0) {
					flash.success(
						`Bravo, vous avez amélioré votre score de ${delta} point${
							delta > 1 ? "s" : ""
						}`
					)
				} else if (deltaLevel > 0) {
					flash.success(
						`Bravo, vous avez amélioré votre niveau de ${deltaLevel} niveau${
							delta > 1 ? "x" : ""
						}`)
				} else {
					flash.info(
						"Vous n'avez pas amélioré votre score... dommage !"
					)
				}
			})
	}

	return {
		state,
		challenge,
		generators,
		maxLevels,
		generate,
		controls: {
			start,
			stop,
			stopTimer,
			reset: gameReset,
			validate
		},
		currrentQuestion,
		game,
		score,
		result: answers
	}

}
