import {
	ChallengeGameState,
	ChallengeInterface,
	QuestionDynamicInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import {computed, ComputedRef, onUnmounted, reactive, ref, toRef} from "vue"
import {answerIsWrong, useGenerator} from "@/Composables/useGenerator.ts"
import {Random} from "pimath"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterfaces.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

export interface IChallengeConfig {
	timers: {
		global: boolean,
		question: boolean,
		inverted: boolean,
		remainingTime: number,
	},
	description: {
		display: 'score' | 'elapsedTime',
		label: string,
		labelFormat: (value: number) => string,
		cards: { icon: string, label: string, value: number | string }[]
	},
	game: {
		lives: number,
		scoreIncrement?: number,
		targetScore?: number,
		maxLevels: number,
	}
	checkEndGame: () => boolean,
	updateScore: () => void,

}

export function useChallenge(challengeMaybeRef: ChallengeInterface | ComputedRef<ChallengeInterface>) {

	const flash = useStoreFlashMessage()

	const state = ref<ChallengeGameState>("intro")
	const challenge = toRef(challengeMaybeRef)

	const results = reactive<ChallengeGameInterface>({
		score: 0,
		level: 0,
		levelScore: 0,
		lives: 10,
		death: 0,
		elapsedTime: 0,
		remainingTime: 0,
		questionElapsedTime: 0,
		streak: 0,
		levelDeaths: 0,
	})


	// ─── Challenge configuration ────────────────────────────────────────────────────────────
	const defaultCheckEndGame = () => {
		return (results.lives - results.death) <= 0
	}

	const defaultUpdateScore = () => {
		const delta = results.score - (score.value?.score ?? 0)
		const deltaLevel = results.level - (score.value?.data?.level ?? 0)

		score.value.score = Math.max(results.score, score.value?.score ?? 0)
		score.value.data.level = Math.max(results.level, score.value?.data?.level ?? 0)
		score.value.data.current_score = results.score
		score.value.data.current_level = results.level

		persistScore().then(() => {
			if (delta > 0) {
				flash.success(`Bravo, vous avez amélioré votre score de ${delta} point${delta > 1 ? 's' : ''}`)
			} else if (deltaLevel > 0) {
				flash.success(`Bravo, vous avez amélioré votre niveau de ${deltaLevel} niveau${deltaLevel > 1 ? 'x' : ''}`)
			} else {
				flash.info("Vous n'avez pas amélioré votre score... dommage !")
			}
		})
	}

	const challengeConfig: IChallengeConfig = {
		timers: {
			global: true,
			inverted: true,
			question: false,
			remainingTime: challenge.value.time_limit,
		},
		description: {
			display: 'score',
			label: 'score',
			labelFormat: (value: number) => String(value),
			cards: [
				{label: 'vies', icon: 'bi bi-heart', value: challenge.value.lives},
				{label: 'durée (sec)', icon: 'bi bi-clock', value: challenge.value.time_limit},
			]
		},
		game: {
			lives: challenge.value.lives,
			maxLevels: challenge.value.levels.length,
		},
		checkEndGame: defaultCheckEndGame,
		updateScore: defaultUpdateScore,
	}
	if (challenge.value.type === 'blitz') {
		challengeConfig.timers.question = true
		challengeConfig.description.cards.push({
			label: 'par question', value: '?', icon: 'bi bi-stopwatch'
		})
	}
	if (challenge.value.type === 'chrono') {
		challengeConfig.description.display = 'elapsedTime'
		challengeConfig.game.lives = 0
		challengeConfig.timers.remainingTime = 0
		challengeConfig.timers.inverted = false

		challengeConfig.game.targetScore = 0
		challenge.value.levels.forEach((level, index) => {
			// [challenge.value.levels.length - 1]?.points_to_pass ?? 10
			challengeConfig.game.targetScore += (level.points_to_pass ?? 10) * (index + 1)
		})

		challengeConfig.checkEndGame = () => false
		challengeConfig.updateScore = () => {
			// REFACTOR : maybe automatically set the score.value.score to Infinity on creation ?
			const isFirst = (score.value?.score ?? 0) === 0
			const improved = isFirst || results.elapsedTime < (score.value?.score ?? Infinity)

			score.value.score = improved ? results.elapsedTime : score.value.score
			score.value.data.level = Math.max(results.level, score.value?.data?.level ?? 0)
			score.value.data.current_score = results.elapsedTime
			score.value.data.current_level = results.level

			persistScore().then(() => {
				if (improved) {
					flash.success(`Bravo, nouveau meilleur temps : ${Math.round(results.elapsedTime)}s`)
				} else {
					flash.info("Vous n'avez pas amélioré votre temps... dommage !")
				}
			})
		}

		challengeConfig.description.label = "temps"
		challengeConfig.description.labelFormat = (value: number) => value > 0 ? `${Math.round(value)}s` : '—'

		challengeConfig.description.cards = [
			{label: 'score cible', icon: 'bi bi-trophy', value: challengeConfig.game.targetScore}
		]
	}

	// ─── Questions ────────────────────────────────────────────────────────────

	const generatedId = ref(0)
	const generatedQuestions = ref<QuestionDynamicInterface[]>([])
	const generatedTimeLimits = ref<(number | null)[]>([])
	const currentQuestion = computed(() => generatedQuestions.value[generatedId.value] ?? null)
	const currentTimeLimit = computed(() => generatedTimeLimits.value[generatedId.value] ?? null)
	const answers = ref<ChallengeAnswerInterface[]>([])

	const currentLevel = computed(() =>
		challenge.value.levels[results.level - 1] ?? challenge.value.levels[0]
	)

	const levelGenerators = computed(() => currentLevel.value?.generators ?? [])

	function generate(nb?: number): QuestionDynamicInterface[] {
		nb = nb === undefined || nb <= 0 ? 20 : nb
		generatedId.value = 0

		const pairs: [QuestionDynamicInterface, number | null][] = []
		levelGenerators.value.forEach(gen => {
			const timeLimit = gen.config?.time_per_question ?? null
			useGenerator(gen).list(nb).forEach(q => {
				pairs.push([q, timeLimit])
			})
		})

		const shuffled = levelGenerators.value.length > 1
			? Random.shuffle(pairs)
			: pairs

		generatedQuestions.value = shuffled.map(([q]) => q)
		generatedTimeLimits.value = shuffled.map(([, t]) => t)

		return generatedQuestions.value
	}

	function validateQuestion(answer: questionResultInterface) {

		// BUG : recordAnswer only replace $a answers... but there may be more ! This is only used to show final answer.
		recordAnswer(answer) // uses only answer.tex, to replace body $a by it's response.

		if (answer.result) {
			// increment score
			results.score += challengeConfig.game.scoreIncrement
				? challengeConfig.game.scoreIncrement
				: results.level

			// is there a targetScore ?
			if (challengeConfig.game.targetScore && results.score >= challengeConfig.game.targetScore) {
				endGame()
				return
			}

			// increment level score and check if can be promoted to next level
			results.levelScore++
			const leveled = checkAndAdvanceLevel()
			if (!leveled) nextQuestion()

		} else {
			// on controle si l'erreur est un détail => donc ne pas pénaliser !
			if (answerIsWrong(answer)) {
				// on failure.
				results.death++
				results.levelDeaths++
				results.levelScore = 0
			}

			if (challengeConfig.checkEndGame()) {
				endGame()
				return	// stop le jeu - on ne recommence plus le timer des questions.
			}
		}

		if (challengeConfig.timers.question) startQuestionTimer()
	}

	function nextQuestion() {
		generatedId.value++
		if (generatedId.value >= generatedQuestions.value.length) {
			generate()
		}
	}

	function recordAnswer(answer: questionResultInterface) {
		const question = generatedQuestions.value[generatedId.value]
			.block.body
			.replace("$a", answer.tex)

		answers.value.push({question, ...answer})
	}

	// ─── Levels ───────────────────────────────────────────────────────────────

	/**
	 * Vérifie si le score du niveau courant atteint le seuil, et avance si oui.
	 * Retourne true si le niveau a avancé (generatedId est alors réinitialisé à 0 via generate()).
	 * Le callback onAdvanced permet à chaque type d'y injecter sa propre logique (ex: precision reset levelDeaths).
	 */
	function checkAndAdvanceLevel(): boolean {
		if (results.level >= challengeConfig.game.maxLevels) return false
		if (results.levelScore < currentLevel.value.points_to_pass) return false

		results.levelScore = 0
		results.levelDeaths = 0

		results.level++
		checkBonusLevel()

		generate()
		return true
	}

	function checkBonusLevel() {
		const bonus = currentLevel.value?.bonus
		if (!bonus) return
		if (bonus.time) results.remainingTime += bonus.time
		if (bonus.lives) results.lives += bonus.lives
	}

	// ─── Timers ───────────────────────────────────────────────────────────────

	const timerIntervalSpeed = 100
	let globalTimerInterval: ReturnType<typeof setInterval> = null
	let questionTimerInterval: ReturnType<typeof setInterval> = null

	/**
	 * Démarre le timer global. Le callback onTick est appelé à chaque seconde avec
	 * le temps écoulé — le type peut y placer sa condition d'arrêt.
	 */
	function startGlobalTimer(onTick?: (elapsed: number) => void) {

		results.elapsedTime = 0

		globalTimerInterval = setInterval(() => {
			results.elapsedTime += timerIntervalSpeed / 1000
			results.remainingTime = challengeConfig.timers.remainingTime - results.elapsedTime

			onTick?.(results.elapsedTime)
		}, timerIntervalSpeed)
	}

	function stopGlobalTimer() {
		clearInterval(globalTimerInterval)
		globalTimerInterval = null
	}

	/**
	 * Démarre le timer par question. Sans options = simple tracking du temps.
	 * Avec timeLimit + onExpire = countdown qui déclenche onExpire à l'échéance.
	 */
	function startQuestionTimer() {

		stopQuestionTimer()
		results.questionElapsedTime = 0

		// Get the time limit for the current question
		questionTimerInterval = setInterval(() => {
			if (state.value !== 'running') {
				stopQuestionTimer()
				return
			}

			results.questionElapsedTime += timerIntervalSpeed / 1000

			if (results.questionElapsedTime >= currentTimeLimit.value) {

				stopQuestionTimer()

				// Reset questionTimer
				results.questionElapsedTime = 0

				// On génère une erreur
				validateQuestion({tex: " TIME ", result: false, answer: " TIME ", validations: []})

				// Restart a new question.
				if (state.value === 'running') {
					// Start next question
					nextQuestion()
					startQuestionTimer()
				}

			}
		}, timerIntervalSpeed)
	}

	function stopQuestionTimer() {
		clearInterval(questionTimerInterval)
		questionTimerInterval = null
	}

	// ─── Game state ───────────────────────────────────────────────────────────

	function resetGame() {
		results.score = 0
		results.level = 1
		results.levelScore = 0
		results.death = 0
		results.elapsedTime = 0
		results.streak = 0
		results.levelDeaths = 0
		results.questionElapsedTime = 0
		results.lives = challengeConfig.game.lives
		results.remainingTime = challengeConfig.timers.remainingTime

		generatedQuestions.value = []
		generatedId.value = 0
		answers.value = []
	}

	function beginGame() {
		// Reset the results
		resetGame()

		// Generate the questions
		generate()

		// Change the state
		state.value = 'running'

		// start timers, depending on config.
		if (challengeConfig.timers.global) {
			startGlobalTimer(elapsed => {
				if (challengeConfig.timers.remainingTime > 0) {
					if (elapsed >= challengeConfig.timers.remainingTime) endGame()
				}
			})
		}

		if (challengeConfig.timers.question) {
			startQuestionTimer()
		}

	}

	function endGame() {
		state.value = 'finished'

		// stop timers
		stopGlobalTimer()
		stopQuestionTimer()

		// update score and display the result as flash message
		challengeConfig.updateScore()
	}

	// ─── Score persistence ────────────────────────────────────────────────────

	const scoreStore = useStoreScore()
	const score = ref<ScoreInterface<ScoreChallengeDataInterface>>()
	scoreStore
		.getScore<ScoreChallengeDataInterface>('Challenge', challenge.value.id)
		.then(sc => score.value = sc)

	/**
	 * Persiste score.value tel quel sur le serveur.
	 * Le type component est responsable de mettre à jour score.value avant d'appeler cette fonction.
	 */
	function persistScore() {
		return scoreStore.updateScore(score.value)
	}

	onUnmounted(() => {
		stopGlobalTimer()
		stopQuestionTimer()
	})

	return {
		state,
		challenge,
		controls: {
			start: beginGame,
			stop: endGame,
		},
		timers: {
			global: {
				show: challengeConfig.timers.global,
				start: startGlobalTimer,
				end: stopGlobalTimer,
			},
			question: {
				show: challengeConfig.timers.question,
				start: startQuestionTimer,
				end: stopQuestionTimer,
			}
		},
		current: {
			id: generatedId,
			question: currentQuestion,
			level: currentLevel,
			validate: validateQuestion,
			timeLimit: currentTimeLimit,
		},
		config: challengeConfig,
		store: {
			results,
			score,
			answers,
		}
	}
}
