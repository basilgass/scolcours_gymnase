<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormJson from "@/Components/Form/FormJson.vue"
import type {FormMakerBaseProps, FormJsonFieldType} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<Record<string, unknown>>({
	nom: 'exemple',
	age: 25,
	actif: 'true'
})

const map: Record<string, FormJsonFieldType> = {
	nom: 'text',
	age: 'number',
	actif: 'text',
}
</script>

<template>
	<FormExampleWrapper title="FormJson">
		<template #options>
			<p class="text-xs text-gray-500">
				Le prop <code>map</code> définit le schéma : clé → type de champ.
				Les champs vides sont exclus de l'objet résultant.
			</p>
		</template>

		<template #default>
			<FormJson
				v-model="value"
				:map="map"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
