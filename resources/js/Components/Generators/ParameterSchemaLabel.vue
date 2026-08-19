<script setup lang="ts">
import {type GeneratorParameterSchemaEntry} from "@/types/challengeInterfaces.ts"

defineProps<{
	entry: GeneratorParameterSchemaEntry,
	label: string
}>()

</script>

<template>
	<div class="flex items-center gap-2 min-w-0">
		<span class="font-code font-semibold">{{ label }}</span>
		<span
			class="text-xs px-2 py-0.5 rounded"
			:class="{
				'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': entry.format === 'number',
				'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200': entry.format === 'string',
				'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200': entry.format === 'set',
				'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': entry.format === 'boolean',
			}"
		>
			{{ entry.format }} = {{ entry.default }}
		</span>
		<span
			v-if="entry.description"
			class="text-xs text-gray-600 dark:text-gray-400"
		>
			{{ entry.description }}
		</span>
	</div>
</template>
