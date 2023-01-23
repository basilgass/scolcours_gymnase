<!--suppress ALL -->
<template>
	<article>
		<challenge-header :challenge="theChallenge" />

		<!-- Avant de lancer le challenge -->
		<challenge-intro
			v-if="!isRunning && !isFinished"
			:challenge="theChallenge"
			@start="startChallenge"
		/>

		<!-- le challenge est en cours -->
		<div v-if="isRunning && !isFinished">
			<div class="header-score flex justify-between">
				<div>Points {{ score }}</div>
				<div>Niveau {{ level }}</div>
				<div v-if="level < theChallenge.maxLevel">
					<!--					Prochain niveau:-->
					{{ theChallenge.nextLevelAfter - levelScore }} réponses
				</div>
				<div v-else>
					Niveau max
				</div>
			</div>
			<div
				v-if="theChallenge.duration"
				class="header-timer w-full h-3"
			>
				<div
					:style="`width:${timerWidth}%;transition-timing-function:linear;transition-duration:${timerIntervalSpeed}ms`"
					class="bg-green-600 h-3 transition-all"
				/>
			</div>

			<div v-if="listOfQuestions[questionId]">
				<question-show
					:key="questionId"
					:question="theQuestion"
					class="max-w-[40em] mx-auto"
					display-input
					@validate="validateAnswer"
				/>
			</div>
		</div>

		<!-- résultat du challenge qui vient de se terminer -->
		<challenge-results
			v-if="isFinished"
			:challenge="theChallenge"
			:results="results"
		/>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain,
}
</script>
<script setup>

import {ref, watch, computed, onMounted, inject} from "vue"
import {PiMath} from "pimath/esm"
import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
import ChallengeHeader from "@/Components/Challenges/ChallengeHeader.vue"
import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {usePage} from "@inertiajs/inertia-vue3"

const emits = defineEmits(["destroy", "change"])
const props = defineProps({
	challenge: {type: Object, required: true},
	component: {type: String, require: true},
})

const flash = inject("flash")

let theChallenge = ref(props.challenge.data),
	challengeGenerator = ref(props.challenge.data.generator),
	challengeGeneratorError = ref(""),
	editMode = ref(false),
	questions = ref([]),
	runChallengeGenerator = function () {
		let crtLevel = 1
		try {
			crtLevel = level.value
		} catch {
			crtLevel = 1
		}

		if (challengeGenerator.value !== "") {
			questions.value = []
			let F = new Function("PiMath", "level", challengeGenerator.value)

			// TODO: Must make the generation and check for uniqueness.
			try {
				for (let i = 0; i < 20; i++) {
					questions.value.push(F(PiMath, crtLevel))
				}

				challengeGeneratorError.value = ""
			} catch (e) {
				challengeGeneratorError.value = e.message
			}
		}
	}
watch(challengeGenerator, (newValue, prevValue) => {
	runChallengeGenerator()
})

if (challengeGenerator.value === "") {
	// Edit mode as there is no generator actually.
	editMode.value = true
} else {
	runChallengeGenerator()
	if (questions.value.length === 0) {
		editMode.value = true
	}
}

// Admin - update challenge

// Ui part
// Now, it's the game part.
let listOfQuestions = ref([]),
	listOfAnswers = ref([]),
	isRunning = ref(false),
	isFinished = ref(false),
	questionId = ref(-1),
	answer = ref(""),
	maxTimeInMinutes = ref(theChallenge.value.duration),
	ellapsedTime = ref(0),
	level = ref(1),
	levelScore = ref(0),
	score = ref(0),
	lives = ref(theChallenge.value.lives),
	death = ref(0),
	localScore = ref(
		localStorage.getItem("scolcoursChallenge-" + theChallenge.value.id)
	)

let results = computed(() => {
	return {
		level: level.value,
		lives: lives.value,
		death: death.value,
		score: score.value,
		answers: listOfAnswers.value,
		time: remainingTime.value
	}
})


if (localScore.value === null) {
	localScore.value = "0"
}
// UI reactive
let ValidateButton = ref(null),
	questionUI = ref(null)

const timerInterval = ref(false),
	timerIntervalSpeed = ref(1000)
