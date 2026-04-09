<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormChapter from "@/Components/Form/FormChapter.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import type {ChapterInterface} from "@/types/modelInterfaces.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<ChapterInterface | undefined>(undefined)
</script>

<template>
	<FormExampleWrapper title="FormChapter">
		<template #options>
			<p class="text-xs text-gray-500">
				Sélecteur de chapitre : charge d'abord un thème via <code>FormTheme</code>, puis propose les chapitres correspondants via l'API.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormChapter
				v-bind="bp"
				v-model="value"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value?.id) }}</code>
		</template>
	</FormExampleWrapper>
</template>
