<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormFraction from "@/Components/Form/FormFraction.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import type {Fraction} from "pimath"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("3/4")
const fraction = ref<Fraction | null>(null)

</script>

<template>
	<FormExampleWrapper title="FormFraction">
		<template #options>
			<p class="text-xs text-gray-500">
				Format attendu : <code>a/b</code>. Validation automatique via pimath <code>Fraction</code>.
				<code>@update</code> émet une <code>Fraction</code> (ou <code>null</code> si invalide / division par
				zéro).
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormFraction
				v-bind="bp"
				v-model="value"
				@update="fraction = $event as Fraction | null"
			/>
		</template>

		<template #value>
			<div class="flex flex-col gap-1">
				<code class="text-xs font-code">v-model (string brute) : {{ JSON.stringify(value) }}</code>
				<code class="text-xs font-code">@update (Fraction|null) : {{
					fraction === null ? 'null' : fraction.tex
				}}</code>
			</div>
		</template>
	</FormExampleWrapper>
</template>
