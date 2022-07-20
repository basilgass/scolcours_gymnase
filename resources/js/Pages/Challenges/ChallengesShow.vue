<!--suppress ALL -->
<template>
	<article v-if="!editMode">
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
		<h1 class="text-xl">
			{{ theChallenge.title }}
		</h1>

		<!-- the body / question of the challenge -->
		<markdown-it
			class="mt-3"
			:text="theChallenge.block.body"
		/>

		<!-- The question -->
		<Panel class="mt-10">
			<div
				v-katex.auto="question"
			/>
		</Panel>
		<div
			class="mb-10 text-red-600"
			v-text="checkerResult.message"
		/>

		<!-- The keyboard and answer wrapper -->
		<div>
			<div
				v-katex.display="answer"
				class="min-h-[3em]"
			/>

			<div class="text-center pt-1 pb-5">
				<button
					ref="ValidateButton"
					class="btn btn-success w-64"
					@click="checkAnswer"
				>
					Valider
				</button>
			</div>
			<Keyboard
				ref="keyboardUI"
				v-model="answer"
				keyboard="algebra"
				class="max-w-xl mx-auto"
				@key="checkerResult.message = ''"
			/>
		</div>
	</article>

	<div
		v-if="$page.props.auth.can.admin"
		class="mt-10"
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
import {computed, reactive, ref, watch} from "vue"
import {provide} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import Keyboard from "@/Components/Ui/Keyboard"
import BlockForm from "@/Components/Posts/BlockForm"
import Panel from "@/Components/Ui/Panel"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormNumber from "@/Components/Form/FormNumber"
import FormInput from "@/Components/Form/FormInput"
import {PiMath} from "pimath/esm"
import login from "@/Pages/Auth/Login"
import FormSwitch from "@/Components/Form/FormSwitch"
import {useCheckers} from "@/Composables/useCheckers"

const props = defineProps({
	"challenge": {type: Object, required: true},
	"component": {type: String, require: true}
})

let theChallenge = ref(props.challenge.data),
	challengeGenerator = ref(props.challenge.data.generator),
	challengeGeneratorError = ref(""),
	editMode = ref(false),
	questions = ref([]),
	runChallengeGenerator = async function () {
		let crtLevel = 0
		try {
			crtLevel = level.value
		} catch {
			crtLevel = 0
		}

		if (challengeGenerator.value !== "") {
			questions.value = []
			let F = new Function("PiMath", "level", challengeGenerator.value)

			// TODO: Must make the generation and check for uniqueness.
			try {
				for (let i = 0; i < 10; i++) {
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


// Now, it's the game part.
let listOfQuestions = [],
	questionId = ref(0),
	answer = ref(""),
	level = ref(0),
	death = ref(0),
	checkerResult = ref({
		result: null,
		message: ""
	})
// UI reactive
let ValidateButton = ref(null),
	keyboardUI = ref(null)

let question = computed(() => {
	if(listOfQuestions.length===0 || listOfQuestions.length < questionId.value){
		listOfQuestions = PiMath.Random.shuffle(questions.value)
	}

	return theChallenge.value.output
		.replace("question", listOfQuestions[questionId.value].question)
		.replace("answer", answer.value)
})

const checker = useCheckers(theChallenge.value.checker)

let checkAnswer = function () {
	checkerResult.value = checker.check(listOfQuestions[questionId.value].answer, answer.value)
	
	// Validating the result if it's correct
	if (checkerResult.value.result) {
		// Go to next question
		questionId.value++

		// If we reached the next level trigger and there are more levels
		if (questionId.value >= theChallenge.value.nextLevelAfter) {
			// Next level
			level.value++
			// Restart the question id
			questionId.value = 0
			// Generate the new list of question
			listOfQuestions = PiMath.Random.shuffle(questions.value)
		}

		// Check if there is enough questions.
		let securityLoop = 100
		while (questionId.value >= listOfQuestions.length) {
			listOfQuestions = [...listOfQuestions, PiMath.Random.shuffle(questions.value)]
			securityLoop--
			if (securityLoop === 0) {
				break
			}
		}

		// Flash message to say it was correct.
		keyboardUI.value.resetKeyStrokes()
	} else {
		ValidateButton.value.style.setProperty("animation-name", "v-shake-horizontal")
		ValidateButton.value.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			ValidateButton.value.style.setProperty("animation-name", "")
		}, 500)
	}
}
</script>
