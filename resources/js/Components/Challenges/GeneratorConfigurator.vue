<script setup lang="ts">

import {GeneratorInterface} from "@/types/challengeInterfaces.ts"
import {onMounted} from "vue"
import {GeneratorParameterRawValue} from "@/Composables/useGeneratorParameters.ts"
import FormNumberSet from "@/Components/Form/FormNumberSet.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const props = defineProps<{
	generator: GeneratorInterface
}>()
const parameters = defineModel<Record<string, GeneratorParameterRawValue>>()

onMounted(() => {
	// On récupère les données dans le query si nécessaire.
	const query = new URLSearchParams(window.location.search)
	const queryParams = Object.fromEntries(query.entries()) as Record<string, GeneratorParameterRawValue>

	// convert Record<string, GeneratorParameterSchemaEntry> to Record<string, GeneratorParametersRawValue>
	const defaults: Record<string, GeneratorParameterRawValue> = Object.fromEntries(
		Object.entries(props.generator.parameters_schema ?? {}).map(([key, value]) => [key, value.default ?? null])
	)

	parameters.value = {
		...defaults,
		...queryParams,
		...(parameters.value ?? {})
	} as Record<string, GeneratorParameterRawValue>
})

const emit = defineEmits<{
	reload: [];
}>()
</script>

<template>
	<Card
		v-if="generator.parameters_schema"
		class="max-w-[40em] mx-auto"
	>
		<template #header>
			<div>
				<i class="bi bi-info-circle mr-3" />Le générateur <code>{{ generator.title }}</code> est paramétrable.
			</div>
		</template>
		<div
			class="grid grid-cols-2 gap-5"
		>
			<div
				v-for="(value,key) in generator.parameters_schema"
				:key="key"
			>
				<form-input
					v-if="value.format==='number'"
					v-model="parameters[key]"
					:label="value.description"
					type="number"
				/>
				<form-input
					v-else-if="value.format==='string'"
					v-model="parameters[key]"
					:label="value.description"
					type="text"
				/>
				<form-number-set
					v-else-if="value.format==='set'"
					v-model="parameters[key]"
					:label="value.description"
				/>
			</div>
		</div>
		<template #footer>
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
