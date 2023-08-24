<!--
Edition d'un challenge
-->
<template>
	<dialog-modal v-model="show">
		<!-- Header -->
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

		<!-- Tab buttons -->
		<div class="grid grid-cols-3 gap-4 px-5">
			<button
				:class="tab==='block'?`is-active`:''"
				class="btn"
				@click="tab = 'block'"
			>
				éditer la donnée
			</button>
			<button
				:class="tab==='config'?`is-active`:''"
				class="btn"
				@click="tab = 'config'"
			>
				éditer la configuration
			</button>
			<button
				:class="tab==='generator'?`is-active`:''"
				class="btn"
				@click="tab = 'generator'"
			>
				éditer la génération
			</button>
		</div>


		<div class="px-5 pb-5 overflow-scroll min-h-[80vh]">
			<!-- challenge title, slug and description -->
			<div
				v-show="tab === 'block'"
				class="grid grid-cols-1 md:grid-cols-2 gap-3"
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
						:rows="10"
						label="body"
						name="body"
					/>
				</div>

				<form-illustration
					v-model="theIllustration"
					name="illustration"
				/>
			</div>
			<!-- challenge configuration: output, dft keyboard, time, levels, lives, bonus per level-->
			<div v-show="tab === 'config'">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
					<div>
						<form-input
							v-model="theChallenge.output"
							label="affichage de la question/réponse"
							name="questionsoutput"
						/>

						<form-textarea
							v-model="theChallenge.keyboard"
							label="clavier affiché"
							name="questionsKeyboard"
						/>
					</div>
					<div>
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

						<form-number
							v-model="theChallenge.nextLevelAfter"
							label="maxPoints / niveau"
							name="questionsLevelTrigger"
						/>
					</div>
				</div>

				<h3 class="uppercase mt-10">
					Bonus
				</h3>

				<div
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end"
				>
					<form-number
						v-model="theChallenge.bonusScoreTrigger"
						label="score trigger"
						name="questionsBonuses0"
					/>
					<form-number
						v-model="theChallenge.bonusScoreLife"
						:label="`vie / ${theChallenge.bonusScoreTrigger>0?theChallenge.bonusScoreTrigger:'x'} points`"
						name="questionsBonuses1"
					/>
					<form-number
						v-model="theChallenge.bonusScoreTime"
						:label="`temps / ${theChallenge.bonusScoreTrigger>0?theChallenge.bonusScoreTrigger:'x'} points`"
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
			<!-- challenge generators -->
			<div v-show="tab === 'generator'">
				<h3 class="text-lg uppercase">
					Générateur (script)
				</h3>

				<div>
					<draggable
						v-model="theChallenge.generators"
						class="flex gap-4 items-baseline"
						item-key="id"
						@end="updateGeneratorsOrder"
					>
						<template #item="{ element }">
							<div class="flex flex-col">
								<button
									:class="generatorTab === element.pivot.order ? 'is-active':'' "
									class="btn"
									@click="generatorTab = element.pivot.order"
								>
									{{ element.title }}
								</button>
								<button
									class="text-red-200"
									@click="detachGenerator(element.id, $event)"
								>
									détacher
								</button>
							</div>
						</template>
						<template #footer>
							<button
								class="btn"
								@click="addGenerator"
							>
								<i class="bi bi-plus-lg" />
							</button>
							<button
								:disabled="attachGeneratorId===''"
								class="btn disabled:is-disabled"
								@click="attachGenerator"
							>
								<i class="bi bi-file-arrow-up" />
							</button>
							<form-select
								v-model="attachGeneratorId"
								label="generateurs"
								name="generatorsList"
								@click.once="getListOfGenerators"
							>
								<option
									v-for="generator of availableGenerators"
									:key="`generator-${generator.id}`"
									:value="generator.id"
								>
									{{ generator.title }}
								</option>
							</form-select>
						</template>
					</draggable>

					<div
						v-for="(generator, index) of theChallenge.generators"
						v-show="generator.pivot.order===generatorTab"
						:key="`generator-${generator.id}`"
						class="flex flex-col md:flex-row gap-3 min-h-[65vh]"
					>
						<form-codearea
							v-model="theChallenge.generators[index].code"
							:rows="30"
							class="flex-1"
							label="générateur de questions"
							name="questionsGenerator"
						/>
						<div class="w-[250px]">
							<div class="flex justify-between">
								<h3>Exemples</h3>
								<button
									class="btn-xs"
									@click="generateId++"
								>
									générer
								</button>
							</div>

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
		</div>
	</dialog-modal>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormIllustration from "@/Components/Form/FormIllustration.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {PiMath} from "pimath/esm"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import {useGenerators} from "@/Composables/useGenerators"
