<script setup lang="ts">
import {inject, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const props = defineProps<{
	title: string
}>()

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const showOptions = ref(false)
</script>

<template>
	<Card>
		<template #header>
			<div class="flex justify-between items-center">
				<span class="font-code text-sm font-semibold">{{ title }}</span>
				<button
					v-if="$slots.options"
					class="text-xs text-gray-500 hover:text-gray-800 border rounded px-2 py-0.5"
					@click="showOptions = !showOptions"
				>
					{{ showOptions ? 'masquer options' : 'options' }}
				</button>
			</div>
		</template>

		<div
			v-if="$slots.options && showOptions"
			class="mb-4 p-3 bg-gray-50 rounded border text-sm"
		>
			<slot
				name="options"
				:base-props="baseProps"
			/>
		</div>

		<slot :base-props="baseProps" />

		<template
			v-if="$slots.value"
			#footer
		>
			<slot name="value" />
		</template>
	</Card>
</template>
