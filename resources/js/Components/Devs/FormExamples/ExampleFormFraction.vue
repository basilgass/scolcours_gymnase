<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormFraction from "@/Components/Form/FormFraction.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("3/4")
</script>

<template>
	<FormExampleWrapper title="FormFraction">
		<template #options>
			<p class="text-xs text-gray-500">
				Format attendu : <code>a/b</code>. Validation automatique via pimath <code>Fraction</code>.
				Les divisions par zéro sont détectées et signalées.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormFraction
				v-bind="bp"
				v-model="value"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
