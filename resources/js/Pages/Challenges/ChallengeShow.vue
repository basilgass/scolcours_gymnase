<!--suppress ALL -->
<script lang="ts">
	import LayoutMain from "@/Layouts/LayoutMain.vue"

	export default {
		layout: LayoutMain,
	}
</script>

<script setup lang="ts">
	import { ref, computed, inject, Ref } from "vue"
	import { PiMath } from "pimath/esm"
	import ChallengeIntro from "@/Components/Challenges/ChallengeIntro.vue"
	import ChallengeHeader from "@/Components/Challenges/ChallengeHeader.vue"
	import ChallengeResults from "@/Components/Challenges/ChallengeResults.vue"
	import { usePage } from "@inertiajs/vue3"
	import { useGenerator } from "@/Composables/useGenerator"
	import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
	import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
	import axios from "axios"
	import ChallengeExport from "@/Components/Challenges/ChallengeExport.vue"
	import { flashInterface } from "@/types"

	const emits = defineEmits(["destroy", "change"])
	const props = defineProps({
		challenge: { type: Object, required: true },
		component: { type: String, require: true },
		teams: { type: Object, required: true },
	})

	const flash = inject<flashInterface>("flash")

	let selector = ref(0),
		challengeDescription = computed(() => {
			return selector.value === 0
				? ""
				: challengeGenerators.value[selector.value - 1].body
		})

	let theChallenge = ref(props.challenge.data),
		challengeGenerators = ref(props.challenge.data.generators),
		challengeGeneratorError = ref(""),
		editMode = ref(false),
		questions = ref([]),
		currentGenerator = computed(() => {
			return challengeGenerators.value[level.value - 1]
		}),
		runChallengeGenerator = function () {
			if (currentGenerator.value !== "") {
				questions.value = useGenerator(currentGenerator).list(20)
			}
		}

	// Now, it's the game part.
	let listOfQuestions = ref([]),
		listOfAnswers = ref([]),
		isRunning = ref(false),
		isFinished = ref(false),
		isStopped = computed(() => !isRunning.value && !isFinished.value),
		questionId = ref(-1),
		answer = ref(""),
		maxTimeInMinutes = ref(theChallenge.value.duration),
		elapsedTime = ref(0),
		level = ref(1),
		levelScore = ref(0),
		score = ref(0),
		lives = ref(theChallenge.value.lives),
		death = ref(0),
		localScore = ref(
			localStorage.getItem("scolcoursChallenge-" + theChallenge.value.id),
		)

	if (challengeGenerators.value.length === 0) {
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

	let results = computed(() => {
		return {
			level: level.value,
			lives: lives.value,
			death: death.value,
			score: score.value,
			answers: listOfAnswers.value,
			time: remainingTime.value,
		}
	})

	if (localScore.value === null) {
		localScore.value = "0"
	}
	// UI reactive
	let ValidateButton = ref(null),
		questionUI = ref(null)

	let timerInterval: ReturnType<typeof setInterval> = null,
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
			elapsedTime.value = 0
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
				timerInterval = setInterval(() => {
					elapsedTime.value += timerIntervalSpeed.value / 1000 / 60

					if (elapsedTime.value > maxTimeInMinutes.value) {
						stopChallenge()
					}
				}, timerIntervalSpeed.value)
			}
		},
		stopChallenge = function () {
			isRunning.value = false
			isFinished.value = true

			// Stop the counter / timer
			clearInterval(timerInterval)
			timerInterval = null

			// Sauvegarde le score dans la session local
			if (isNaN(+localScore.value) || +localScore.value < score.value) {
				localStorage.setItem(
					"scolcoursChallenge-" + theChallenge.value.id,
					score.value.toString(),
				)
				localScore.value = (+score.value).toString()
			}

			// Sauvegarde le score dans la base de donnée
			storeScore(score.value, level.value)
		},
		cancelChallenge = function () {
			isRunning.value = false
			isFinished.value = false
		},
		timerWidth = computed(() => {
			return (elapsedTime.value / maxTimeInMinutes.value) * 100
		}),
		remainingTime = computed(() => {
			let remaining = Math.max(
				maxTimeInMinutes.value - elapsedTime.value,
				0,
			) // time remaining in minutes.

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
						maxTimeInMinutes.value +=
							theChallenge.value.bonusScoreTime
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
						maxTimeInMinutes.value +=
							theChallenge.value.bonusLevelTime
					}

					// Generate the new list of question
					questionId.value = 0
					runChallengeGenerator()
					listOfQuestions.value = PiMath.Random.shuffle(
						questions.value,
					)
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
				if (
					theChallenge.value.lives &&
					lives.value - death.value <= 0
				) {
					stopChallenge()
				}
			}
		}

	let theQuestion = computed(() => {
		return useGenerator(currentGenerator).question(
			listOfQuestions.value[questionId.value],
		)
	})

	const storeScore = function (value, level) {
		if (usePage().props.auth.user) {
			// TODO: Add stars system to challenge
			axios
				.post(route("scores.challenge", [theChallenge.value.id]), {
					score: value,
					level: level,
				})
				.then((res) => {
					if (res.data) {
						const delta =
							res.data.updated.score - res.data.previous.score
						if (delta > 0) {
							theChallenge.value.user.score = Math.max(
								theChallenge.value.user.score,
								res.data.updated.score,
							)
							theChallenge.value.user.stars = Math.max(
								theChallenge.value.user.stars,
								res.data.updated.stars,
							)
							theChallenge.value.user.level = Math.max(
								theChallenge.value.user.level,
								res.data.updated.level,
							)
							flash.success(
								`Bravo, vous avez amélioré votre score de ${delta} point${
									delta > 1 ? "s" : ""
								}`,
							)
						} else {
							flash.info(
								"Vous n'avez pas amélioré votre score... dommage !",
							)
						}
					}
				})
		}
	}
