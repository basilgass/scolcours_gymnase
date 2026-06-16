<script lang="ts" setup>
import FormInput from "@/Components/Form/FormInput.vue"
import FormSearchModel from "@/Components/Form/FormSearchModel/FormSearchModel.vue"
import ChallengeGeneratorEdit from "@/Components/Challenges/ChallengeGeneratorEdit.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {ChallengeLevelInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {ref} from "vue"

const props = defineProps<{
	level: ChallengeLevelInterface
	isLast: boolean
}>()

const emit = defineEmits<{
	deleted: []
	generatorsUpdated: [generators: ChallengeLevelInterface["generators"]]
}>()

// ── Local reactive copy ────────────────────────────────────────────────────

const localLevel = ref({
	...props.level,
	generators: [...props.level.generators]
})

// ── Level ──────────────────────────────────────────────────────────────────

function saveLevel() {
	axios.patch(
		route("api.admin.challengelevels.update", {challengeLevel: localLevel.value.id}),
		{points_to_pass: localLevel.value.points_to_pass}
	)
}

function deleteLevel() {
	axios
		.delete(route("api.admin.challengelevels.destroy", {challengeLevel: localLevel.value.id}))
		.then(() => {
			emit("deleted")
		})
}

// ── Generators ────────────────────────────────────────────────────────────

function attachGenerator(generatorId: number) {
	axios
		.post(route("api.admin.challengelevels.generators.attach", {
			challengeLevel: localLevel.value.id,
			generator: generatorId
		}))
		.then((res) => {
			applyGenerators(res.data)
		})
}

// Met à jour la liste locale ET propage au parent (ChallengeEdit) pour que le
// blitzWarning, calculé sur theChallenge, reste réactif.
function applyGenerators(generators: ChallengeLevelInterface["generators"]) {
	localLevel.value.generators = generators
	emit("generatorsUpdated", generators)
}
</script>

<template>
	<card>
		<template #header>
			<div class="flex items-center justify-between">
				<h4 class="font-semibold uppercase text-sm">
					Niveau {{ localLevel.level_number }}
				</h4>
				<confirm-button
					xs
					:disabled="localLevel.generators.length > 0 || isLast"
					@confirm="deleteLevel"
				>
					supprimer
				</confirm-button>
			</div>
		</template>

		<!-- Générateurs du niveau -->
		<div
			v-if="localLevel.generators.length > 0"
			class="flex flex-col gap-1"
		>
			<challenge-generator-edit
				v-for="gen of localLevel.generators"
				:key="`gen-${gen.pivot_id}`"
				:level-id="localLevel.id"
				:generator="gen"
				@update="applyGenerators"
			/>
		</div>
		<div
			v-else
			class="text-sm text-gray-400 italic"
		>
			Aucun générateur
		</div>

		<template #footer>
			<div class="flex justify-between items-center">
				<!-- Points pour passer -->
				<FormInput
					v-model="localLevel.points_to_pass"
					label="prochain niveau"
					name="points_to_pass"
					class="max-w-48"
					type="number"
					inline-label
					sm
					@change="saveLevel"
				/>

				<!-- Attacher un générateur -->
				<form-search-model
					:api-route="route('api.generators.index')"
					@selected="attachGenerator($event.id)"
				/>
			</div>
		</template>
	</card>
</template>
