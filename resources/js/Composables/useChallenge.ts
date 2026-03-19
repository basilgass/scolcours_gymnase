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


export function useChallenge(challengeMaybeRef: ChallengeInterface | ComputedRef<ChallengeInterface>) {

	const flash = useStoreFlashMessage()

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
	const generatedId = ref(0)
	const generatedQuestions = ref<QuestionDynamicInterface[]>([])
	const generatedTimeLimits = ref<(number | null)[]>([])
	const currrentQuestion = computed(() => {
		return generatedQuestions.value[generatedId.value] ?? null
	})
	const answers = ref<ChallengeAnswerInterface[]>([])

	const currentLevel = computed(() => {
		return challenge.value.levels[game.level - 1] ?? challenge.value.levels[0]
	})

	const levelGenerators = computed(() => currentLevel.value?.generators ?? [])

	const maxLevels = computed(() => challenge.value.levels.length)

	const targetScore = computed(() =>
		challenge.value.levels[challenge.value.levels.length - 1]?.points_to_pass ?? 10
	)

	function gameReset() {
		game.score = 0
		game.level = 1
		game.levelScore = 0
		game.death = 0
		game.elapsedTime = 0
		game.streak = 0
		game.levelDeaths = 0
		game.questionElapsedTime = 0
		game.lives = challenge.value.lives

		const type = challenge.value.type
		if (type === 'endurance') {
			game.remainingTime = Infinity
		} else if (type === 'chrono') {
			game.remainingTime = 0
		} else {
			game.remainingTime = challenge.value.time_limit * 60
		}

		generatedQuestions.value = []
		generatedId.value = 0
		answers.value = []
	}

	function updateLevel(): number {
		if (game.level >= maxLevels.value) return maxLevels.value

		if (game.levelScore >= currentLevel.value.points_to_pass) {
			game.levelScore = 0
			game.level++
			checkBonusLevel()

			if (challenge.value.type === 'precision') {
				game.levelDeaths = 0
			}

			generate()
		}
	}

	/**
	 * Création des questions avec tableau parallèle des limites de temps par question.
	 * Les deux tableaux (questions + timeLimits) sont toujours synchronisés.
	 */
	function generate(nb?: number): QuestionDynamicInterface[] {
		nb = nb === undefined || nb <= 0 ? 20 : nb

		generatedId.value = 0

		const pairs: Array<[QuestionDynamicInterface, number | null]> = []
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

	let timerInterval: ReturnType<typeof setInterval> = null
	let questionTimerInterval: ReturnType<typeof setInterval> = null

	const timerIntervalSpeed = 1000

	function start() {
		gameReset()
		generate()
		state.value = "running"
		startTimer()
		startQuestionTimer()
	}

	function stop() {
		stopTimer()
		stopQuestionTimer()
		store()
		state.value = 'finished'
	}

	function startTimer() {
		game.elapsedTime = 0
		const type = challenge.value.type

		if (type === 'endurance') {
			return
		}

		// Pas de timer si pas de limite de temps (streak/precision avec time_limit = 0)
		if (type !== 'chrono' && game.remainingTime <= 0) {
			return
		}

		timerInterval = setInterval(() => {
			game.elapsedTime += timerIntervalSpeed / 1000

			if (type !== 'chrono' && game.elapsedTime > game.remainingTime) {
				stop()
			}
		}, timerIntervalSpeed)
	}

	function stopTimer() {
		clearInterval(timerInterval)
		timerInterval = null
	}

	function startQuestionTimer() {
		if (questionTimerInterval) clearInterval(questionTimerInterval)
		game.questionElapsedTime = 0

		if (challenge.value.type !== 'blitz') {
			questionTimerInterval = setInterval(() => {
				game.questionElapsedTime += timerIntervalSpeed / 1000
			}, timerIntervalSpeed)
			return
		}

		// blitz : countdown par question — déclenche _failedAnswer() à 0
		const timeLimit = generatedTimeLimits.value[generatedId.value]
		if (timeLimit === null || timeLimit === undefined) {
			return
		}

		questionTimerInterval = setInterval(() => {
			game.questionElapsedTime += timerIntervalSpeed / 1000
			if (game.questionElapsedTime >= timeLimit) {
				stopQuestionTimer()
				_failedAnswer()
			}
		}, timerIntervalSpeed)
	}

	function stopQuestionTimer() {
		clearInterval(questionTimerInterval)
		questionTimerInterval = null
	}

	function validate(answer: questionResultInterface) {
		const question = generatedQuestions.value[generatedId.value].block.body
			.replace("$a", answer.tex)

		answers.value.push({
			question,
			...answer
		})

		if (answer.result) {
			_successAnswer()
		} else {
			_failedAnswer()
		}
	}

	function _successAnswer() {
		const type = challenge.value.type

		if (type === 'streak') {
			game.score++
		} else {
			game.score += game.level
		}
		game.levelScore++

		// Chrono : victoire dès que le score cible est atteint
		if (type === 'chrono' && game.score >= targetScore.value) {
			stop()
			return
		}

		generatedId.value++
		updateLevel()

		if (generatedId.value >= levelGenerators.value.length) {
			generate()
		}

		startQuestionTimer()
	}

	function _failedAnswer() {
		const type = challenge.value.type

		if (type === 'streak') {
			stop()
			return
		}

		if (type === 'precision') {
			game.death++
			game.levelDeaths++
			game.levelScore = 0
			if (game.levelDeaths >= challenge.value.lives) {
				stop()
			}
			return
		}

		game.death++
		game.levelScore = 0

		if (challenge.value.lives && (game.lives - game.death <= 0)) {
			stop()
		}
	}

	function checkBonusLevel() {
		const bonus = currentLevel.value?.bonus
		if (!bonus) return

		if (bonus.time) {
			game.remainingTime += bonus.time
		}

		if (bonus.lives) {
			game.lives += bonus.lives
		}
	}

	const scoreStore = useStoreScore()
	const score = ref<ScoreInterface<ScoreChallengeDataInterface>>()
	scoreStore
		.getScore<ScoreChallengeDataInterface>('Challenge', challenge.value.id)
		.then(sc => score.value = sc)

	function store() {
		const type = challenge.value.type

		// Chrono : meilleur temps = plus petit. On ne stocke que si objectif atteint.
		if (type === 'chrono') {
			if (game.score < targetScore.value) {
				flash.info("Objectif non atteint !")
				return
			}

			const isFirstScore = score.value.score === 0
			const bestTime = isFirstScore
				? game.elapsedTime
				: Math.min(game.elapsedTime, score.value.score)
			const improved = isFirstScore || game.elapsedTime < score.value.score

			score.value.score = bestTime
			score.value.data.level = Math.max(game.level, score.value.data.level)
			score.value.data.current_score = game.elapsedTime
			score.value.data.current_level = game.level

			scoreStore.updateScore(score.value)
				.then(() => {
					if (improved) {
						flash.success(`Bravo, nouveau meilleur temps : ${Math.round(game.elapsedTime)}s`)
					} else {
						flash.info("Vous n'avez pas amélioré votre temps... dommage !")
					}
				})
			return
		}

		const delta = game.score - score.value.score
		const deltaLevel = game.level - score.value.data.level

		score.value.score = Math.max(game.score, score.value.score)
		score.value.data.level = Math.max(game.level, score.value.data.level)

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

	onUnmounted(() => {
		stopTimer()
		stopQuestionTimer()
	})

	return {
		state,
		challenge,
		currentLevel,
		maxLevels,
		targetScore,
		generate,
		controls: {
			start,
			stop,
			reset: gameReset,
			validate
		},
		currrentQuestion,
		game,
		score,
		result: answers
	}

}
