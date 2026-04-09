<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormTheme from "@/Components/Form/FormTheme.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref<string | number>("")
const themeKey = ref<'id' | 'title'>('id')
</script>

<template>
	<FormExampleWrapper title="FormTheme">
		<template #options>
			<div class="flex gap-3 items-center">
				<span class="text-xs">themeKey :</span>
				<button
					v-for="k in ['id', 'title']"
					:key="k"
					class="border rounded px-2 py-0.5 text-xs hover:bg-gray-200"
					:class="themeKey === k ? 'bg-blue-200 border-blue-400' : ''"
					@click="themeKey = k as 'id' | 'title'"
				>
					{{ k }}
				</button>
			</div>
			<p class="mt-2 text-xs text-gray-500">
				Utilise <code>$page.props.themes</code> injecté par Inertia. <code>themeKey</code> détermine quelle propriété du thème est stockée.
			</p>
		</template>

		<template #default="{ baseProps: bp }">
			<FormTheme
				v-bind="bp"
				v-model="value"
				:theme-key="themeKey"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code">{{ JSON.stringify(value) }}</code>
		</template>
	</FormExampleWrapper>
</template>
