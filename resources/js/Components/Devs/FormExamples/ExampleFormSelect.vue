<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<string>("")

const choices = ['rouge', 'vert', 'bleu', 'jaune', 'violet']
</script>

<template>
	<FormExampleWrapper title="FormSelect">
		<template #options>
			<p class="text-xs text-gray-500">
				Accepts <code>choices: string[]</code> or <code>Record&lt;string, string&gt;</code>.
				An optional <code>labelMap</code> function transforms the display label.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormSelect
				v-bind="bp"
				v-model="value"
				:choices="choices"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
