<script lang="ts" setup>
import FormInput from "@/Components/Form/FormInput.vue"
import GeneratorConfigurator from "@/Components/Generators/GeneratorConfigurator.vue"
import {GeneratorInterface} from "@/types/modelInterfaces"
import {GeneratorParameterRawValue} from "@/Composables/useGeneratorParameters.ts"
import axios from "axios"
import {ref} from "vue"

const props = defineProps<{
	levelId: number
	generator: GeneratorInterface
}>()

const emit = defineEmits<{
	update: [generators: GeneratorInterface[]]
}>()

function updateRoute(): string {
	return route("api.admin.challengelevels.generators.update", {
		challengeLevel: props.levelId,
		generatorable: props.generator.pivot_id
	})
}

// ── Label per generator ─────────────────────────────────────────────────────

const label = ref<string | undefined>(props.generator.label ?? undefined)

function saveLabelPerGenerator() {
	if (label.value === props.generator.label) return

	axios.patch(updateRoute(), {label: label.value})
		.then((res) => emit("update", res.data))
}

// ── Time per question ───────────────────────────────────────────────────────

const timePerQuestion = ref<number | undefined>(props.generator.config?.time_per_question ?? undefined)
const showTimeEdit = ref(props.generator.config?.time_per_question != null)

function enableTimeEdit() {
	showTimeEdit.value = true
}

function saveTimePerQuestion() {
	axios.patch(updateRoute(), {time_per_question: timePerQuestion.value})
		.then((res) => emit("update", res.data))
}

function clearTimePerQuestion() {
	timePerQuestion.value = undefined
	showTimeEdit.value = false
	axios.patch(updateRoute(), {time_per_question: null})
		.then((res) => emit("update", res.data))
}

// ── Parameters ──────────────────────────────────────────────────────────────

const showParameters = ref(false)
const params = ref<Record<string, GeneratorParameterRawValue>>({...(props.generator.parameters ?? {})})

let saveTimer: ReturnType<typeof setTimeout> | undefined

function saveParameters() {
	clearTimeout(saveTimer)
	saveTimer = setTimeout(() => {
		axios.patch(updateRoute(), {parameters: params.value})
			.then((res) => emit("update", res.data))
	}, 600)
}

// ── Detach ──────────────────────────────────────────────────────────────────

function detach() {
	axios
		.post(route("api.admin.challengelevels.generators.detach", {
			challengeLevel: props.levelId,
			generatorable: props.generator.pivot_id
		}))
		.then((res) => {
			emit("update", res.data)
		})
}
</script>

<template>
	<div class="bg-gray-50 rounded">
		<div class="flex items-center justify-between py-2 px-3 text-sm gap-2">
			<div class="flex-1 flex gap-3 items-center">
				<div
					v-katex.auto.inline="generator.title"
					class="w-50"
				/>

				<form-input
					v-model="label"
					class="max-w-100"
					xs
					type="text"
					@blur="saveLabelPerGenerator"
				/>
			</div>
			<!-- Paramètres (panneau dépliable) -->
			<button
				v-if="generator.parameters_schema"
				class="px-1 text-xs"
				:class="showParameters ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'"
				title="paramètres"
				@click="showParameters = !showParameters"
			>
				<i class="bi bi-sliders" />
			</button>

			<!-- Temps par question -->
			<div class="flex items-center gap-1">
				<template v-if="showTimeEdit">
					<FormInput
						v-model="timePerQuestion"
						label="sec"
						name="time_per_question"
						type="number"
						inline-label
						sm
						class="max-w-28"
						@change="saveTimePerQuestion"
					/>
					<button
						class="text-gray-400 hover:text-red-400 px-1 text-xs"
						title="supprimer la limite"
						@click="clearTimePerQuestion"
					>
						<i class="bi bi-x-circle" />
					</button>
				</template>
				<button
					v-else
					class="text-gray-400 hover:text-gray-600 text-xs whitespace-nowrap"
					@click="enableTimeEdit"
				>
					sans limite
				</button>
			</div>

			<a
				:href="route('admin.generators.edit', [generator.id])"
				class="text-gray-400 hover:text-gray-600 px-2"
			>
				id: {{ generator.id }} <i class="bi bi-pencil" />
			</a>
			<button
				class="text-red-300 hover:text-red-500 px-2"
				@click="detach"
			>
				<i class="bi bi-trash" />
			</button>
		</div>

		<!-- Panneau de configuration des paramètres -->
		<div
			v-if="showParameters && generator.parameters_schema"
			class="px-3 pb-3"
		>
			<generator-configurator
				v-model="params"
				:generator
				:read-query="false"
				:show-reload="false"
				@change="saveParameters"
			/>
		</div>
	</div>
</template>
