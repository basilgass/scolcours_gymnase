<!--suppress ALL -->
<template>
	<article v-if="!editMode">
		<header>
			<!-- Header - return back -->
			<div class="pt-4 mb-4">
				<Link
					:href="route('theme.chapter', [$page.props.theme.slug, theChallenge.chapter.slug])"
					class="text-sm text-gray-400 hover:text-gray-800 transition-colors"
				>
					<i class="bi bi-chevron-left text-xs mr-2" />retour à {{ theChallenge.chapter.title }}
				</Link>
			</div>

			<!-- The title of the challenge -->
			<h1 class="text-2xl mb-4">
				{{ theChallenge.title }}
			</h1>

			<!-- the body / question of the challenge -->
			<markdown-it
				class="mt-3"
				:text="theChallenge.block.body"
			/>
		</header>

		<!-- Avant de lancer le challenge -->
		<div
			v-if="!isRunning && !isFinished"
			class="h-[40vh] grid place-items-center"
		>
			<div class="flex flex-col items-center gap-3">
				<div class="w-full space-y-2">
					<div class="flex justify-between w-full">
						<div>Nombre de vies</div>
						<div>{{ theChallenge.lives }}</div>
					</div>

					<div class="flex justify-between w-full">
						<div>Niveaux de diffcultés</div>
						<div>{{ theChallenge.maxLevel }}</div>
					</div>
					<div
						v-if="theChallenge.duration>0"
						class="flex justify-between w-full"
					>
						<div>Temps</div>
						<div>{{ theChallenge.duration }}</div>
					</div>
				</div>
				<button
					class="btn-success btn-xl hover:scale-110 transition-all"
					@click="startChallenge"
				>
					Commencer le challenge
				</button>
			</div>
		</div>
		<!-- le challenge est en cours -->
		<div v-if="isRunning && !isFinished">
			<div class="header-score flex justify-between">
				<div>Points {{ score }}</div>
				<div>Niveau {{ level }}</div>
				<div v-if="level<theChallenge.maxLevel">
					Prochain niveau: {{ theChallenge.nextLevelAfter - levelScore }} réponses
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
					class="bg-green-600 h-3 transition-all"
					:style="`width:${timerWidth}%;transition-timing-function:linear;transition-duration:${timerIntervalSpeed}ms`"
				/>
			</div>

			<!-- The question -->
			<QuestionItem
				v-if="listOfQuestions[questionId]"
				ref="questionUI"
				:answer="`${listOfQuestions[questionId].answer}`"
				:math="false"
				:block="{body: theChallenge.output.replace('question', listOfQuestions[questionId].question).replace('answer', '$a')}"
				:checker="theChallenge.checker"
				:keyboard="theChallenge.keyboard"
				:show-keyboard-output="false"
				@validate="validateAnswer"
			/>
		</div>

		<!-- résultat du challenge qui vient de se terminer -->
		<footer v-if="isFinished">
			<div class="grid grid-cols-3 gap-6">
				<div class="col-span-2 bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4">
					<div>Score</div>
					<div>{{ score }}</div>
				</div>

				<div class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4">
					<div>Meilleure score</div>
					<div> {{ localScore }} </div>
				</div>

				<div class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4">
					<div>Vie(s)</div>
					<div>{{ lives - death }}</div>
				</div>

				<div class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4">
					<div>Erreur(s)</div>
					<div>{{ death }}</div>
				</div>

				<div class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4">
					<div>Temps restant</div>
					<div>{{ remainingTime }}</div>
				</div>
			</div>

			<div class="min-h-[120px] grid place-items-center my-5">
				<button
					class="btn-success btn-xl hover:scale-110 transition-all"
					@click="startChallenge"
				>
					Recommencer
				</button>
			</div>


			<div class="mt-5 border-t">
				<div class="pt-5 mb-5 text-xl">
					réponses données
				</div>
				<div class="space-y-2">
					<div
						v-for="(item, index) of listOfAnswers"
						:key="`answer-${index}`"
						v-katex.auto="item.value"
						class="p-3 border"
						:class="item.result?'border-green-700 bg-green-600/30':'border-red-700 bg-red-600/30'"
					/>
				</div>
			</div>
		</footer>
	</article>

	<!-- Challenge admin mode -->
	<div
		v-if="$page.props.auth.can.admin"
		class="mt-10 admin-wrapper flex-col"
	>
		<h2
			class="cursor-pointer my-3 text-xl btn"
			@click="editMode=!editMode"
		>
			Modifier le challenge
		</h2>

		<div v-show="editMode">
			<div>
				<div>@keyboard=algebra,simple,polynom,fraction</div>
				<div>question,answer,level \n ...</div>
			</div>

			<h3 class="text-lg">
				Configuration du texte
			</h3>

			<form-input
				v-model="theChallenge.title"
				name="title"
				label="titre"
			/>
			<form-input
				v-model="theChallenge.slug"
				name="slug"
				label="url"
			/>

			<block-form
				v-model="theChallenge.block"
				no-title
				no-switch
				no-script
				no-data
				@save="updateChallenge"
			/>

			<div class="space-y-4">
				<div class="flex justify-between">
					<h3 class="text-lg">
						Configuration du challenge
					</h3>
					<button
						class="btn-primary"
						@click="updateChallenge"
					>
						Enregistrer
					</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<form-input
						v-model="theChallenge.output"
						name="questionsoutput"
						label="affichage de la question/réponse"
					/>

					<form-input
						v-model="theChallenge.checker"
						name="questionsChecker"
						label="checker"
					/>

					<form-input
						v-model="theChallenge.keyboard"
						name="questionsKeyboard"
						label="clavier affiché"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
					<form-number
						v-model="theChallenge.nextLevelAfter"
						name="questionsLevelTrigger"
						label="Prochain niveau après..."
					/>

					<form-number
						v-model="theChallenge.duration"
						name="questionsDuration"
						label="durée"
					/>

					<form-number
						v-model="theChallenge.lives"
						name="questionsLives"
						label="nombre de vie"
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<form-number
						v-model="theChallenge.bonusScoreLife"
						name="questionsBonuses1"
						label="Bonus de vie"
					/>
					<form-number
						v-model="theChallenge.bonusScoreTime"
						name="questionsBonuses2"
						label="Bonus de temps"
					/>
					<form-number
						v-model="theChallenge.bonusLevelLife"
						name="questionsBonuses3"
						label="Bonus de vie par niveau"
					/>
					<form-number
						v-model="theChallenge.bonusLevelTime"
						name="questionsBonuses4"
						label="Bonus de temps par niveau"
					/>
				</div>

				<h3 class="text-lg">
					Générateur (script)
				</h3>

				<div class="grid grid-cols-1 grid-cols-2 gap-3">
					<form-textarea
						v-model="challengeGenerator"
						name="questionsGenerator"
						label="générateur de questions"
						:rows="15"
						@keydown.tab.prevent="addTabCharacter"
					/>
					<div class="mt-8">
						<div
							class="font-code"
							v-text="questions"
						/>
						<div
							class="text-red-600"
							v-text="challengeGeneratorError"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, nextTick, reactive, ref, watch} from "vue"
