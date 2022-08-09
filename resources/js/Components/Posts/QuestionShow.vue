<template>
	<div
		class="px-5 py-3 rounded border"
		:class="{
			'bg-gray-50 border-gray-200': !isCorrect.result,
			'bg-green-50 border-green-600/60': isCorrect.result,
		}"
	>
		<!-- Admin edition mode -->
		<div v-if="$page.props.auth.can.admin && editMode">
			<div
				v-show="showEditForm"
				class="grid grid-cols-1 gap-4 border-t bg-green-100 -mx-4 -mb-2 px-4 pb-2"
			>
				<form-input
					ref="questionBodyForm"
					v-model="form.body"
					label="question"
					name="body"
					@save="patchQuestion"
				/>
				<form-input
					v-model="form.answer"
					label="réponse"
					name="answer"
				/>

				<div class="flex items-end gap-4 w-full">
					<input
						v-model="form.math"
						type="checkbox"
					>

					<div class="grow">
						<form-input
							v-model="form.checker"
							label="Vérification"
							name="checker"
						/>
					</div>

					<div class="grow">
						<form-input
							v-model="form.keyboard"
							label="clavier"
							name="clavier"
						/>
					</div>

					<button
						class=" btn-add"
						@click="patchQuestion"
					>
						<i class="bi bi-arrow-clockwise" />
					</button>
				</div>
			</div>

			<div class="flex justify-end gap-3 mb-4">
				<button
					class="btn-xs btn-edit"
					@click="showEditForm=!showEditForm"
				>
					éditer <i class="bi bi-pencil" />
				</button>
				<button
					class="btn-xs btn-delete"
					@click="destroyQuestion"
				>
					supprimer <i class="bi bi-trash" />
				</button>
			</div>
		</div>

		<!-- the body of question -->
		<div>
			<div
				v-katex.auto.left="questionDisplay"
				class="md:col-span-2"
				@dblclick="toggleBlockEdition"
			/>

			<!-- Afficher les formulaires pour répondre à la question -->
			<div
				v-show="!isCorrect.result"
				ref="questionRef"
			>
				<!-- QCM -->
				<div
					v-if="answerDisplay.checker==='qcm'"
				>
					<div class="flex flex-wrap gap-4 w-full">
						<button
							v-for="(item, index) of answerDisplay.data"
							:key="`qcm-${index}`"
							:class="qcmButtonClass(item)"
							@click="userAnswer = item; validateAnswer()"
						>
							{{ item }}
						</button>
					</div>
				</div>
				<!-- Default question -->
				<div
					v-else
					class="max-w-md"
				>
					<button
						class="btn py-1 px-2 text-left w-full bg-white"
						@click="showKeyboard=!showKeyboard"
					>
						Donner la réponse: {{ userAnswer }}
					</button>
					<!--					<form-input-->
					<!--						v-model="userAnswer"-->
					<!--						:name="`question-${theQuestion.id}`"-->
					<!--						label="réponse"-->
					<!--						inline-->
					<!--						btn-class="btn-primary"-->
					<!--						@mousedown.prevent="answerInputClick"-->
					<!--						@keyup.enter="validateAnswer"-->
					<!--						@button-click="validateAnswer"-->
					<!--					>-->
					<!--						<div class="text-xs text-gray-600 flex justify-between mt-1">-->
					<!--							<p-->
					<!--								v-katex.auto="answerFormat"-->
					<!--							/>-->
					<!--						</div>-->

					<!--						&lt;!&ndash; Bouton valider - design à modifier &ndash;&gt;-->
					<!--						<template #button>-->
					<!--							OK-->
					<!--						</template>-->
					<!--					</form-input>-->

					<div
						v-if="theQuestion.keyboard"
						v-show="showKeyboard"
						class="flex flex-col"
					>
						<Keyboard
							v-model="userAnswer"
							v-model:tex="userAnswerAsTex"
							key-class="bg-white"
							validate
							class="mt-3"
							:keyboard="theQuestion.keyboard"
							@validate="validateAnswer"
						/>
						<button
							class="text-xs text-gray-600 mt-3 self-center"
							@click="showKeyboard=false"
						>
							<i class="bi bi-x-lg mr-3" />fermer le clavier / annuler
						</button>
					</div>
				</div>
			</div>

			<!-- Si la réponse est déjà donnée, afficher la réponse -->
			<div
				v-if="isCorrect.result"
				class="flex flex-col mt-6"
			>
				<div class="my-3 text-green-500 flex">
					<i class="bi bi-check mr-4" />
					<p>Vous avez déjà répondu à cette question {{ isCorrect.when }}</p>
				</div>
				<div class="flex ">
					<button
						class="cursor-pointer flex items-center gap-5"
						@click="showAnswer=!showAnswer"
					>
						<div>Réponse</div>
						<i
							v-if="!showAnswer"
							class="bi bi-eye"
						/>
						<div
							v-else
							v-katex.display.left.nomargin="questionAnswerDisplay"
						/>
					</button>
				</div>
			</div>
			<div v-else>
				<!-- Afficher les réponses précédentes -->
				<div
					v-if="previousAnswers.length>0"
					class="text-xs mt-6 border-t pt-1"
				>
					<div class="flex justify-between">
						<div v-if="previousAnswers.length>1">
							Réponses précédentes
						</div>
						<div v-else>
							Réponse précédente
						</div>
						<Link
							v-if="!$page.props.auth.user"
							:href="route('login')"
						>
							( se connecter pour mémoriser )
						</Link>
					</div>
					<ul class="flex flex-wrap gap-5">
						<li
							v-for="answer of previousAnswers"
							:key="answer.when"
							:class="{
								'text-green-600 font-bold':answer.result,
								'text-red-600':!answer.result,
							}"
						>
							{{ answer.answer }}
						</li>
					</ul>
				</div>

				<!-- Admin helper -->
				<div
					v-if="$page.props.auth.can.admin && editMode"
					class="text-xs text-gray-600 flex justify-between mt-10 admin-wrapper"
				>
					<div>Résultat attendu: {{ props.question.answer }}</div>
					<div>{{ answerChecker ? 'juste' : 'faux' }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import FormInput from "@/Components/Form/FormInput"
import {computed, inject, nextTick, onMounted, ref, watch} from "vue"
import {useForm} from "@inertiajs/inertia-vue3"
import Keyboard from "@/Components/Ui/Keyboard"
import katex from "katex/dist/katex.mjs"
import {keyboards} from "@/keyboards"

let props = defineProps({
	question: {type: Object, required: true}
})

let emits = defineEmits(["destroy", "resolved"])

let userAnswer = ref(""),
	userAnswerAsTex = ref(""),
	theQuestion = ref(props.question),
	showAnswer = ref(false),
	showKeyboard = ref(false)

let editMode = inject("editmode"),
	showEditForm = ref(false),
	questionBodyForm = ref(null)

let form = useForm({...props.question})

async function toggleBlockEdition() {
	if (editMode.value && !showEditForm.value) {
		showEditForm.value = true
		await nextTick()
		questionBodyForm.value.focus(true)
	}
}

let answerInputClick = function (ev) {
		if (theQuestion.value.keyboard) {
			// If there is a keyboard, display it and prevent focus
			showKeyboard.value = !showKeyboard.value
		} else {
			// No keyboard is given : focus the input
			ev.target.focus()
		}

	},
	questionDisplay = ref(""),
	answerDisplay = computed(() => {
		if (theQuestion.value.checker?.match(/qcm@(.+)/)) {
			return {
				checker: "qcm",
				data: theQuestion.value.checker.split("@")[1].split(",")
			}
		}
		return {
			checker: null,
			data: null
		}
	}),
	answerChecker = computed(() => {
		if (theQuestion.value.checker?.match(/%d\.[0-9]+/)) {
			return userAnswer.value.length === theQuestion.value.answer.length
				&&
				(+userAnswer.value).toFixed(+theQuestion.value.checker.split(".")[1]) === theQuestion.value.answer
		} else {
			return userAnswer.value.toString() === theQuestion.value.answer
		}
	}),
	answerFormat = computed(() => {
		if (theQuestion.value.checker?.match(/%d\.[0-9]+/)) {
			return `Réponse avec ${+theQuestion.value.checker.split(".")[1]} chiffre(s) après la virgule.`
		} else if (theQuestion.value.checker?.match(/^qcm@/)) {
			return ""
		}

		// La réponse est sous forme exacte: le texte dépend du clavier utilisé.
		if (theQuestion.value.keyboard === "exact") {
			return "Réponse sous forme exacte : \\(a+sqrtb/c = \\dfrac{a+\\sqrt{b}}{c}\\)"
		} else if (theQuestion.value.keyboard === "fraction") {
			return "Réponse sous forme de fraction réduite \\(a/b = \\dfrac{a}{b}\\)"
		}

		return ""
	}),
	previousAnswers = computed(() => {
		return theQuestion.value.userAnswers?.length === 0 ? [] : theQuestion.value.userAnswers
	}),
	isCorrect = computed(() => {
		if (theQuestion.value?.userAnswers.length > 0) {
			if (theQuestion.value.userAnswers[theQuestion.value.userAnswers.length - 1].result) {
				return theQuestion.value.userAnswers[theQuestion.value.userAnswers.length - 1]
			} else {
				return false
			}
		}
		return false
	}),
	qcmButtonClass = function (item) {
		if (isCorrect.value.result) {
			return "btn bg-white"
		}

		if (userAnswer.value === item) {
			return "btn-primary"
		}

		if (previousAnswers.value.filter(x => x.answer === item).length) {
			return "btn-error"
		}

		return "btn bg-white"
	},
	questionAnswerDisplay = computed(() => {
		if (theQuestion.value.keyboard) {
			const kbrd = keyboards[theQuestion.value.keyboard]

			if (kbrd) {
				return kbrd.tex(props.question.answer)
			}
		}

		return props.question.answer
	})

let formatQuestion = function () {
	let body = theQuestion.value.body,
		isMath = theQuestion.value.math,
		answer

	// Check if the answer is a correct tex value
	try {
		katex.renderToString(userAnswerAsTex.value)
		answer = userAnswerAsTex.value
	} catch {
		answer = "\\color{red}{\\text{ ??? }}"
	}

	// The question may contain answer place holder...
	if(body.includes("$")){
		// variables MUST be in this order.
		let vnames = "abcdefghijklmnopqrstuvwxyz"

		answer = answer.split(",").filter(x=>x!=="")
		for(let i=0; i<vnames.length; i++){
			const key = "$"+vnames[i]
			if(body.includes(key)){
				if(i<answer.length) {
					body = body.replaceAll(key, answer[i])
				}else{
					body = body.replaceAll(key, `\\textcolor{red}{\\ ${vnames[i]} \\ }`)
				}
			}
		}
	}

	if (isMath) {
		if (body[body.length - 1] === "=") {
			body += answer
		}
		body = `\\[${body}\\]`
	}

	questionDisplay.value = body
}

watch(userAnswerAsTex, () => {
	formatQuestion()
})

let questionRef = ref(null)
function validateAnswer() {
	const data = {
		answer: userAnswer.value,
		result: answerChecker.value
	}

	axios.post(route("questions.validate", [theQuestion.value.id]),
		data
	).then(res => {
		theQuestion.value.userAnswers.push({...res.data, "when": "à l'instant"})
		if (res.data.result) {
			emits("resolved", theQuestion)
			// Make sure the keyboard is now hidden
			showKeyboard.value = false
		} else {
			// Error !
			// TODO: Must move shake in a "useEffect" javascript file
			function shake(target) {
				target.style.setProperty("animation-name", "v-shake-horizontal")
				target.style.setProperty("animation-duration", "500ms")

				setTimeout(() => {
					target.style.setProperty("animation-name", "")
				}, 500)

			}

			shake(questionRef.value)
		}
	})
}

function patchQuestion(ev) {
	axios.post(
		route("questions.update", [theQuestion.value.id]),
		{
			_method: "patch",
			...form.data()
		}
	).then(res => {
		theQuestion.value = res.data.data
		showEditForm.value = false
	})
}

function destroyQuestion() {
	axios.post(
		route("questions.destroy", [theQuestion.value.id]),
		{
			_method: "delete"
		}
	).then(res => {
		emits("destroy", theQuestion.value.id)
	})
}

onMounted(() => {
	formatQuestion()
})
</script>
