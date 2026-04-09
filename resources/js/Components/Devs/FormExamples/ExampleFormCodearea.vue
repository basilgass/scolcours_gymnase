<script setup lang="ts">
import {inject, ref} from "vue"
import FormExampleWrapper from "./FormExampleWrapper.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import type {FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"

const baseProps = inject<FormMakerBaseProps>('formBaseProps', {})

const value = ref("f(x) = \\frac{x^2 + 1}{2}")
const language = ref<"latex" | "json" | "javascript">('latex')
const rows = ref(4)
const autoSize = ref(false)
const resizeable = ref(false)
const wrap = ref(true)

const languages: Array<"latex" | "json" | "javascript"> = ['latex', 'json', 'javascript']
</script>

<template>
	<FormExampleWrapper title="FormCodearea">
		<template #options>
			<div class="flex flex-col gap-3">
				<div class="flex flex-wrap gap-2">
					<button
						v-for="l in languages"
						:key="l"
						class="border rounded px-2 py-0.5 text-xs hover:bg-gray-200"
						:class="language === l ? 'bg-blue-200 border-blue-400' : ''"
						@click="language = l"
					>
						{{ l }}
					</button>
				</div>
				<div class="flex gap-4 flex-wrap items-center">
					<label class="flex items-center gap-2 text-xs">
						rows
						<input
							v-model.number="rows"
							class="border rounded w-12 px-1"
							type="number"
							min="1"
						>
					</label>
					<label class="flex items-center gap-2 text-xs cursor-pointer">
						<input
							v-model="autoSize"
							type="checkbox"
						>
						autoSize
					</label>
					<label class="flex items-center gap-2 text-xs cursor-pointer">
						<input
							v-model="resizeable"
							type="checkbox"
						>
						resizeable
					</label>
					<label class="flex items-center gap-2 text-xs cursor-pointer">
						<input
							v-model="wrap"
							type="checkbox"
						>
						wrap
					</label>
				</div>
			</div>
		</template>

		<template #default>
			<FormCodearea
				v-model="value"
				:language="language"
				:rows="rows"
				:auto-size="autoSize"
				:resizeable="resizeable"
				:wrap="wrap"
			/>
		</template>

		<template #value>
			<code class="text-xs font-code whitespace-pre">{{ value }}</code>
		</template>
	</FormExampleWrapper>
</template>