import {provide} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import BlockForm from "@/Components/Posts/Blocks/BlockForm"
import Panel from "@/Components/Ui/Panel"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormNumber from "@/Components/Form/FormNumber"
import FormInput from "@/Components/Form/FormInput"
import {PiMath} from "pimath/esm"
import login from "@/Pages/Auth/Login"
import FormSwitch from "@/Components/Form/FormSwitch"
import {keyboards} from "@/keyboards"
import QuestionItem from "@/Components/Posts/Questions/QuestionItem"
import {checkersList} from "@/Composables/useCheckers"

const props = defineProps({
	"challenge": {type: Object, required: true},
	"component": {type: String, require: true}
})

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
function updateChallenge() {
	axios.post(
		route("challenges.update", [theChallenge.value.id]),
		{
			_method: "PATCH",
			...theChallenge.value,
			"generator": challengeGenerator.value
		}
	).then(res => {
	}).catch(res => {
		console.log(res.response.data.message)
	})
}

// Ui part
// Now, it's the game part.
let listOfQuestions = ref([]),
	listOfAnswers = ref([]),
	isRunning = ref(false),
	isFinished = ref(false),
	questionId = ref(0),
	answer = ref(""),
	maxTimeInMinutes = ref(theChallenge.value.duration),
	ellapsedTime = ref(0),
	level = ref(1),
	score = ref(0),
	levelScore = ref(0),
	lives = ref(theChallenge.value.lives),
	death = ref(0),
	localScore = ref(localStorage.getItem("scolcoursChallenge-"+theChallenge.value.id))

if(localScore.value===null){localScore.value = "0"}
// UI reactive
let ValidateButton = ref(null),
	questionUI = ref(null)

const timerInterval = ref(false),
	timerIntervalSpeed = ref(1000)
let startChallenge = function () {
		questionId.value = 0
		answer.value = ""
		maxTimeInMinutes.value = theChallenge.value.duration
		ellapsedTime.value = 0
		level.value = 1
		score.value = 0
		levelScore.value = 0
		lives.value = theChallenge.value.lives
		death.value = 0

		// Reset the lists
		runChallengeGenerator()
		listOfQuestions.value = PiMath.Random.shuffle(questions.value)
		listOfAnswers.value = []

		// Reset the keyboard
		if(questionUI.value && questionUI.value.keyboard) {
			questionUI.value.keyboard.resetKeyStrokes()
		}
		// Visibility
		isFinished.value = false
		isRunning.value = true

		// Start the counter / timer
		if(theChallenge.value.duration) {
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
		if(isNaN(localScore.value) || +localScore.value<score.value){
			localStorage.setItem("scolcoursChallenge-"+theChallenge.value.id, score.value)
			localScore.value = +score.value
		}
	},
	timerWidth = computed(()=>{
		return ellapsedTime.value / maxTimeInMinutes.value * 100
	}),
	remainingTime = computed(()=>{
		let remaining = maxTimeInMinutes.value - ellapsedTime.value // time remaining in minutes.

		const minutes = Math.trunc(remaining),
			seconds = Math.round((remaining - minutes)*60)

		return minutes>0? `${minutes}min${seconds}s`:`${seconds}s`
	}),

	validateAnswer = function (checkerResult) {
		// Store the answers
		listOfAnswers.value.push({
			value: checkerResult.question,
			result: checkerResult.result
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
				if(level.value<theChallenge.value.maxLevel) {
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
				listOfQuestions.value = [...listOfQuestions.value, PiMath.Random.shuffle(questions.value)]
				securityLoop--
				if (securityLoop === 0) {
					break
				}
			}

			if(questionUI.value && questionUI.value.keyboard) {
				questionUI.value.keyboard.resetKeyStrokes()
			}
		} else {
			// the answer is wrong

			// add one death
			death.value++
			// restart the level
			levelScore.value = 0

			// Stop the game
			if (theChallenge.value.lives && (lives.value - death.value <= 0)) {
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

</script>
