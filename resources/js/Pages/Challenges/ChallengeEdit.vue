<script lang="ts" setup>
import { computed, inject, ref } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { PiMath } from "pimath/esm"
import axios from "axios"
import { IllustrationInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { flashInterface } from "@/types"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"


// TODO: refactor ChallengeEdit.
defineOptions({ layout: LayoutMain })
const props = defineProps({
	challenge: { type: Object, required: true }
})

const flash = inject<flashInterface>("flash")

const generatorTab = ref(1),
	theChallenge = ref(props.challenge),
	level = ref(1)

const currentGenerator = computed(() => {
		return theChallenge.value.generators[generatorTab.value - 1]
	}),
	generateQuestionsError = ref(""),
	generateId = ref(1),
	generateQuestions = computed(() => {
		const nbQuestions = 5

		if (currentGenerator.value === undefined) {
			console.log(`currentGenerator.value is undefined, tab number ${generatorTab.value}`)
			return []
		}
		if (currentGenerator.value.code !== "" && generateId.value >= 1) {
			const arr = []

			try {
				// let F = makeFunction(currentGenerator.value.code)
				const F = new Function("PiMath", currentGenerator.value.code)
				for (let i = 0; i < nbQuestions; i++) {
					const result = F(PiMath, level.value)
					if (
						result &&
						Object.hasOwn(result, "question") &&
						Object.hasOwn(result, "answer")
					) {
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
	updateGeneratorsOrder = function() {
		// Update the pivot value according to the order
		theChallenge.value.generators.forEach(
			(gen, index) => (gen.pivot.order = index + 1)
		)

		axios
			.post(
				route("challenges.generators.updateOrder", [
					theChallenge.value.id
				]),
				{
					_method: "PATCH",
					order: theChallenge.value.generators.map((x) => {
						return { id: x.id, order: x.pivot.order }
					})
				}
			)
			.then(() => {
				flash.success(
					"L'ordre des générateurs à bien été enregistré !"
				)
			})
			.catch((res) => {
				console.warn("update ordering order: ", res)
			})
	},
	addGenerator = function() {
		axios
			.post(
				route("challenges.generators.store", [
					theChallenge.value.id
				])
			)
			.then((res) => {
				theChallenge.value.generators = res.data
			})
			.catch(() => {
			})
	},
	availableGenerators = ref([]),
	attachGeneratorId = ref(""),
	getListOfGenerators = function() {
		if (availableGenerators.value.length === 0) {
			axios
				.get(
					route("challenges.generators.index", [
						theChallenge.value.id
					])
				)
				.then((res) => (availableGenerators.value = res.data))
				.catch((res) => {
					console.warn(res.response.data.message)
				})
		}
	},
	attachGenerator = function() {
		if (attachGeneratorId.value !== "") {
			axios
				.post(
					route("challenges.generators.attach", [
						theChallenge.value.id,
						attachGeneratorId.value
					])
				)
				.then((res) => {
					theChallenge.value.generators = res.data
					attachGeneratorId.value = ""
				})
		}
	},
	detachGenerator = function(id, destroy) {
		axios
			.post(
				route("challenges.generators.detach", [
					theChallenge.value.id,
					id
				]),
				{
					destroy: destroy.ctrlKey
				}
			)
			.then(() => {
				theChallenge.value.generators =
					theChallenge.value.generators.filter((x) => x.id !== id)
			})
	}

const theIllustration = ref<IllustrationInterface>(
	props.challenge.block.illustrations.length > 0
		? props.challenge.block.illustrations[0]
		: {
			id: 0,
			order: 1,
			css: "",
			title: "",
			type: "draw",
			code: "",
			parameters: "",
			value: "",
			block_id: null,
			widget_id: null,
			widget: null
		}
)

const saveChallenge = function() {
		// 1- Save the description block
		// 2- Save the challenge configuration
		// 3- Save the generators
		axios
			.patch(route("blocks.update", [theChallenge.value.block.id]), {
				_method: "PATCH",
				body: theChallenge.value.block.body,
				illustrations:
					theIllustration.value.parameters !== ""
						? [theIllustration.value]
						: []
			})
			.then(() => {
				axios
					.patch(
						route("challenges.update", [props.challenge.id]),
						{
							...theChallenge.value,
							_method: "PATCH"
						}
					)
					.then(() => {
						flash.success("Le challenge a bien été mis à jour")
					})
					.catch(() => {
						flash.error(
							"Il y a eu une erreur lors de la mise à jour."
						)
					})
			})
	},
	deleteChallenge = function() {
		axios
			.post(route("challenges.destroy", [props.challenge.id]), {
				_method: "delete"
			})
			.then((res) => {
				if (res.data) {
					// go back
					router.visit(
						route("chapters.show", [
							props.challenge.chapter.slug
						])
					)
					flash.success(
						"Le challenge a été supprimé avec succès..."
					)
				}
			})
	}
</script>

<template>
	<div class="bg-white relative">
		<!-- <dialog-modal v-model="show"> -->
		<!-- Header -->
		<!-- <template #header> -->
		<div
			class="sticky top-0 z-10 bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5"
		>
			<h1>
				<span class="text-xl md:text-2xl">édition d'un challenge</span>
				<span class="text-xs font-code ml-5">
					(id: {{ props.challenge.id }})
				</span>
			</h1>
			<div class="flex gap-3 justify-end">
				<button
					class="btn-primary btn-xs"
					@click="saveChallenge"
				>
					enregistrer
				</button>
				<Link
					:href="route('challenges.show', [theChallenge.slug])"
					class="btn-success btn-xs"
				>
					visiter
				</Link>
				<confirm-button
					class="btn-delete btn-xs"
					@confirm="deleteChallenge"
				>
					supprimer
				</confirm-button>
			</div>
		</div>
		<!-- </template> -->
		<!-- Tab buttons -->

		<div class="px-5 grid grid-cols-1 gap-10">
			<!-- challenge title, slug and description -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div class="flex flex-col gap-3 h-full">
					<form-maker
						v-model="theChallenge.title"
						label="titre du challenge"
						name="titre"
					/>
					<form-maker
						v-model="theChallenge.slug"
						label="slug"
						name="slug"
					/>

					<h3 class="uppercase mt-10 col-span-3">
						Paramètres
					</h3>
					<form-maker
						v-model="theChallenge.duration"
						label="durée"
						name="questionsDuration"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.lives"
						label="nombre de vie"
						name="questionsLives"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.nextLevelAfter"
						label="maxPoints / niveau"
						name="questionsLevelTrigger"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>

					<h3 class="uppercase mt-10 col-span-3">
						Bonus
					</h3>
					<form-maker
						v-model="theChallenge.bonusScoreTrigger"
						label="score trigger"
						name="questionsBonuses0"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.bonusScoreLife"
						:label="`vie / ${
							theChallenge.bonusScoreTrigger > 0
								? theChallenge.bonusScoreTrigger
								: 'x'
						} points`"
						name="questionsBonuses1"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.bonusScoreTime"

						:label="`temps / ${
							theChallenge.bonusScoreTrigger > 0
								? theChallenge.bonusScoreTrigger
								: 'x'
						} points`"
						name="questionsBonuses2"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.bonusLevelLife"
						label="vie / niveau"
						name="questionsBonuses3"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.bonusLevelTime"
						label="temps / niveau"
						name="questionsBonuses4"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
				</div>
				<block-show
					:block="theChallenge.block"
				/>
			</div>


			<!-- challenge generators -->
			<div>
				<h2 class="text-xl uppercase bg-slate-200 -mx-5 px-5 py-3 mb-5">
					Générateur (script)
				</h2>

				<div>
					<draggable
						v-model="theChallenge.generators"
						class="flex gap-4 items-baseline"
						item-key="id"
						v-bind="{
							animation: 200,
						}"
						@end="updateGeneratorsOrder"
					>
						<template #item="{ element }">
							<div class="flex flex-col">
								<button
									:class="
										generatorTab === element.pivot.order
											? 'is-active'
											: ''
									"
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
								:disabled="attachGeneratorId === ''"
								class="btn disabled:is-disabled"
								@click="attachGenerator"
							>
								<i class="bi bi-file-arrow-up" />
							</button>
							<form-maker
								v-model="attachGeneratorId"
								label="générateurs"
								name="generatorsList"
								type="select"
								@click.once="getListOfGenerators"
							>
								<option
									v-for="generator of availableGenerators"
									:key="`generator-${generator.id}`"
									:value="generator.id"
								>
									{{ generator.title }}
								</option>
							</form-maker>
						</template>
					</draggable>

					<div
						v-for="(generator, index) of theChallenge.generators"
						v-show="generator.pivot.order === generatorTab"
						:key="`generator-${generator.id}`"
						class="flex flex-col md:flex-row gap-3 pb-10"
					>
						<div class="flex flex-col grow">
							<form-maker
								v-model="theChallenge.generators[index].title"
								label="titre du générateur"
								name="generatorTitle"
							/>
							<form-maker
								v-model="theChallenge.generators[index].slug"
								label="slug du générateur"
								name="generatorTitle"
								sm
							/>
							<form-maker
								v-model="theChallenge.generators[index].body"
								:rows="2"
								label="description du générateur"
								name="generatorBody"
								type="textarea"
							/>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								<form-maker
									v-model="
										theChallenge.generators[index].template
									"
									:rows="2"
									label="template"
									type="code"
								/>

								<form-maker
									v-model="
										theChallenge.generators[index].keyboard
									"
									:rows="2"
									label="clavier"
									type="keyboard"
								/>
							</div>

							<form-maker
								v-model="theChallenge.generators[index].code"
								:rows="10"
								auto-size
								label="générateur de questions"
								language="javascript"
								resizable
								type="code"
							/>
						</div>

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
								v-if="generateQuestions.length > 0"
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
	</div>
</template>
