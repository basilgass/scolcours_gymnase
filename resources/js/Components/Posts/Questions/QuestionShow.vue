<!--
Affichage d'une question
Envoi de la validation d'une réponse
keyboard -> QuestionUserInput -> QuestionShow
-->
<template>
	<article
		:id="`question-${theQuestion.id}`"
		:class="{
			'rounded border h-full': !props.isMinimal,
			'bg-gray-50 border-gray-200': !theQuestion.user.result && !props.isMinimal,
			'bg-green-50 border-green-600/60': theQuestion.user.result && !props.isMinimal,
		}"
	>
		<!-- Header -->
		<header class="flex flex-col relative">
			<!-- QUESTION NUMBER -->
			<div
				v-if="theQuestion.order && !props.isMinimal && !props.isDynamic"
				:class="{'draggable-handle cursor-move':$page.props.auth.can.admin}"
				class="absolute left-1 -top-4 rounded-full bg-white border w-8 h-8 text-xs flex justify-center items-center draggable-handle"
			>
				{{ theQuestion.order }}
			</div>

			<!-- ADMIN HEADER -->
			<div
				v-if="!props.isDynamic"
				v-show="editMode.enabled.value"
				v-admin
				class="flex justify-end w-full px-3 gap-3 py-2 bg-slate-600 text-white rounded-t"
			>
				<button
					class="text-xs font-code"
					title="editer"
					@click="showEditForm=true"
				>
					id: {{ theQuestion.id }} <i class="bi bi-pencil ml-2" />
				</button>

				<div
					class="cursor-pointer"
				>
					<dropdown-menu prevent-close>
						<template #button>
							<i class="bi bi-eye" /> {{ theQuestion.displayIf }}
						</template>

						<div
							v-for="q in props.groupeIds"
							:key="`display-if-${q}`"
							class="hover:bg-gray-100 px-3 py-2 font-code"
						>
							<div v-if="q===theQuestion.id">
								- question courante -
							</div>
							<div
								v-else
							>
								<label
									class="block"
								>
									<input
										type="checkbox"
										:checked="displayIfIds.includes(q)"
										@input="toggleDisplayId(q)"
									>
									{{ q }}</label>
							</div>
						</div>

						<template #footer>
							<button
								class="px-3 py-2"
								@click="toggleDisplayId(-1)"
							>
								toujours
							</button>
						</template>
					</dropdown-menu>
				</div>

				<button
					class="text-xs px-2"
					title="dupliquer"
					@click="duplicateQuestion"
				>
					<i class="bi bi-clipboard-plus" />
				</button>

				<button
					v-if="!theQuestion.block.illustration"
					class="text-xs px-2"
					title="ajouter une illustration"
					@click="addIllustration"
				>
					<i class="bi bi-image" />
				</button>
			</div>

			<!-- QUESTION TITLE -->
			<div
				v-if="!props.hideTitle"
				v-katex.auto="theQuestion.block.title"
				class="px-5 py-3 font-semibold text-lg"
			/>
		</header>

		<!-- the body of question -->
		<main class="px-5 overflow-x-auto mb-3">
			<!-- Illustration -->
			<illustration-show
				v-if="theQuestion.block.illustration"
				:illustration="theQuestion.block.illustration"
				class="bg-white"
			/>

			<!-- dispalyed text -->
			<markdown-it
				:text="theQuestionBody"
			/>
		</main>

		<!-- user input -->
		<div
			v-if="!showInput"
			class="text-xs px-5 text-right mb-3"
		>
			<button
				v-if="!showUserInput"
				:class="`active-scolcours-${$page.props.theme?.slug}`"
				class="w-full py-3 hover:border-t hover:border-b"
				@click="showUserInput=!showUserInput"
			>
				<i class="bi bi-calculator mr-2" />donner la réponse
			</button>
			<button
				v-else
				class="text-red-600"
				@click="showUserInput=!showUserInput"
			>
				fermer <i class="bi bi-x-lg ml-2" />
			</button>
		</div>
		<div
			v-show="showUserInput"
			class="question-user-input px-5"
		>
			<keyboard-validate-button
				ref="validateButton"
				:disabled="lockValidationButton"
				@validate="validateQuestion"
			/>
			<div v-if="userAnswersErrors.length>0 && !props.singleAnswer">
				<div
					v-for="(msg, index) in userAnswersErrors"
					:key="`error-${index}`"
					v-katex.auto="msg"
					class="text-red-600 text-xs"
				/>
			</div>

			<!-- Answer selector -->
			<div
				class="question-answer-selector flex justify-between items-center my-5"
			>
				<button
					:class="answerId===0?'invisible':`active-scolcours-${$page.props.theme?.slug}`"
					class="px-3 text-xl font-semibold border rounded-full"
					@click="answerId--"
				>
					<i class="bi-chevron-left" />
				</button>
				<div
					v-if="answerFormat"
					v-katex.auto="answerFormat"
					class="text-center text-xs text-gray-400"
				/>
				<button
					:class="answerId===answersNumber-1?'invisible':`active-scolcours-${$page.props.theme?.slug}`"
					class="px-3 text-xl font-semibold border rounded-full"
					@click="answerId++"
				>
					<i class="bi-chevron-right" />
				</button>
			</div>

			<component
				:is="theAnswers[answerId].keyboard.component"
				v-if="theAnswers[answerId] && theAnswers[answerId].keyboard.name!==''"
				:key="answerId"
				ref="keyboardUI"
				:answer="theAnswers[answerId].answer"
				:keyboard="theAnswers[answerId].keyboard"
				@change="updateQuestion"
				@validate="validateQuestion"
			/>
		</div>

		<!-- already answered or admin answer -->
		<div
			v-if="theQuestion.user.result || $page.props.auth.can.admin"
			class="question-footer mt-5 border-t border-gray-200 px-5 py-2"
		>
			<div>
				<button
					v-if="!showAnswer"
					class="text-xs text-gray-400 w-full"
					@click="loadAnswer()"
				>
					<i
						class="bi bi-eye mr-2"
					/>voir la réponse
				</button>
				<div
					v-else
					class="cursor-pointer overflow-x-auto scrollbar-scolcours"
					@click="loadAnswer(null)"
				>
					<div
						class="text-xs text-center ml-3 font-code font-xs"
						v-text="theQuestion.answer"
					/>
				</div>
			</div>
		</div>

		<!-- Edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:question="props.question"
				@change="updateQuestion"
				@destroy="emits('destroy', $event)"
				@validate="validateQuestion"
			/>
		</div>
	</article>
