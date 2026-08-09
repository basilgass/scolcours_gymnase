<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("Ceci est un exemple\nde textarea multi-lignes.")
const catchTab = ref(true)
const rows = ref(4)
const fill = ref(false)
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
				<label class="flex items-center gap-2 text-xs cursor-pointer">
					<input
						v-model="fill"
						type="checkbox"
					>
					fill
				</label>
			</div>
			<p class="text-xs text-gray-500">
				fill : le textarea occupe toute la hauteur disponible du parent flex (ignore rows).
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<div :class="fill ? 'h-48 flex' : ''">
				<FormTextarea
					v-bind="bp"
					v-model="value"
					:catch-tab="catchTab"
					:rows="rows"
					:fill="fill"
					class="flex-1"
				/>
			</div>
		</template>

		<template #value>
			<code class="text-xs font-code whitespace-pre">{{ value }}</code>
		</template>
	</FormExampleWrapper>
</template>
