<script
	lang="ts"
	setup
>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeInterface, IllustrationInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {useChallenge} from "@/Composables/useChallenge.ts"
import FormSearchModel from "@/Components/Form/FormSearchModel/FormSearchModel.vue"

defineOptions({layout: LayoutMain})
const props = defineProps<{
	challenge: ChallengeInterface
}>()


const flash = useStoreFlashMessage()

// TODO: utiliser plus le useChallenge
const data = useChallenge(props.challenge)
const theChallenge = data.challenge

const updateGeneratorsOrder = function () {
	// Update the pivot value according to the order
	theChallenge.value.generators.forEach(
		(gen, index) => (gen.order = index + 1)
	)

	axios
		.post(
			route("api.admin.challenges.generators.updateOrder", [
				theChallenge.value.id
			]),
			{
				_method: "PATCH",
				order: theChallenge.value.generators.map((x) => {
					return {id: x.id, order: x.order}
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
			route("api.admin.challenges.generators.store", [
				theChallenge.value.id
			])
		)
		.then((res) => {
			theChallenge.value.generators = res.data
			// Go and edit the new generator.
			const newGenerator = res.data.pop()
			router.visit(route('admin.generators.edit', [newGenerator.id]))
		})
		.catch(() => {
			console.error('Pas possible de créer un challenge.')
		})
}
const attachGeneratorId = ref("")

function attachGenerator(id: number) {
	axios
		.post(
			route("api.admin.challenges.generators.attach", {
				challenge: theChallenge.value.id,
				generator: id
			})
		)
		.then((res) => {
			theChallenge.value.generators = res.data
			attachGeneratorId.value = ""
		})
}

const detachGenerator = function (id, destroy) {
	axios
		.post(
			route("api.admin.challenges.generators.detach", [
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
			footer: "",
			code: "",
			parameters: "",
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
		.patch(route("api.admin.blocks.update", [theChallenge.value.block.id]), {
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
					route("api.admin.challenges.update", [props.challenge.id]),
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
		.post(route("api.admin.challenges.destroy", [props.challenge.id]), {
			_method: "delete"
		})
		.then((res) => {
			if (res.data) {
				// go back
				router.visit(
					route("chapters.show", [
						props.challenge.chapter.id
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
				<sc-button
					type="primary"
					xs
					@click="saveChallenge"
				>
					enregistrer
				</sc-button>
				<sc-button
					:href="route('challenges.quick', [theChallenge.slug])"
					type="success"
					xs
				>
					visiter
				</sc-button>
				<confirm-button
					xs
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
						font-code
						sm
					/>

					<h3 class="uppercase mt-10 col-span-3">
						Paramètres
					</h3>
					<div class="grid grid-cols-3 gap-3">
						<form-maker
							v-model="theChallenge.duration"
							label="durée"
							name="questionsDuration"
							type="number"
							sm
						/>
						<form-maker
							v-model="theChallenge.lives"
							label="nombre de vie"
							name="questionsLives"
							type="number"
							sm
						/>
						<form-maker
							v-model="theChallenge.nextLevelAfter"
							label="maxPoints / niveau"
							name="questionsLevelTrigger"
							type="number"
							sm
						/>

						<form-maker
							v-model="theChallenge.generatorsGrouping"
							label="grouper générateurs"
							name="generatorsGrouping"
							type="number"
							min="1"
							:max="theChallenge.generators.length"
							sm
						/>

						<div>nombre de niveaux: {{ data.maxLevels }}</div>
					</div>

					<h3 class="uppercase mt-10 col-span-3">
						Bonus
					</h3>

					<div class="grid grid-cols-3 gap-3">
						<form-maker
							v-model="theChallenge.bonusScoreTrigger"
							label="score trigger (x)"
							name="questionsBonuses0"
							type="number"
							sm
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
						/>
						<form-maker
							v-model="theChallenge.bonusLevelLife"
							label="vie / niveau"
							name="questionsBonuses3"
							type="number"
							sm
						/>
						<form-maker
							v-model="theChallenge.bonusLevelTime"
							label="temps / niveau"
							name="questionsBonuses4"
							type="number"
							sm
						/>
					</div>
				</div>
				<block-show :block="theChallenge.block" />
			</div>


			<!-- challenge generators (new version - just ordering, adding and detaching)-->
			<div class="flex flex-col gap-3">
				<h3 class="text-xl font-extralight">
					Générateurs
				</h3>
				<draggable
					v-model="theChallenge.generators"
					item-key="id"
					class="grid grid-cols-1 gap-2 items-baseline"
					handle=".drag-handler"
					v-bind="{ animation: 500, }"
					@end="updateGeneratorsOrder"
				>
					<template #item="{ element, index }">
						<div
							:key="`${element.id}`"
							class="flex gap-3 items-baseline bg-white py-2 pl-2 pr-3 rounded-sm hover:shadow-sm transition"
							:class="data.challenge.value.generatorsGrouping === 1 ? '' : (index> 0 && index%data.challenge.value.generatorsGrouping ===0) ? 'mt-5':''"
						>
							<div class="drag-handler cursor-move">
								<i class="text-xl bi bi-list" />
							</div>
							<div
								v-katex.auto.inline="element.title"
								class="flex-1"
							/>
							<a
								:href="route('admin.generators.edit', [element.id])"
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
						<form-search-model
							:api-route="route('api.generators.index')"
							@selected="attachGenerator($event.id)"
						>
							<template #button>
								<sc-button
									type="add"
									@click="addGenerator"
								>
									<i class="bi bi-plus-sign" /> créer un générateur
								</sc-button>
							</template>
						</form-search-model>
					</template>
				</draggable>
			</div>
		</div>
	</div>
</template>