</template>

<script setup>
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {computed, defineAsyncComponent, inject, nextTick, reactive, ref} from "vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import {usePage} from "@inertiajs/vue3"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {useKeyboard} from "@/Composables/useKeyboard"
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"

let {getKeyboards} = useKeyboard()


// Props
let props = defineProps({
	question: {type: Object, required: true},
	hideTitle: {type: Boolean, default: false},
	showInput: {type: Boolean, default: false},
	isDynamic: {type: Boolean, default: false},
	isMinimal: {type: Boolean, default: false},
	singleAnswer: {type: Boolean, default: false},
	groupeIds: {type: Array, default: ()=>[]}
})

// flash message
const flash = inject("flash", null)

// Emits
const emits = defineEmits(["validate", "destroy", "duplicate"])

// Reactivity
let theQuestion = reactive(props.question), // la question principale, vraiment en "reactive" ?
	theQuestionBody = computed(() => {
		// On s'assure que le tableau des réponses est complet.
		checkUserAnswers()

		// On récupère le body original, avec les placeholder.
		let body = theQuestion.block.body,
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

		// $a, $b, ... sont des valeurs dans des environnements TeX
		// $A, $B, ... sont des valeurs hors des environnements Tex
		for (let i = 0; i < answersNumber.value; i++) {
			if (theAnswers.value[i] === undefined) {
				return "Aucun clavier n'a pu être généré..."
			}

			let key = theAnswers.value[i].key,
				rawColor = i === answerId.value ? "border-blue-600 bg-blue-100" : "border-red-600 bg-red-100",
				texColor = i === answerId.value ? "cornflowerblue" : "red"

			// S'il manque une valeur, on l'ajoute automatiquement à la fin.
			if (key === undefined) {
				key = `$${alphabet[i]}`
				body += "\n\n" + key
			}
			// On met une couleur pour chaque variable.
			// TODO: rajouter des couleurs en fonctions de la bonne réponse ou non ?
			// On supprime les clés sans mise en forme.
			body = body.replaceAll(
				"\n@" + key.toUpperCase(),
				"\n@" + key.toUpperCase() + "\n")
			body = body.replaceAll(
				"\n" + key.toUpperCase(),
				"\n" + key.toUpperCase() + "\n" + `{.border .px-3 .py-1 .${rawColor}}`)
			body = body.replaceAll(
				` ${key.toUpperCase()}`,
				` [${key.toUpperCase()}]{.inline-block .mx-1 .px-3 .py-1 .border .${rawColor} }`)
			body = body.replaceAll(
				key.toLowerCase(),
				`\\textcolor{${texColor}}{ ${key.toLowerCase()} }`)

			// on supprime les valeurs de type @$ qui sont sans mise en forme.
			body = body.replaceAll("@$", "$")

			// On peut avoir tex, raw, input
			if (userAnswers.value[i].value === undefined) {
				body = body.replaceAll(key.toUpperCase(), "< ?? >")
				body = body.replaceAll(key.toLowerCase(), "<\\ ? >")
			} else {

				// Raw output
				if (userAnswers.value[i].value.raw === undefined || userAnswers.value[i].value.raw === "") {
					body = body.replaceAll(key.toUpperCase(), "< ?? >")
				} else {
					body = body.replaceAll(key.toUpperCase(), userAnswers.value[i].value.raw)
				}

				// TeX output
				if (userAnswers.value[i].value.tex === undefined || userAnswers.value[i].value.tex === "") {
					body = body.replaceAll(key.toLowerCase(), "<\\ ? >")
				} else {
					body = body.replaceAll(key.toLowerCase(), userAnswers.value[i].value.tex)
				}
			}
		}
		return body
	})

