<script setup lang="ts">

import {GeneratorInterface} from "@/types/challengeInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import {GeneratorParameterRawValue} from "@/Composables/useGeneratorParameters.ts"
import FormNumberSet from "@/Components/Form/FormNumberSet.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import axios from "axios"

const props = withDefaults(defineProps<{
	// Générateur fourni directement (avec son parameters_schema)…
	generator?: GeneratorInterface
	// …ou simplement son id : le schéma est alors résolu via l'API (contexte admin).
	generatorId?: number
	readQuery?: boolean
	showReload?: boolean
}>(), {
	generator: undefined,
	generatorId: undefined,
	readQuery: true,
	showReload: true
})
const parameters = defineModel<Record<string, GeneratorParameterRawValue>>({default: () => ({})})

// Source unique : générateur fourni en prop, sinon celui résolu par id.
const theGenerator = ref<GeneratorInterface | undefined>(props.generator)
const schema = computed(() => theGenerator.value?.parameters_schema ?? null)

const emit = defineEmits<{
	reload: [];
	change: [];
}>()

/**
 * Amorce les valeurs : defaults du schéma < query (contexte joueur) < valeurs déjà présentes.
 */
function seedParameters(generator: GeneratorInterface): void {
	const queryParams: Record<string, GeneratorParameterRawValue> = props.readQuery
		? Object.fromEntries(new URLSearchParams(window.location.search).entries()) as Record<string, GeneratorParameterRawValue>
		: {}

	const defaults: Record<string, GeneratorParameterRawValue> = Object.fromEntries(
		Object.entries(generator.parameters_schema ?? {}).map(([key, value]) => [key, value.default ?? null])
	)

	parameters.value = {
		...defaults,
		...queryParams,
		...(parameters.value ?? {})
	} as Record<string, GeneratorParameterRawValue>
}

onMounted(async () => {
	// Résolution paresseuse du schéma quand seul l'id est fourni.
	if (!theGenerator.value && props.generatorId != null) {
		const res = await axios.get(route("api.admin.generators.show", {generator: props.generatorId}))
		theGenerator.value = res.data
	}

	if (theGenerator.value) {
		seedParameters(theGenerator.value)
	}
})
</script>

<template>
	<Card
		v-if="schema"
		class="max-w-[40em] mx-auto"
	>
		<template #header>
			<div>
				<i class="bi bi-info-circle mr-3" />Le générateur <code>{{ theGenerator?.title }}</code> est paramétrable.
			</div>
		</template>
		<div
			class="grid grid-cols-2 gap-5"
		>
			<div
				v-for="(value,key) in schema"
				:key="key"
			>
				<form-input
					v-if="value.format==='number'"
					v-model="parameters[key]"
					:label="value.description"
					type="number"
					@update="emit('change')"
				/>
				<form-input
					v-else-if="value.format==='string'"
					v-model="parameters[key]"
					:label="value.description"
					type="text"
					@update="emit('change')"
				/>
				<form-number-set
					v-else-if="value.format==='set'"
					v-model="parameters[key]"
					:label="value.description"
					@update="emit('change')"
				/>
				<form-select
					v-else-if="value.format === 'choices'"
					v-model="parameters[key]"
					:choices="(value.choices ?? '').split(',').map(s => s.trim()).filter(Boolean)"
					:label="value.description"
					@update="emit('change')"
				/>
				<form-switch
					v-else-if="value.format === 'boolean'"
					:model-value="parameters[key] === 'true'"
					:label="value.description"
					@update:model-value="(v) => { parameters[key] = v ? 'true' : 'false'; emit('change') }"
				/>
			</div>
		</div>
		<template
			v-if="showReload"
			#footer
		>
			<div class="flex justify-end py-1">
				<sc-button
					type="primary"
					sm
					@click="emit('reload')"
				>
					<i class="bi bi-shuffle" /> recharger
				</sc-button>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
