<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormSearch from "@/Components/Form/FormSearch.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

interface Item {
	id: number
	title: string
}

const value = ref<Item | undefined>(undefined)

const list = ['Algèbre', 'Géométrie', 'Analyse', 'Probabilités', 'Statistiques', 'Trigonométrie']
</script>

<template>
	<FormExampleWrapper title="FormSearch">
		<template #options>
			<p class="text-xs text-gray-500">
				Accepte <code>list: string[]</code> pour des données statiques ou <code>fetch: string</code> (URL API) pour les données dynamiques.
				Le prop <code>dynamic</code> active la recherche côté serveur.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormSearch
				v-bind="bp"
				v-model="value"
				:list="list"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