// Gestion des réponses

// numéro de la question en cours d'édition
let answerId = ref(0),
	// Format de la réponse
	answerFormat = computed(() => {
		if(!theAnswers.value[answerId.value]){return ""}

		let kbrd = theAnswers.value[answerId.value].keyboard

		if (kbrd.name === "Basic") {
			return theAnswers.value[answerId.value].keyboard.checker.format()
		}

		return ""
	}),
	// Nombre de réponses totales
	answersNumber = computed(() => theQuestion.answer.split("\n").filter(x => x !== "").length),
	// liste des lettres, dans l'ordre.
	answersKeys = computed(() => {
		return "abcdefghijklmnopqrstuvwxyz"
			.split("")
			.map(x => `$${x}`)
	}),
	// liste des réponses / claviers / etc...
	theAnswers = computed(() => {
		// The keyboard is wrong...
		if (!theQuestion.keyboard) {
			return []
		}

		// Get the keyboards
		let arr = [],
			answers = theQuestion.answer.split("\n"),
			kbrds = getKeyboards(theQuestion.keyboard)

		for (let i = 0; i < answersNumber.value; i++) {
			arr.push({
				key: answersKeys.value[i],	// may be undefined !
				keyboard: kbrds[Math.min(kbrds.length - 1, i)],
				answer: answers[i]
			})
		}

		return arr
	}),
	userAnswers = ref([]),
	userAnswersErrors = ref([]),
	keyboardUI = ref(null),
	showAnswer = ref(false),
	loadAnswer = async function (value) {
		answerId.value = 0
		await nextTick()

		let timer = setInterval(() => {
			if (keyboardUI.value) {
				keyboardUI.value.loadAnswer(value)
			}

			if (answerId.value === answersNumber.value - 1) {
				clearInterval(timer)
				if (value === null) {
					answerId.value = 0
				}
			} else {
				answerId.value++
			}
		}, 100)

		showAnswer.value = value === undefined
	},
	showUserInput = ref(props.showInput)


