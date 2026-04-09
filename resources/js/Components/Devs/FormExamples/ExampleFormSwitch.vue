<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref(false)
const invert = ref(false)
</script>

<template>
	<FormExampleWrapper title="FormSwitch">
		<template #options>
			<div class="flex gap-3 flex-wrap">
				<label class="flex items-center gap-2 text-xs cursor-pointer">
					<input
						v-model="invert"
						type="checkbox"
					>
					invert
				</label>
			</div>
			<p class="mt-2 text-xs text-gray-500">
				Le label accepte "actif,inactif" (séparé par une virgule) pour afficher les deux états.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormSwitch
				v-bind="bp"
				v-model="value"
				:invert="invert"
				:label="(bp.label ?? 'activé') + ',désactivé'"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
