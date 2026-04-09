<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormTeam from "@/Components/Form/FormTeam.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import type {TeamInterface} from "@/types/modelInterfaces.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<TeamInterface | undefined>(undefined)
</script>

<template>
	<FormExampleWrapper title="FormTeam">
		<template #options>
			<p class="text-xs text-gray-500">
				Charge les équipes via <code>api.admin.teams.index</code>. Affiche des boutons pour sélectionner une équipe.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormTeam
				v-bind="bp"
				v-model="value"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value?.id) }}</code>
		</template>
	</FormExampleWrapper>
</template>