let updateQuestion = function (event) {
		// {
		// 		value: {input, tex, raw},
		// 		validation: {result, message}
		// }
		userAnswers.value[answerId.value] = event
	},
	checkUserAnswers = function () {
		// On contrôle que la table des réponses est correctement initialisée
		if (userAnswers.value.length < answersNumber.value) {
			for (let i = userAnswers.value.length; i < answersNumber.value; i++) {
				userAnswers.value.push({
					value: {input: "", tex: "", raw: ""},
					validation: {result: false, message: "réponse non donnée."}
				})
			}
		}
	},
	validateButton = ref(null),
	lockValidationButton = ref(false),
	validateQuestion = function () {
		// validation des réponses.

		// On bloque la possibitié de cliquer une nouvelle fois sur le bouton.
		lockValidationButton.value = true

		// On vérifie que toutes les réponses ont été données.
		let result = true,
			stack = []

		for (let i = 0; i < userAnswers.value.length; i++) {
			result = result && userAnswers.value[i].validation.result

			if (!result) {
				if (userAnswers.value.length > 1) {
					stack.push(`${i + 1}: ${userAnswers.value[i].validation.message}`)
				} else {
					stack.push(userAnswers.value[i].validation.message)
				}
			}
		}

		userAnswersErrors.value = stack

		storeValidation({
			result,
			question: theQuestionBody.value,
			answer: userAnswers.value.map(a => a.value.input).join(",")
		})
		// setTimeout(() => lockValidationButton.value = false, 500)

	},
	storeValidation = function (event) {
		// event: {question: string, answer: string, result: boolean}
		if (!props.singleAnswer && !event.result) {
			useWrongAnswerAnimation(validateButton.value.$el)
		}

		// It's a dynamic question (without id)
		// On ne peut donc pas sauvegarder les informations.
		if (props.question.id === undefined) {
			emits("validate", event)
			lockValidationButton.value = false
			return
		}

		// On définit les informations utilisateurs.
		theQuestion.user.result = event.result

		// need answer (string: min1) , result (boolean)
		// Save the information to the database if the user is logged in
		// and if the result is correct
		if (usePage().props.auth.user) {
			axios.post(route("questions.validate", [props.question.id]), {
				...event
			})
				.catch((res) => {
					console.log("Il y a une erreur lors du chargement de la réponse.")
					console.log(res.response.data.message)
				})
				.then(res => {
					emits("validate", event)
				})
				.finally(()=>{
					lockValidationButton.value = false
				})
		} else {
			emits("validate", event)
			lockValidationButton.value = false
		}
	}

// Gestion administrateur
let editMode = inject("editMode", false),
	showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Questions/QuestionForm")
		)
	}),
	duplicateQuestion = function () {
		axios.post(route("questions.duplicate", [theQuestion.id]))
			.then((res) => {
				emits("duplicate", res.data.data)
				flash.success("la question a bien été dupliquée !")
			})
	},
	addIllustration = function () {
		if (theQuestion.block.illustration) {
			console.log("Il y a déjà une illustration", theQuestion.id)
		} else {
			// Create a new illustration
			axios.post(route("blocks.illustrations.store", [theQuestion.block.id]), {})
				.then(res => {
					res.data.isNew = true
					theQuestion.block.illustration = res.data

					flash.success("une nouvelle illustration a été créée")
				})
		}
	}


// Manage "DisplayIf"
let displayIfIds = computed(()=>{
		if(theQuestion.displayIf===null){return []}
		return theQuestion.displayIf.split(",").map(id=>+id)
	}),
	toggleDisplayId = async function(id){
		if(id===-1){
			theQuestion.displayIf = null
		}else {
			nextTick()
			let ids = [...displayIfIds.value],
				idx = ids.indexOf(id)

			if (idx === -1) {
				ids.push(id)
				ids.sort()
			} else {
				ids.splice(idx, 1)
			}

			theQuestion.displayIf = ids.length === 0 ? null : ids.join(",")
		}

		axios.post(route("questions.updateDisplayIf", {question: theQuestion.id}), {
			_method: "PATCH",
			displayIf: theQuestion.displayIf,
		}).then(res => {
			flash.success("Modification de la condition d'apparition réussi")
		}).catch(res => {
			flash.error("Modification de la condition échouée.")
		})
	}

</script>
