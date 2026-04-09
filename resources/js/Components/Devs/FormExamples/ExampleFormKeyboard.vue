<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormKeyboard from "@/Components/Form/FormKeyboard.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("nb\nfrac")
const rows = ref(3)
</script>

<template>
	<FormExampleWrapper title="FormKeyboard">
		<template #options>
			<label class="flex items-center gap-2 text-xs">
				rows
				<input
					v-model.number="rows"
					class="border rounded w-12 px-1"
					type="number"
					min="1"
				>
			</label>
		</template>

		<template #default="{ baseProps: bp }">
			<FormKeyboard
				v-bind="bp"
				v-model="value"
				:rows="rows"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code whitespace-pre">{{ value }}</code>
		</template>
	</FormExampleWrapper>
</template>
