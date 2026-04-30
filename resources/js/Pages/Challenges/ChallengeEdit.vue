<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ChallengeLevelEdit from "@/Components/Challenges/ChallengeLevelEdit.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeInterface, IllustrationInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import Card from "@/Components/Ui/Card.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	challenge: ChallengeInterface
}>()

const flash = useStoreFlashMessage()

const theChallenge = ref({
	...props.challenge,
	levels: props.challenge.levels.map(l => ({
		...l,
		generators: [...l.generators]
	}))
})

const blitzWarning = computed(() =>
	theChallenge.value.type === 'blitz' &&
	theChallenge.value.levels.some(level =>
		level.generators.some(gen => !gen.config?.time_per_question)
	)
)

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

// ── Challenge global save ──────────────────────────────────────────────────

const saveChallenge = function () {
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
				.then(() => flash.success("Le challenge a bien été mis à jour"))
				.catch(() => flash.error("Il y a eu une erreur lors de la mise à jour."))
		})
}

const deleteChallenge = function () {
	axios
		.post(route("api.admin.challenges.destroy", [props.challenge.id]), {
			_method: "delete"
		})
		.then((res) => {
			if (res.data) {
				router.visit(route("chapters.show", [props.challenge.chapter.id]))
				flash.success("Le challenge a été supprimé avec succès...")
			}
		})
}

// ── Levels ────────────────────────────────────────────────────────────────

function addLevel() {
	axios
		.post(route("api.admin.challengelevels.store", {challenge: props.challenge.id}))
		.then((res) => {
			theChallenge.value.levels.push(res.data)
		})
}

function deleteLevel(levelId: number) {
	const level = theChallenge.value.levels.find(l => l.id === levelId)
	if (!level) {
		return
	}
	const deletedNumber = level.level_number
	theChallenge.value.levels = theChallenge.value.levels
		.filter(l => l.id !== levelId)
		.map(l => l.level_number > deletedNumber
			? {...l, level_number: l.level_number - 1}
			: l
		)
}
</script>

<template>
	<div class="my-5 scolcours-container">
		<!-- Sticky header -->
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
					:href="route('challenges.show', { challenge: theChallenge.slug })"
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

		<div class="px-5 grid grid-cols-1 gap-10">
			<!-- Identité et description -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div class="flex flex-col gap-3 h-full">
					<FormInput
						v-model="theChallenge.title"
						label="titre du challenge"
						name="titre"
					/>
					<FormInput
						v-model="theChallenge.slug"
						label="slug"
						name="slug"
						font-code
						sm
					/>

					<card>
						<template #header>
							<h3 class="uppercase">
								Paramètres
							</h3>
						</template>
						<div class="flex flex-col gap-3">
							<FormSelect
								v-model="theChallenge.type"
								label="type"
								name="type"
								:choices="['classic', 'chrono', 'blitz']"
								sm
							/>

							<FormInput
								v-model="theChallenge.time_limit"
								label="durée (sec)"
								name="time_limit"
								type="number"
								sm
							/>
							<FormInput
								v-if="theChallenge.type !== 'chrono'"
								v-model="theChallenge.lives"
								label="nombre de vies"
								name="lives"
								type="number"
								sm
							/>

							<div
								v-if="blitzWarning"
								class="text-amber-600 text-sm border border-amber-300 bg-amber-50 rounded px-3 py-2"
							>
								Certains générateurs n'ont pas de temps par question configuré
								(config.time_per_question).
							</div>
						</div>
					</card>
				</div>

				<block-show
					:block="theChallenge.block"
					indestructible
				/>
			</div>

			<!-- Niveaux -->
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-xl font-extralight">
						Niveaux
					</h3>
					<sc-button
						type="add"
						xs
						@click="addLevel"
					>
						+ ajouter un niveau
					</sc-button>
				</div>

				<challenge-level-edit
					v-for="level of theChallenge.levels"
					:key="`level-${level.id}`"
					:level="level"
					:is-last="theChallenge.levels.length <= 1"
					@deleted="deleteLevel(level.id)"
				/>
			</div>
		</div>
	</div>
</template>
