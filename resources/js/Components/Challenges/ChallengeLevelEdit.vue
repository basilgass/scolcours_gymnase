<script lang="ts" setup>
import FormInput from "@/Components/Form/FormInput.vue"
import FormSearchModel from "@/Components/Form/FormSearchModel/FormSearchModel.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {ChallengeLevelInterface, GeneratorInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {ref} from "vue"

const props = defineProps<{
	level: ChallengeLevelInterface
	isLast: boolean
}>()

const emit = defineEmits<{
	deleted: []
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
			localLevel.value.generators = res.data
		})
}

function detachGenerator(generatorId: number) {
	axios
		.post(route("api.admin.challengelevels.generators.detach", {
			challengeLevel: localLevel.value.id,
			generator: generatorId
		}))
		.then((res) => {
			localLevel.value.generators = res.data
		})
}

// ── Time per question ─────────────────────────────────────────────────────

// Tracks which generator's time_per_question input is visible (by generator id)
const timeEditVisible = ref<Set<number>>(new Set(
	props.level.generators
		.filter(g => g.config?.time_per_question != null)
		.map(g => g.id)
))

function showTimeEdit(gen: GeneratorInterface) {
	if (!gen.config) {
		gen.config = {time_per_question: null}
	}
	timeEditVisible.value = new Set([...timeEditVisible.value, gen.id])
}

function saveTimePerQuestion(gen: GeneratorInterface) {
	const timePerQuestion = gen.config?.time_per_question ?? null

	axios.patch(
		route("api.admin.challengelevels.generators.update", {
			challengeLevel: localLevel.value.id,
			generator: gen.id
		}),
		{time_per_question: timePerQuestion}
	).then((res) => {
		localLevel.value.generators = res.data
	})
}

function clearTimePerQuestion(gen: GeneratorInterface) {
	gen.config = null
	timeEditVisible.value.delete(gen.id)
	timeEditVisible.value = new Set(timeEditVisible.value)

	axios.patch(
		route("api.admin.challengelevels.generators.update", {
			challengeLevel: localLevel.value.id,
			generator: gen.id
		}),
		{time_per_question: null}
	).then((res) => {
		localLevel.value.generators = res.data
	})
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
			<div
				v-for="gen of localLevel.generators"
				:key="`gen-${gen.id}`"
				class="flex items-center justify-between bg-gray-50 py-2 px-3 rounded text-sm gap-2"
			>
				<span
					v-katex.auto.inline="gen.title"
					class="flex-1"
				/>

				<!-- Time per question -->
				<div class="flex items-center gap-1">
					<template v-if="timeEditVisible.has(gen.id)">
						<FormInput
							v-model="gen.config!.time_per_question"
							label="sec"
							name="time_per_question"
							type="number"
							inline-label
							sm
							class="max-w-28"
							@change="saveTimePerQuestion(gen)"
						/>
						<button
							class="text-gray-400 hover:text-red-400 px-1 text-xs"
							title="supprimer la limite"
							@click="clearTimePerQuestion(gen)"
						>
							<i class="bi bi-x-circle" />
						</button>
					</template>
					<button
						v-else
						class="text-gray-400 hover:text-gray-600 text-xs whitespace-nowrap"
						@click="showTimeEdit(gen)"
					>
						sans limite
					</button>
				</div>

				<a
					:href="route('admin.generators.edit', [gen.id])"
					class="text-gray-400 hover:text-gray-600 px-2"
				>
					id: {{ gen.id }} <i class="bi bi-pencil" />
				</a>
				<button
					class="text-red-300 hover:text-red-500 px-2"
					@click="detachGenerator(gen.id)"
				>
					<i class="bi bi-trash" />
				</button>
			</div>
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