</script>
<template>
	<article class="bg-white border border-gray-200 rounded-b shadow p-5">
		<challenge-header :challenge="theChallenge" />

		<!-- Création du menu -->
		<div v-if="isStopped" class="my-10">
			<div class="flex flex-col md:flex-row flex-wrap gap-1 md:gap-5">
				<div
					:class="selector === 0 ? 'is-active' : 'text-gray-400'"
					class="px-3 md:px-10 py-1 md:py-5 rounded hover:shadow min-w-[150px] border-2 cursor-pointer transition-all"
					@click="selector = 0"
				>
					<div class="flex gap-3 items-center md:justify-center">
						<i class="bi bi-controller text-2xl"></i>
						<h2 class="text-lg">Challenge</h2>
					</div>
				</div>
				<div
					v-for="(gen, index) of theChallenge.generators"
					:key="`generator-selector-${gen.slug}`"
					:class="
						selector === index + 1 ? 'is-active' : 'text-gray-400'
					"
					class="px-3 py-1 md:py-5 rounded hover:shadow min-w-[150px] border cursor-pointer transition-all"
					@click="selector = index + 1"
				>
					<div class="flex gap-3 items-center md:justify-center">
						<i class="bi bi-calculator text-xl"></i>
						<h2 v-katex.auto="gen.title" class="text-lg" />
					</div>
				</div>
			</div>
		</div>

		<!-- création du menu -->
		<div v-if="isStopped">
			<div v-if="selector === 0">
				<challenge-intro
					:challenge="theChallenge"
					:teams="teams"
					class="mt-10"
					@start="startChallenge"
				/>
			</div>

			<div v-else>
				<challenge-training
					:key="`question-training-${selector}`"
					:challenge="theChallenge"
					:slug="theChallenge.generators[selector - 1].slug"
				/>
			</div>
		</div>
		<!-- le challenge est en cours -->
		<div v-if="isRunning && !isFinished">
			<div class="header-score flex justify-between">
				<div>Points {{ score }}</div>
				<div>Niveau {{ level }}</div>
				<div v-if="level < theChallenge.maxLevel">
					<!--					Prochain niveau:-->
					{{ theChallenge.nextLevelAfter - levelScore }} réponses
				</div>
				<div v-else>Niveau max</div>
			</div>
			<div v-if="theChallenge.duration" class="header-timer w-full h-3">
				<div
					:style="`width:${timerWidth}%;transition-timing-function:linear;transition-duration:${timerIntervalSpeed}ms`"
					class="bg-green-600 h-3 transition-all"
				/>
			</div>

			<div v-if="listOfQuestions[questionId]">
				<question-show
					:key="`level-${level}-question-${questionId}`"
					:question="theQuestion"
					class="max-w-[40em] mx-auto"
					dynamic
					show-input
					@validate="validateAnswer"
				/>
			</div>
		</div>

		<!-- résultat du challenge qui vient de se terminer -->
		<challenge-results
			v-if="isFinished"
			:challenge="theChallenge"
			:results="results"
			@cancel="cancelChallenge"
			@start="startChallenge"
		/>

		<challenge-export :challenge="theChallenge" />
	</article>
</template>
