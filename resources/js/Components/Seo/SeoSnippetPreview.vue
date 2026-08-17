<script lang="ts" setup>
import {computed} from "vue"
import {previewDescription, PREVIEW_MAX_LENGTH} from "@/Composables/seoAudit.ts"

/**
 * Aperçu « rendu Google » d'une méta SEO : titre bleu, URL verte, description
 * grise tronquée, avec le décompte de caractères. Purement présentationnel
 * (aucune route, aucun store) → montable en isolation.
 */
const props = defineProps<{
	title: string
	url: string
	description: string
}>()

const preview = computed<string>(() => previewDescription(props.description))
const length = computed<number>(() => props.description.trim().length)
const overLimit = computed<boolean>(() => length.value > PREVIEW_MAX_LENGTH)
</script>

<template>
	<div class="rounded border p-3 bg-white dark:bg-slate-900 max-w-xl">
		<div class="text-green-700 dark:text-green-500 text-xs truncate">
			{{ url }}
		</div>
		<div class="text-blue-700 dark:text-blue-400 text-lg leading-tight truncate">
			{{ title }}
		</div>
		<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
			{{ preview }}
		</p>
		<p
			class="text-xs mt-2"
			:class="overLimit ? 'text-red-600' : 'text-gray-400'"
		>
			{{ length }} / {{ PREVIEW_MAX_LENGTH }} caractères
		</p>
	</div>
</template>
