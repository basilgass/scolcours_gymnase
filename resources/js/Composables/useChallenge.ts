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


export function useChallenge(challengeMaybeRef: ChallengeInterface | ComputedRef<ChallengeInterface>) {

	const state = ref<ChallengeGameState>("intro")
	const challenge = toRef(challengeMaybeRef)

	const game = reactive<ChallengeGameInterface>({
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

	// ─── Questions ────────────────────────────────────────────────────────────

	const generatedId = ref(0)
	const generatedQuestions = ref<QuestionDynamicInterface[]>([])
	const generatedTimeLimits = ref<(number | null)[]>([])
	const currentQuestion = computed(() => generatedQuestions.value[generatedId.value] ?? null)
	const answers = ref<ChallengeAnswerInterface[]>([])

	const currentLevel = computed(() =>
		challenge.value.levels[game.level - 1] ?? challenge.value.levels[0]
	)

	const levelGenerators = computed(() => currentLevel.value?.generators ?? [])

	const maxLevels = computed(() => challenge.value.levels.length)

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

	function nextQuestion() {
		generatedId.value++
		if (generatedId.value >= generatedQuestions.value.length) {
			generate()
		}
	}

	function recordAnswer(answer: questionResultInterface) {
		const question = generatedQuestions.value[generatedId.value].block.body
			.replace("$a", answer.tex)
		answers.value.push({question, ...answer})
	}

	// ─── Levels ───────────────────────────────────────────────────────────────

	/**
	 * Vérifie si le score du niveau courant atteint le seuil, et avance si oui.
	 * Retourne true si le niveau a avancé (generatedId est alors réinitialisé à 0 via generate()).
	 * Le callback onAdvanced permet à chaque type d'y injecter sa propre logique (ex: precision reset levelDeaths).
	 */
	function checkAndAdvanceLevel(onAdvanced?: () => void): boolean {
		if (game.level >= maxLevels.value) return false
		if (game.levelScore < currentLevel.value.points_to_pass) return false

		game.levelScore = 0
		game.level++
		checkBonusLevel()
		onAdvanced?.()
		generate()
		return true
	}

	function checkBonusLevel() {
		const bonus = currentLevel.value?.bonus
		if (!bonus) return
		if (bonus.time) game.remainingTime += bonus.time
		if (bonus.lives) game.lives += bonus.lives
	}

	// ─── Timers ───────────────────────────────────────────────────────────────

	const timerIntervalSpeed = 1000
	let globalTimerInterval: ReturnType<typeof setInterval> = null
	let questionTimerInterval: ReturnType<typeof setInterval> = null

	/**
	 * Démarre le timer global. Le callback onTick est appelé à chaque seconde avec
	 * le temps écoulé — le type peut y placer sa condition d'arrêt.
	 */
	function startGlobalTimer(onTick?: (elapsed: number) => void) {
		game.elapsedTime = 0
		globalTimerInterval = setInterval(() => {
			game.elapsedTime += timerIntervalSpeed / 1000
			onTick?.(game.elapsedTime)
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
	function startQuestionTimer(options?: { timeLimit?: number | null, onExpire?: () => void }) {
		stopQuestionTimer()
		game.questionElapsedTime = 0
		questionTimerInterval = setInterval(() => {
			game.questionElapsedTime += timerIntervalSpeed / 1000
			if (options?.timeLimit && game.questionElapsedTime >= options.timeLimit) {
				stopQuestionTimer()
				options.onExpire?.()
			}
		}, timerIntervalSpeed)
	}

	function stopQuestionTimer() {
		clearInterval(questionTimerInterval)
		questionTimerInterval = null
	}

	// ─── Game state ───────────────────────────────────────────────────────────

	function resetGame(options: { lives: number, remainingTime: number }) {
		game.score = 0
		game.level = 1
		game.levelScore = 0
		game.death = 0
		game.elapsedTime = 0
		game.streak = 0
		game.levelDeaths = 0
		game.questionElapsedTime = 0
		game.lives = options.lives
		game.remainingTime = options.remainingTime
		generatedQuestions.value = []
		generatedId.value = 0
		answers.value = []
	}

	function beginGame() {
		state.value = 'running'
	}

	function endGame() {
		stopGlobalTimer()
		stopQuestionTimer()
		state.value = 'finished'
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
		game,
		score,
		currentQuestion,
		answers,
		currentLevel,
		maxLevels,
		generatedTimeLimits,
		generatedId,
		generate,
		nextQuestion,
		checkAndAdvanceLevel,
		checkBonusLevel,
		recordAnswer,
		startGlobalTimer,
		stopGlobalTimer,
		startQuestionTimer,
		stopQuestionTimer,
		resetGame,
		beginGame,
		endGame,
		persistScore,
	}
}