import FormSelect from "@/Components/Form/FormSelect.vue"
import {router} from "@inertiajs/vue3"

const emits = defineEmits(["update:modelValue", "change", "destroy"])

let props = defineProps({
	modelValue: {type: Boolean, default: false},
	challenge: {type: Object, required: true},
})

const flash = inject("flash")

let show = ref(props.modelValue),
	tab = ref("generator"),
	generatorTab = ref(1),
	theChallenge = ref(props.challenge),
	level = ref(1)

let currentGenerator = computed(() => {
		return useGenerators(theChallenge.value.generators).generator(generatorTab.value)
	}),
	generateQuestionsError = ref(""),
	generateId = ref(1),
	generateQuestions = computed(() => {
		const nbQuestions = 5
		if (currentGenerator.value.code !== "" && generateId.value >= 1) {
			let arr = []

			try {
				// let F = makeFunction(currentGenerator.value.code)
				let F = new Function(
					"PiMath",
					currentGenerator.value.code
				)
				for (let i = 0; i < nbQuestions; i++) {
					const result = F(PiMath, level.value)
					if (result && result.hasOwnProperty("question") && result.hasOwnProperty("answer")) {
						arr.push(result)
					}
				}

				return arr
			} catch (err) {
				//console.warn(err)
			}
		}
		return []
	}),
	updateGeneratorsOrder = function () {
		// Update the pivot value according to the order
		theChallenge.value.generators.forEach((gen, index) => gen.pivot.order = index + 1)

		axios.post(route("challenges.generators.updateOrder", [theChallenge.value.id]), {
			_method: "PATCH",
			order: theChallenge.value.generators.map(x => {
				return {id: x.id, order: x.pivot.order}
			})
		}).then(res => {
			flash.success("L'ordre des générateurs à bien été enregistré !")
		}).catch(res => {
			console.warn("update ordering order: ", res)
		})
	},
	addGenerator = function () {
		axios.post(route("challenges.generators.store", [theChallenge.value.id]))
			.then(res => {
				theChallenge.value.generators = res.data
			}).catch(res => {
			})
	},
	availableGenerators = ref([]),
	attachGeneratorId = ref(""),
	getListOfGenerators = function () {
		if (availableGenerators.value.length === 0) {
			axios.get(route("challenges.generators.index", [theChallenge.value.id]))
				.then(res => availableGenerators.value = res.data)
				.catch(res => {
					console.warn(res.response.data.message)
				})
		}
	},
	attachGenerator = function (s) {
		if (attachGeneratorId.value !== "") {

			axios.post(route("challenges.generators.attach", [theChallenge.value.id, attachGeneratorId.value]))
				.then(res => {
					theChallenge.value.generators = res.data
					attachGeneratorId.value = ""
				})
		}
	},
	detachGenerator = function (id, destroy) {
		axios.post(route("challenges.generators.detach", [theChallenge.value.id, id]), {
			"destroy": destroy.ctrlKey
		})
			.then(res => {
				theChallenge.value.generators = theChallenge.value.generators.filter(x => x.id !== id)
			})
	}

let theIllustration = ref(
	props.challenge.block.illustrations.length > 0 ? props.challenge.block.illustrations[0] : {
		title: "",
		type: "draw",
		code: "",
		parameters: ""
	}
)

let saveChallenge = function () {
		// 1- Save the description block
		// 2- Save the challenge configuration
		// 3- Save the generators
		axios
			.patch(route("blocks.update", [theChallenge.value.block.id]), {
				_method: "PATCH",
				body: theChallenge.value.block.body,
				illustrations: theIllustration.value.parameters !== "" ? [theIllustration.value] : [],
			})
			.then((res) => {
				axios
					.patch(route("challenges.update", [props.challenge.id]), {
						...theChallenge.value,
						_method: "PATCH",
					})
					.then((res) => {
						emits("update:modelValue", false)
						emits("change", res.data.data)
					})
					.then((res) => {
						flash.success("Le challenge a bien été mis à jour")
					})
					.catch((res) => {
						flash.error("Il y a eu une erreur lors de la mise à jour.")
					})
			})
	},
	deleteChallenge = function () {
		axios
			.post(route("challenges.destroy", [props.challenge.id]), {
				_method: "delete",
			})
			.then((res) => {
				if(res.data) {
					// go back
					router.visit(
						route("chapter.show", [props.challenge.chapter.slug])
					)
					flash.success("Le challenge a été supprimé avec succès...")
				}
			})
	}
</script>
