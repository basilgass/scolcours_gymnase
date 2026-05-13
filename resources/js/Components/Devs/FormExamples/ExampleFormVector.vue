<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormVector from "@/Components/Form/FormVector.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import type {Vector} from "pimath"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("(2/3;5)")
const vector = ref<Vector | null>(null)
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
					Format : <code>(a;b)</code> ou <code>(a;b;c)</code> — séparateurs <code>,</code> ou <code>;</code> acceptés.
					<code>@update</code> émet une instance pimath <code>Vector</code> (ou <code>null</code> si invalide).
					Le prop <code>output</code> peut être <code>true</code> ou une chaîne avec <code>$VALUE$</code>.
				</p>
			</div>
		</template>

		<template #default="{ baseProps: bp }">
			<FormVector
				v-bind="bp"
				v-model="value"
				:output="showOutput"
				@update="vector = $event as Vector | null"
			/>
		</template>

		<template #value>
			<div class="flex flex-col gap-1">
				<code class="text-xs font-code">v-model (string brute) : {{ JSON.stringify(value) }}</code>
				<code class="text-xs font-code">@update (Vector|null) : {{ vector === null ? 'null' : vector.display }}</code>
			</div>
		</template>
	</FormExampleWrapper>
</template>