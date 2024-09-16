<script
	lang="ts"
	setup
>
import { computed, inject, ref } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import axios from "axios"
import { IllustrationInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { flashInterface } from "@/types"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"


defineOptions({ layout: LayoutMain })
const props = defineProps({
	challenge: { type: Object, required: true }
})

const flash = inject<flashInterface>("flash")


// TODO: move to external component.
const generatorTab = ref(1),
	theChallenge = ref(props.challenge)

const updateGeneratorsOrder = function () {
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
}
const addGenerator = function () {
	axios
		.post(
			route("challenges.generators.store", [
				theChallenge.value.id
			])
		)
		.then((res) => {
			theChallenge.value.generators = res.data
			// Go and edit the new generator.
			const newGenerator = res.data.pop()
			router.visit(route('generators.edit', [newGenerator.id]))
		})
		.catch(() => {
		})
}
const availableGenerators = ref([])
const attachGeneratorId = ref("")
const getListOfGenerators = function () {
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
}
const attachGenerator = function () {
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
}
const detachGenerator = function (id, destroy) {
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

const saveChallenge = function () {
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
}
const deleteChallenge = function () {
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
	<div class="my-5 scolcours-container">
		<!-- <dialog-modal v-model="show"> -->
		<!-- Header -->
		<!-- <template #header> -->
		<div
			class="sticky top-0 z-10 bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
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
				<InertiaLink
					:href="route('challenges.show', [theChallenge.slug])"
					class="btn-success btn-xs"
				>
					visiter
				</InertiaLink>
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
						label="score trigger (x)"
						name="questionsBonuses0"
						type="number"
						sm
						inline-label
						label-class="w-[150px]"
					/>
					<form-maker
						v-model="theChallenge.bonusScoreLife"
						:label="`vie / ${theChallenge.bonusScoreTrigger > 0
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
						:label="`temps / ${theChallenge.bonusScoreTrigger > 0
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
				<block-show :block="theChallenge.block" />
			</div>


			<!-- challenge generators (new version - just ordering, adding and detaching)-->
			<div class="flex flex-col gap-3">
				<h3 class="text-xl font-extralight">
					Générateurs
				</h3>
				<draggable
					item-key="id"
					v-model="theChallenge.generators"
					class="grid grid-cols-1 gap-4 items-baseline"
					handle=".drag-handler"
					v-bind="{ animation: 500, }"
					@end="updateGeneratorsOrder"
				>
					<template #item="{ element }">
						<div
							:key="`${element.id}`"
							class="flex gap-3 items-baseline bg-white py-2 pl-2 pr-3 rounded hover:shadow transition"
						>
							<div class="drag-handler cursor-move">
								<i class="text-xl bi bi-list" />
							</div>
							<div
								class="flex-1"
								@click="generatorTab = element.pivot.order"
							>
								{{ element.title }}
							</div>
							<a
								:href="route('generators.edit', [element.id])"
								class="px-3"
							>
								id: {{ element.id }} <i class="bi bi-pencil" />
							</a>
							<button
								class="text-red-300"
								@click="detachGenerator(element.id, $event)"
							>
								<i class="bi bi-trash" />
							</button>
						</div>
					</template>
					<template #footer>
						<button
							class="btn"
							@click="addGenerator"
						>
							<i class="bi bi-plus-sign" /> créer un générateur
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
			</div>
		</div>
	</div>
</template>

<style scoped>
.draggable-handle {
	cursor: move;
}

.ghost {
	@apply opacity-40;
}

.flip-list-move {
	transition: transform 0.5s;
}
</style>