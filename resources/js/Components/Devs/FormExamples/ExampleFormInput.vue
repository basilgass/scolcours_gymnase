<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import type {FormMakerBaseProps, TextInputType} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<string | number>("valeur exemple")
const type = ref<TextInputType>('text')

const inputTypes: TextInputType[] = ['text', 'id', 'email', 'password', 'number', 'color', 'range', 'date', 'datetime-local']
</script>

<template>
	<FormExampleWrapper title="FormInput">
		<template #options>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="t in inputTypes"
					:key="t"
					class="border rounded px-2 py-0.5 text-xs hover:bg-gray-200"
					:class="type === t ? 'bg-blue-200 border-blue-400' : ''"
					@click="type = t"
				>
					{{ t }}
				</button>
			</div>
		</template>

		<template #default="{ baseProps: bp }">
			<FormInput
				v-bind="bp"
				v-model="value"
				:type="type"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
