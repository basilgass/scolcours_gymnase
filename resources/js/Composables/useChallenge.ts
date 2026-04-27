import {
	ChallengeGameState,
	ChallengeInterface,
	QuestionDynamicInterface,
	ScoreInterface
} from "@/types/modelInterfaces.ts"
import {computed, ComputedRef, onUnmounted, reactive, ref, toRef} from "vue"
import {useGenerator} from "@/Composables/useGenerator.ts"
import {Random} from "pimath"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterfaces.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

export interface IChallengeConfig {
	globalTimer: boolean,
	invertedTimer: boolean,
	questionTimer: boolean,
	lives: number
	remainingTime: number,
	scoreIncrement?: number,
	targetScore?: number,
	checkEndGame: () => boolean,
	updateScore: () => void,
	label: string,
	labelFormat: (value: number) => string,
	maxLevels: number
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


	const challengeConfig = computed<IChallengeConfig>(() => {
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

			if (delta > 0) {
				flash.success(`Bravo, vous avez amélioré votre score de ${delta} point${delta > 1 ? 's' : ''}`)
			} else if (deltaLevel > 0) {
				flash.success(`Bravo, vous avez amélioré votre niveau de ${deltaLevel} niveau${deltaLevel > 1 ? 'x' : ''}`)
			} else {
				flash.info("Vous n'avez pas amélioré votre score... dommage !")
			}
		}

		const cfg: IChallengeConfig = {
			lives: challenge.value.lives,
			maxLevels: challenge.value.levels.length,
			remainingTime: challenge.value.time_limit,
			globalTimer: true,
			invertedTimer: true,
			questionTimer: false,
			checkEndGame: defaultCheckEndGame,
			updateScore: defaultUpdateScore,
			label: 'score',
			labelFormat: (value: number) => String(value),
		}

		if (challenge.value.type === 'blitz') {
			cfg.questionTimer = true
			return cfg
		}

		if (challenge.value.type === 'chrono') {
			cfg.lives = 0
			cfg.remainingTime = 0
			cfg.invertedTimer = false

			cfg.targetScore = challenge.value.levels[challenge.value.levels.length - 1]?.points_to_pass ?? 10
			cfg.checkEndGame = () => false
			cfg.updateScore = () => {
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

			cfg.label = "temps"
			cfg.labelFormat = (value: number) => value > 0 ? `${Math.round(value)}s` : '—'

			return cfg
		}

		if (challenge.value.type === 'endurance') {
			cfg.remainingTime = 0
			cfg.globalTimer = false
			return cfg
		}

		if (challenge.value.type === 'precision') {
			cfg.remainingTime = 0
			cfg.checkEndGame = () => results.levelDeaths >= results.lives
			return cfg
		}

		if (challenge.value.type === 'streak') {
			cfg.lives = 0
			cfg.remainingTime = 0
			cfg.scoreIncrement = 1
			cfg.checkEndGame = () => true
		}

		return cfg
	})
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
			results.score += challengeConfig.value.scoreIncrement ? challengeConfig.value.scoreIncrement : results.level

			// is there a targetScore ?
			if (challengeConfig.value.targetScore && results.score >= challengeConfig.value.targetScore) {
				endGame()
				return
			}

			// increment level score and check if can be promoted to next level
			results.levelScore++
			const leveled = checkAndAdvanceLevel()
			if (!leveled) nextQuestion()

			if (challengeConfig.value.questionTimer) startQuestionTimer()
		} else {
			// on failure.
			results.death++
			results.levelDeaths++
			results.levelScore = 0

			// PRECISION: if (results.levelDeaths >= props.challenge.lives) end()
			// ENDURANCE: if (props.challenge.lives && (results.lives - results.death <= 0)) end()
			// CLASSIC  : if (props.challenge.lives && (results.lives - results.death <= 0)) end()
			// STREAK	: end()
			if (challengeConfig.value.checkEndGame()) endGame()
		}
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
		if (results.level >= challengeConfig.value.maxLevels) return false
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
			results.remainingTime = challengeConfig.value.remainingTime - results.elapsedTime

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
				validateQuestion({tex: " TIME ", result: false, answer: " TIME "}) // TODO: bes

				// Start next question
				nextQuestion()
				startQuestionTimer()

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
		results.lives = challengeConfig.value.lives
		results.remainingTime = challengeConfig.value.remainingTime

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
		if (challengeConfig.value.globalTimer) {
			startGlobalTimer(elapsed => {
				if (challengeConfig.value.remainingTime > 0) {
					if (elapsed >= challengeConfig.value.remainingTime) endGame()
				}
			})
		}

		if (challengeConfig.value.questionTimer) {
			startQuestionTimer()
		}

	}

	function endGame() {
		state.value = 'finished'

		// stop timers
		console.log('STOP TIMERS')
		stopGlobalTimer()
		stopQuestionTimer()

		// update score and display the result as flash message
		challengeConfig.value.updateScore()
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
				show: challengeConfig.value.globalTimer,
				start: startGlobalTimer,
				end: stopGlobalTimer,
			},
			question: {
				show: challengeConfig.value.questionTimer,
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