let startChallenge = function () {
		// Reset the lists
		runChallengeGenerator()
		listOfQuestions.value = PiMath.Random.shuffle(questions.value)
		listOfAnswers.value = []

		// init the game
		questionId.value = 0
		answer.value = ""
		maxTimeInMinutes.value = theChallenge.value.duration
		ellapsedTime.value = 0
		level.value = 1
		score.value = 0
		levelScore.value = 0
		lives.value = theChallenge.value.lives
		death.value = 0

		// Reset the keyboard
		if (questionUI.value && questionUI.value.keyboard) {
			questionUI.value.keyboard.resetKeyStrokes()
		}

		// Visibility
		isFinished.value = false
		isRunning.value = true

		// Start the counter / timer
		if (theChallenge.value.duration) {
			timerInterval.value = setInterval(() => {
				ellapsedTime.value += timerIntervalSpeed.value / 1000 / 60

				if (ellapsedTime.value > maxTimeInMinutes.value) {
					stopChallenge()
				}
			}, timerIntervalSpeed.value)
		}
	},
	stopChallenge = function () {
		isRunning.value = false
		isFinished.value = true

		// Stop the counter / timer
		clearInterval(timerInterval.value)
		timerInterval.value = false

		// Sauvegarde le score dans la session local
		if (isNaN(localScore.value) || +localScore.value < score.value) {
			localStorage.setItem(
				"scolcoursChallenge-" + theChallenge.value.id,
				score.value
			)
			localScore.value = +score.value
		}

		// Sauvegarde le score dans la base de donnée
		storeScore(score.value)
	},
	timerWidth = computed(() => {
		return (ellapsedTime.value / maxTimeInMinutes.value) * 100
	}),
	remainingTime = computed(() => {
		let remaining = Math.max(maxTimeInMinutes.value - ellapsedTime.value, 0) // time remaining in minutes.

		const minutes = Math.trunc(remaining),
			seconds = Math.round((remaining - minutes) * 60)

		return minutes > 0 ? `${minutes}min${seconds}s` : `${seconds}s`
	}),
	validateAnswer = function (checkerResult) {
		// Store the answers
		listOfAnswers.value.push({
			value: checkerResult.question,
			result: checkerResult.result,
		})

		if (checkerResult.result) {
			// Go to next question
			questionId.value++

			// Increase the score
			score.value += level.value

			// If we reached a particular score, add some bonuses
			if (theChallenge.value.bonuseScoreTrigger) {
				// TODO : must determine when it's working.
				if (theChallenge.value.bonusScoreLife) {
					lives.value += theChallenge.value.bonusScoreLife
				}
				if (theChallenge.value.bonusScoreTime) {
					maxTimeInMinutes.value += theChallenge.value.bonusScoreTime
				}
			}

			// Increate the counter for the current level
			levelScore.value++

			// If we reached the level trigger score, increase level.
			if (levelScore.value >= theChallenge.value.nextLevelAfter) {
				levelScore.value = 0
				if (level.value < theChallenge.value.maxLevel) {
					level.value++
				}

				if (theChallenge.value.bonusLevelLife) {
					lives.value += theChallenge.value.bonusLevelLife
				}
				if (theChallenge.value.bonusLevelTime) {
					maxTimeInMinutes.value += theChallenge.value.bonusLevelTime
				}

				// Generate the new list of question
				questionId.value = 0
				runChallengeGenerator()
				listOfQuestions.value = PiMath.Random.shuffle(questions.value)
			}

			// Check if there is enough questions.
			let securityLoop = 100
			while (questionId.value >= listOfQuestions.value.length) {
				listOfQuestions.value = [
					...listOfQuestions.value,
					PiMath.Random.shuffle(questions.value),
				]
				securityLoop--
				if (securityLoop === 0) {
					break
				}
			}

			if (questionUI.value && questionUI.value.keyboard) {
				questionUI.value.keyboard.resetKeyStrokes()
			}
		} else {
			// the answer is wrong

			// add one death
			death.value++
			// restart the level
			levelScore.value = 0

			// Stop the game
			if (theChallenge.value.lives && lives.value - death.value <= 0) {
				stopChallenge()
			}
		}
	}

// Testing function
async function addTabCharacter(ev) {
	let start = ev.target.selectionStart,
		end = ev.target.selectionEnd,
		text = challengeGenerator.value

	challengeGenerator.value = text.slice(0, start) + "\t" + text.slice(end)

	nextTick()
	ev.target.setSelectionRange(start, start)
}

let theQuestion = ref({})

watch(questionId, () => {
	const currentQuestion = listOfQuestions.value[questionId.value]

	console.log(theChallenge.value)

	theQuestion.value = {
		block: {
			body: theChallenge.value.output
				.replace(
					"question",
					currentQuestion.question
				)
				.replace("answer", "$a"),
			illustrations: [],
		},
		keyboard: currentQuestion.keyboard ? currentQuestion.keyboard.name : theChallenge.value.keyboard,
		parameters: currentQuestion.keyboard ? currentQuestion.keyboard.parameters : theChallenge.value.parameters || "",
		answer: "" + currentQuestion.answer,
		user: {
			correct: false,
		},
	}
})

const storeScore = function (value) {
	if (usePage().props.value.auth) {
		// TODO: Add stars system to challenge
		axios.post(route("scores.challenge", [theChallenge.value.id]), {
			"score": value
		}).then(res => {
			if (res.data) {
				const delta = res.data.updated.score - res.data.previous.score
				if (delta > 0) {
					flash.add(`Bravo, vous avez amélioré votre score de ${delta} point${delta > 1 ? "s" : ""}`)
				} else {
					flash.add("Vous n'avez pas amélioré votre score... dommage !", "info")
				}
			}
		})
	}
}

</script>
