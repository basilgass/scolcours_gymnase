<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormVector from "@/Components/Form/FormVector.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("(1,2)")
const showOutput = ref(true)
</script>

<template>
	<FormExampleWrapper title="FormVector">
		<template #options>
			<div class="flex flex-col gap-2">
				<label class="flex items-center gap-2 text-xs cursor-pointer">
					<input
						v-model="showOutput"
						type="checkbox"
					>
					output (affiche le rendu LaTeX)
				</label>
				<p class="text-xs text-gray-500">
					Format : <code>(a,b)</code> ou <code>(a,b,c)</code>.
					Le prop <code>output</code> peut être <code>true</code> ou une chaîne avec <code>$VALUE$</code>.
				</p>
			</div>
		</template>

		<template #default="{ baseProps: bp }">
			<FormVector
				v-bind="bp"
				v-model="value"
				:output="showOutput"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
