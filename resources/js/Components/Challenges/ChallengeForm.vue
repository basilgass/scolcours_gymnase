<!--
Edition d'un challenge
-->
<template>
	<dialog-modal v-model="show">
		<template #header>
			<div
				class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5"
			>
				<h1>
					<span class="text-xl md:text-2xl">édition d'un challenge</span>
					<span class="text-xs font-code ml-5">(id: {{ props.challenge.id }})</span>
				</h1>
				<div class="flex gap-3 justify-end">
					<button
						class="btn-primary btn-xs"
						@click="saveChallenge"
					>
						enregistrer
					</button>
					<button
						class="btn-cancel btn-xs"
						@click="emits('update:modelValue', false)"
					>
						fermer
					</button>
					<confirm-button
						class="btn-delete btn-xs"
						@confirm="deleteChallenge"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>

		<div class="grid grid-cols-3 gap-4 px-5">
			<button
				class="btn"
				@click="tab = 'block'"
			>
				éditer la donnée
			</button>
			<button
				class="btn"
				@click="tab = 'config'"
			>
				éditer la configuration
			</button>
			<button
				class="btn"
				@click="tab = 'generator'"
			>
				éditer la génération
			</button>
		</div>
		<div class="px-5 pb-5 overflow-scroll min-h-[80vh]">
			<div
				v-show="tab === 'block'"
				class="grid grid-cols-1 lg:grid-cols-2 gap-3"
			>
				<div>
					<form-input
						v-model="theChallenge.title"
						label="titre"
						name="titre"
					/>
					<form-input
						v-model="theChallenge.slug"
						label="slug"
						name="slug"
					/>
					<form-textarea
						v-model="theChallenge.block.body"
						label="body"
						name="body"
						:rows="10"
					/>
				</div>
				<form-illustration
					v-model="theIllustration"
					label="illustration"
					name="illustration"
				/>
			</div>
			<div v-show="tab === 'config'">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
					<form-input
						v-model="theChallenge.output"
						label="affichage de la question/réponse"
						name="questionsoutput"
					/>

					<form-input
						v-model="theChallenge.keyboard"
						label="clavier affiché"
						name="questionsKeyboard"
					/>
					<form-textarea
						v-model="theChallenge.parameters"
						label="paramètres du claviers"
						name="questionsKeyboardParams"
						:rows="5"
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
					<form-number
						v-model="theChallenge.nextLevelAfter"
						label="points / niveau"
						name="questionsLevelTrigger"
					/>

					<form-number
						v-model="theChallenge.duration"
						label="durée"
						name="questionsDuration"
					/>

					<form-number
						v-model="theChallenge.lives"
						label="nombre de vie"
						name="questionsLives"
					/>
				</div>
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
				>
					<h3 class="col-span-4 uppercase mt-5 -mb-5">
						Bonus
					</h3>

					<form-number
						v-model="theChallenge.bonusScoreLife"
						label="vie / score"
						name="questionsBonuses1"
					/>
					<form-number
						v-model="theChallenge.bonusScoreTime"
						label="temps / score"
						name="questionsBonuses2"
					/>
					<form-number
						v-model="theChallenge.bonusLevelLife"
						label="vie / niveau"
						name="questionsBonuses3"
					/>
					<form-number
						v-model="theChallenge.bonusLevelTime"
						label="temps / niveau"
						name="questionsBonuses4"
					/>
				</div>
			</div>
			<div v-show="tab === 'generator'">
				<h3 class="text-lg uppercase">
					Générateur (script)
				</h3>

				<div class="grid grid-cols-1 grid-cols-2 gap-3">
					<form-codearea
						v-model="theChallenge.generator"
						:rows="30"
						label="générateur de questions"
						name="questionsGenerator"
					/>
					<div class="mt-8">
						<form-number
							v-model="level"
							label="niveau"
							min="1"
							name="level"
						/>
						<div
							v-if="generateQuestions.length>0"
							class="font-code divide-y"
						>
							<div
								v-for="(question, idx) of generateQuestions"
								:key="`question-${idx}`"
								class="flex justify-between py-2"
							>
								<div v-katex="question.question" />
								<div v-text="question.answer" />
							</div>
						</div>
						<div
							class="text-red-600"
							v-text="generateQuestionsError"
						/>
					</div>
				</div>
			</div>
		</div>
	</dialog-modal>
</template>

<script setup>
import {computed, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormIllustration from "@/Components/Form/FormIllustration.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {PiMath} from "pimath/esm"
import {Inertia} from "@inertiajs/inertia"
import FormCodearea from "@/Components/Form/FormCodearea.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])

let props = defineProps({
	modelValue: { type: Boolean, default: false },
	challenge: { type: Object, required: true },
})
let show = ref(props.modelValue),
	tab = ref("generator"),
	theChallenge = ref(props.challenge),
	level = ref(1)

let generateQuestionsError = ref(""),
	generateQuestions = computed(() => {
		if (theChallenge.value.generator !== "") {
			let arr = []

			try {
				let F = new Function(
					"PiMath",
					"level",
					theChallenge.value.generator
				)
				for (let i = 0; i < 20; i++) {
					const result = F(PiMath, level.value)
					if(result && result.hasOwnProperty("question") && result.hasOwnProperty("answer")) {
						arr.push(result)
					}
				}

				return arr
			} catch (err) {
				//console.warn(err)
			}
		}

		return []
	})

let theIllustration = ref(
	props.challenge.block.illustrations.length>0?props.challenge.block.illustrations[0]:{
		title: "",
		type: "draw",
		code: "",
		parameters: ""
	}
)

let saveChallenge = function () {
		axios
			.post(route("blocks.update", [theChallenge.value.block.id]), {
				_method: "PATCH",
				body: theChallenge.value.block.body,
				illustrations: theIllustration.value.parameters!==""?[theIllustration.value]:[],
			})
			.then((res) => {
				axios
					.post(route("challenges.update", [props.challenge.id]), {
						...theChallenge.value,
						_method: "patch",
					})
					.then((res) => {
						emits("update:modelValue", false)
						emits("change", res.data.data)
					})
			})
	},
	deleteChallenge = function () {
		axios
			.post(route("challenges.destroy", [props.challenge.id]), {
				_method: "delete",
			})
			.then((res) => {
				// go back
				Inertia.visit(
					route("theme.chapter", [res.data.theme, res.data.chapter])
				)
			})
	}
</script>
