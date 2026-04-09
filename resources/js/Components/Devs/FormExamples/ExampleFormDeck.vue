<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormDeck from "@/Components/Form/FormDeck.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import type {DeckInterface} from "@/types/modelInterfaces.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<DeckInterface | undefined>(undefined)
</script>

<template>
	<FormExampleWrapper title="FormDeck">
		<template #options>
			<p class="text-xs text-gray-500">
				Charge les decks via <code>api.decks.index</code>. Le prop optionnel <code>theme</code> peut filtrer les résultats.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormDeck
				v-bind="bp"
				v-model="value"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value?.id) }}</code>
		</template>
	</FormExampleWrapper>
</template>
