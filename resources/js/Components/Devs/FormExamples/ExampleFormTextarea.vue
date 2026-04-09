<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("Ceci est un exemple\nde textarea multi-lignes.")
const catchTab = ref(true)
const rows = ref(4)
</script>

<template>
	<FormExampleWrapper title="FormTextarea">
		<template #options>
			<div class="flex gap-4 flex-wrap items-center">
				<label class="flex items-center gap-2 text-xs cursor-pointer">
					<input
						v-model="catchTab"
						type="checkbox"
					>
					catchTab
				</label>
				<label class="flex items-center gap-2 text-xs">
					rows
					<input
						v-model.number="rows"
						class="border rounded w-12 px-1"
						type="number"
						min="1"
					>
				</label>
			</div>
		</template>

		<template #default="{ baseProps: bp }">
			<FormTextarea
				v-bind="bp"
				v-model="value"
				:catch-tab="catchTab"
				:rows="rows"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code whitespace-pre">{{ value }}</code>
		</template>
	</FormExampleWrapper>
</template>
