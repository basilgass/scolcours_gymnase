<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormNumberSet from "@/Components/Form/FormNumberSet.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("1,3-5,9")
const values = ref<number[]>([])
const showOutput = ref(true)
</script>

<template>
	<FormExampleWrapper title="FormNumberSet">
		<template #options>
			<div class="flex flex-col gap-2">
				<label class="flex items-center gap-2 text-xs cursor-pointer">
					<input
						v-model="showOutput"
						type="checkbox"
					>
					output (affiche l'ensemble en LaTeX)
				</label>
				<p class="text-xs text-gray-500">
					Syntaxe type "pages d'impression" : <code>1,3-5,9</code> → <code>[1,3,4,5,9]</code>.
					Pour les négatifs, utiliser <code>..</code> (ex: <code>-5..-2</code>).
					Au-delà de 12 éléments, l'output est tronqué avec le cardinal.
				</p>
			</div>
		</template>

		<template #default="{ baseProps: bp }">
			<FormNumberSet
				v-bind="bp"
				v-model="value"
				:output="showOutput"
				@update="values = $event as number[]"
			/>
		</template>

		<template #value>
			<div class="flex flex-col gap-1">
				<code class="text-xs font-code">v-model (string brute) : {{ JSON.stringify(value) }}</code>
				<code class="text-xs font-code">@update (number[]) : {{ JSON.stringify(values) }}</code>
			</div>
		</template>
	</FormExampleWrapper>
</template>