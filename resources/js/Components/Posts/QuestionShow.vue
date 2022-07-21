<template>
	<div class="py-3">
		<!-- Admin edition mode -->
		<div v-if="$page.props.auth.can.admin && editMode">
			<div
				v-show="showEditForm"
				class="grid grid-cols-1 md:grid-cols-4 gap-4 border-t bg-green-100 -mx-4 -mb-2 px-4 pb-2"
			>
				<div class="md:col-span-2">
					<form-input
						ref="questionBodyForm"
						v-model="form.body"
						label="question"
						name="body"
						@save="patchQuestion"
					/>
				</div>
				<form-input
					v-model="form.answer"
					label="réponse"
					name="answer"
				/>
				<div class="flex items-end gap-4">
					<form-input
						v-model="form.checker"
						label="Vérification"
						name="checker"
					/>

					<form-input
						v-model="form.keyboard"
						label="clavier"
						name="clavier"
					/>

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
		<div class="grid grid-cols-1 md:grid-cols-3">
			<!-- the body of question -->
			<div
				v-katex.auto="theQuestion.body"
				class="md:col-span-2"
				@dblclick="toggleBlockEdition"
			/>

			<!-- Answer form - only available if the user is connected -->
			<div class="self-end">
				<!-- Si la réponse est déjà donnée, afficher la réponse -->
				<div
					v-if="isCorrect.result"
					class="flex flex-col"
				>
					<div class="flex ">
						<button
							class="cursor-pointer flex gap-5"
							@click="showAnswer=!showAnswer"
						>
							<div>Réponse</div>
							<i
								v-if="!showAnswer"
								class="bi bi-eye"
							/>
							<div
								v-else
								v-text="props.question.answer"
							/>
						</button>
					</div>
					<div class="my-3 text-green-500 flex">
						<i class="bi bi-check mr-4" />
						<p>Vous avez déjà répondu à cette question {{ isCorrect.when }}</p>
					</div>
				</div>
				<!-- Afficher les formulaires pour répondre à la question -->
				<div v-else>
					<!-- QCM -->
					<div
						v-if="answerDisplay.checker==='qcm'"
					>
						<div class="flex gap-4 w-full">
							<button
								v-for="(item, index) of answerDisplay.data"
								:key="`qcm-${index}`"
								class="grow"
								:class="{
									'btn-primary': item===userAnswer,
									'btn bg-white': item!==userAnswer
								}"
								@click="userAnswer = item"
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
						<form-input
							v-model="userAnswer"
							:name="`question-${theQuestion.id}`"
							label="réponse"
							inline
							btn-class="btn-primary"
							@keyup.enter="validateAnswer"
							@button-click="validateAnswer"
						>
							<div class="text-xs text-gray-600 flex justify-between mt-1">
								<p
									v-katex.auto="answerFormat"
								/>
							</div>

							<!-- Bouton valider - design à modifier -->
							<template #button>
								OK
							</template>
						</form-input>
					</div>

					<!-- Admin helper -->
					<div
						v-if="$page.props.auth.can.admin"
						class="text-xs text-gray-600 flex justify-between mt-1"
					>
						<div>Résultat attendu: {{ props.question.answer }}</div>
						<div>{{ answerChecker ? 'juste' : 'faux' }}</div>
					</div>

					<!-- Afficher les réponses précédentes -->
					<div
						v-if="previousAnswers.length>0"
						class="text-xs"
					>
						<div class="flex justify-between">
							<div>Réponses précédantes</div>
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

					<button
						class="w-full text-xs text-left hover:ml-3 transition-all"
						@click="showKeyboard=!showKeyboard"
					>
						<i class="text-lg bi bi-keyboard mr-3" /> Afficher le clavier
					</button>
				</div>
			</div>
		</div>

		<!-- Show keyboard -->
		<div
			v-show="showKeyboard"
			class="flex justify-end"
		>
			<Keyboard
				v-model="userAnswer"
				class="min-w-[33.33%]"
				:keyboard="theQuestion.keyboard"
			/>
		</div>
	</div>
</template>

<script setup>
import FormInput from "@/Components/Form/FormInput"
import {computed, inject, nextTick, ref} from "vue"
import {useForm} from "@inertiajs/inertia-vue3"
import Keyboard from "@/Components/Ui/Keyboard"

let props = defineProps({
	question: {type: Object, required: true}
})

let emits = defineEmits(["destroy", "resolved"])

let userAnswer = ref(""),
	theQuestion = ref(props.question),
	showAnswer = ref(false),
	showKeyboard = ref(false)

let editMode = inject("editmode"),
	showEditForm = ref(false),
	questionBodyForm = ref(null)

let form = useForm({...props.question})

async function  toggleBlockEdition(){
	if(editMode.value && !showEditForm.value){
		showEditForm.value = true
		await nextTick()
		questionBodyForm.value.focus(true)
	}
}

let answerDisplay = computed(()=>{
		if(theQuestion.value.checker?.match(/qcm@(.+)/)){
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
	answerChecker = computed(()=>{
		if(theQuestion.value.checker?.match(/%d\.[0-9]+/)){
			return userAnswer.value.length===theQuestion.value.answer.length
				&&
				(+userAnswer.value).toFixed(+theQuestion.value.checker.split(".")[1])===theQuestion.value.answer
		}else{
			return userAnswer.value.toString()===theQuestion.value.answer
		}
	}),
	answerFormat = computed(()=>{
		if(theQuestion.value.checker?.match(/%d\.[0-9]+/)) {
			return `Réponse avec ${+theQuestion.value.checker.split(".")[1]} chiffre(s) après la virgule.`
		}

		return "Réponse sous forme exacte"
	}),
	previousAnswers = computed(()=>{
		return theQuestion.value.userAnswers?.length === 0 ? [] : theQuestion.value.userAnswers
	}),
	isCorrect = computed(()=>{
		if(theQuestion.value?.userAnswers.length>0){
			if(theQuestion.value.userAnswers[theQuestion.value.userAnswers.length-1].result){
				return theQuestion.value.userAnswers[theQuestion.value.userAnswers.length-1]
			}else{
				return false
			}
		}
		return false
	})

function validateAnswer() {
	const data = {
		answer: userAnswer.value,
		result: answerChecker.value
	}

	axios.post(route("questions.validate", [theQuestion.value.id]),
		data
	).then(res=>{
		theQuestion.value.userAnswers.push({...res.data, "when": "à l'instant"})
		if(res.data.result){
			emits("resolved", theQuestion)
			// Make sure the keyboard is now hidden
			showKeyboard.value = false
		}
	})
}

function patchQuestion(ev){
	axios.post(
		route("questions.update", [theQuestion.value.id]),
		{
			_method: "patch",
			...form.data()
		}
	).then(res=>{
		theQuestion.value = res.data
		if(ev.shiftKey){
			showEditForm.value = false
		}
	})
}

function destroyQuestion(){
	axios.post(
		route("questions.destroy", [theQuestion.value.id]),
		{
			_method: "delete"
		}
	).then(res=>{
		emits("destroy", theQuestion.value.id)
	})
}
</script>
