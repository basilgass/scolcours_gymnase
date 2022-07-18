<!--suppress ALL -->
<template>
	<article>
		<!-- Header - return back -->
		<div class="pt-4 mb-4">
			<Link
				:href="route('theme.chapter', [$page.props.theme.slug, props.challenge.data.chapter.slug])"
				class="text-sm text-gray-400 hover:text-gray-800 transition-colors"
			>
				<i class="bi bi-chevron-left text-xs mr-2" />retour à {{ props.challenge.data.chapter.title }}
			</Link>
		</div>

		<!-- The title of the challenge -->
		<h1 class="text-xl">
			{{ props.challenge.data.title }}
		</h1>

		<!-- the body / question of the challenge -->
		<markdown-it
			class="mt-3"
			:text="theBlock.block"
		/>

		<!-- The question -->
		<Panel class="my-10">
			<div v-katex.auto="question" />
		</Panel>

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

			<div class="space-y-4">
				<h3 class="text-lg">
					Configuration
				</h3>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<form-input
						v-model="challengeJSON.checker"
						name="questionsChecker"
						label="checker"
						@input="updateJSON"
					/>

					<form-input
						v-model="challengeJSON.keyboard"
						name="questionsKeyboard"
						label="clavier affiché"
						@input="updateJSON"
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
					<form-number
						v-model="challengeJSON.nextLevelAfter"
						name="questionsLevelTrigger"
						label="Prochain niveau après..."
						@input="updateJSON"
					/>

					<form-number
						v-model="challengeJSON.duration"
						name="questionsDuration"
						label="durée"
						@input="updateJSON"
					/>

					<form-number
						v-model="challengeJSON.lives"
						name="questionsLives"
						label="nombre de vie"
						@input="updateJSON"
					/>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<form-number
						v-model="challengeJSON.bonuses.score.life"
						name="questionsBonuses1"
						label="Bonus de vie"
						@input="updateJSON"
					/>
					<form-number
						v-model="challengeJSON.bonuses.score.time"
						name="questionsBonuses2"
						label="Bonus de temps"
						@input="updateJSON"
					/>
					<form-number
						v-model="challengeJSON.bonuses.level.life"
						name="questionsBonuses3"
						label="Bonus de vie"
						@input="updateJSON"
					/>
					<form-number
						v-model="challengeJSON.bonuses.level.time"
						name="questionsBonuses4"
						label="Bonus de temps"
						@input="updateJSON"
					/>
				</div>



				<div @input="updateJSON">
					<div class="grid grid-cols-3 gap-3">
						<form
							v-for="(level, index) in questions"
							:key="`input-questions-${index}`"
						>
							<form-textarea
								v-model="questions[index]"
								:name="`questions${index}`"
								:label="`questions du ${index===0?'1er':(index)+'ème'} niveau`"
								:rows="20"
								@input="updateJSON_questions"
							/>
						</form>
					</div>

					<div>
						<button
							class="btn-primary"
							@click="questions.push('')"
						>
							Ajouter un niveau
						</button>
					</div>

					<block-form
						v-model="theBlock"
						no-switch
						@save="updateChallenge"
					/>
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
import {computed, reactive, ref} from "vue"
import {provide} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import Keyboard from "@/Components/Ui/Keyboard"
import BlockForm from "@/Components/Posts/BlockForm"
import Panel from "@/Components/Ui/Panel"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormNumber from "@/Components/Form/FormNumber"
import FormInput from "@/Components/Form/FormInput"
import {PiMath} from "pimath/esm"

const props = defineProps({
	"challenge": {type: Object, required: true},
	"component": {type: String, require: true}
})

let theBlock = reactive(props.challenge.data.block),
	editMode = ref(true),
	challengeJSON = reactive(JSON.parse(props.challenge.data.block.json)),
	questions = ref([""])

// prepare the questions.
if (challengeJSON.questions !== undefined) {
	questions.value = [...challengeJSON.questions
		.map(questionsPerLevel => questionsPerLevel
			.map(x => `${x.question},${x.answer}`).join("\n")
		)
	]
}
// Prepate the configurations values.
// TODO: this should be implemented in the model of the Challenge. This way, everything coming here is automatically correct.
if(challengeJSON.nextLevelAfter===undefined){
	challengeJSON.nextLevelAfter = 5
}
if(challengeJSON.checker === undefined){
	challengeJSON.checker = ""
}
if(challengeJSON.keyboard === undefined){
	challengeJSON.keyboard = "algebra"
}
if(challengeJSON.duration === undefined){
	challengeJSON.duration = 5
}
if(challengeJSON.lives === undefined){
	challengeJSON.lives = 3
}
if(challengeJSON.bonuses === undefined){
	challengeJSON.bonuses = {
		score: {
			life: 0,
			time: 0
		},
		level: {
			life: 0,
			time: 0
		}
	}
}

let updateChallenge = function () {

}

// Update the JSON values.
let updateJSON_questions = function () {
		challengeJSON.questions = [
			...questions.value
				.filter(questionPerLevel => questionPerLevel.length > 1)
				.map(questionPerLevel => questionPerLevel.split("\n").map(x => {
					const data = x.split(",")
					if (data.length !== 2) {
						return {question: x, answer: null}
					}

					return {question: data[0], answer: data[1]}
				}))
		]

		theBlock.json = JSON.stringify(challengeJSON)
	},
	updateJSON = function () {
		theBlock.json = JSON.stringify(challengeJSON)
	}

// Now, it's the game part.
let listOfQuestions = PiMath.Random.shuffle([...challengeJSON.questions[0]]),
	questionId = ref(0),
	answer = ref(""),
	level = ref(0),
	death = ref(0)
// UI reactive
let ValidateButton = ref(null),
	keyboardUI = ref(null)

let question = computed(()=>{
	return listOfQuestions[questionId.value].question
})
let checkAnswer = function (){
	let isCorrect = false

	// Checker
	if(listOfQuestions[questionId.value].answer === answer.value){
		isCorrect = true
	}

	// Validating the result if it's correct
	if(isCorrect){
		// Go to next question
		questionId.value++

		// If we reached the next level trigger and there are more levels
		if(questionId.value >= challengeJSON.nextLevelAfter && challengeJSON.questions.length<level.value-1){
			// Next level
			level.value++
			// Restart the question id
			questionId.value = 0
			// Generate the new list of question
			listOfQuestions = PiMath.Random.shuffle([...challengeJSON.questions[level.value]])
		}

		// Check if there is enough questions.
		let securityLoop = 100
		while(questionId.value >= listOfQuestions.length){
			listOfQuestions = [...listOfQuestions, PiMath.Random.shuffle([...challengeJSON.questions[level.value]])]
			securityLoop--
			if(securityLoop===0){break}
		}

		// Flash message to say it was correct.
		keyboardUI.value.resetKeyStrokes()
	}else{
		ValidateButton.value.style.setProperty("animation-name", "v-shake-horizontal")
		ValidateButton.value.style.setProperty("animation-duration", "500ms")

		setTimeout(() => {
			ValidateButton.value.style.setProperty("animation-name", "")
		}, 500)
	}
}
</script>
