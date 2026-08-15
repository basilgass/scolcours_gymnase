<script setup lang="ts">
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import {PropType} from "vue"

interface SeoRow {
	url: string
	title: string
	description: string
	source: string
	length: number
}

defineOptions({layout: LayoutAdmin})

defineProps({
	rows: {type: Array as PropType<SeoRow[]>, required: true},
})

function isWeak(row: SeoRow): boolean {
	return row.length === 0 || row.length < 50
}
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Audit SEO</h1>
		<p class="mb-4 text-sm text-gray-500">
			Titres et descriptions résolus pour chaque URL du sitemap. Les lignes
			signalées ont une description vide ou trop courte.
		</p>

		<table class="w-full text-sm border-collapse">
			<thead>
				<tr class="text-left border-b">
					<th class="py-2 pr-4">URL</th>
					<th class="py-2 pr-4">Titre</th>
					<th class="py-2 pr-4">Description</th>
					<th class="py-2 pr-4">Source</th>
					<th class="py-2 pr-4">Long.</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in rows"
					:key="row.url"
					class="border-b align-top"
					:class="{'bg-red-50': isWeak(row)}"
				>
					<td class="py-2 pr-4">
						<a :href="row.url" class="text-blue-600 hover:underline" target="_blank">
							{{ row.url }}
						</a>
					</td>
					<td class="py-2 pr-4">{{ row.title }}</td>
					<td class="py-2 pr-4">{{ row.description }}</td>
					<td class="py-2 pr-4">{{ row.source }}</td>
					<td class="py-2 pr-4">{{ row.length }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
