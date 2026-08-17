<script setup lang="ts">
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import SeoEditModal from "@/Components/Seo/SeoEditModal.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {computed, type PropType, ref} from "vue"
import {
	filterRows,
	MODEL_LABELS,
	rowKey,
	rowStatus,
	type SeoRow,
	type SeoStatus,
	type SortDir,
	type SortKey,
	sortRows,
	SOURCE_LABELS,
	type SourceFilter,
	STATUS_LABELS,
	type StatusFilter,
	WEAK_THRESHOLD,
} from "@/Composables/seoAudit.ts"

defineOptions({layout: LayoutAdmin})

const props = defineProps({
	rows: {type: Array as PropType<SeoRow[]>, required: true},
})

// Copie locale mutable : les props Inertia sont en lecture seule, mais on patche
// la ligne éditée après sauvegarde sans recharger toute la page (filtres/tri préservés).
const allRows = ref<SeoRow[]>([...props.rows])

const editingRow = ref<SeoRow | null>(null)
const showEditModal = ref(false)

function openEdit(row: SeoRow): void {
	editingRow.value = row
	showEditModal.value = true
}

function onSaved(updated: SeoRow): void {
	const index = allRows.value.findIndex(
		(row) => row.type === updated.type && row.metable_id === updated.metable_id,
	)
	if (index !== -1) {
		allRows.value[index] = updated
	}
}

const statusFilter = ref<StatusFilter>("all")
const typeFilter = ref("all")
const sourceFilter = ref<SourceFilter>("all")
const urlFilter = ref("")
const titleFilter = ref("")
const descriptionFilter = ref("")
const maxLengthFilter = ref("")
const sortKey = ref<SortKey>("length")
const sortDir = ref<SortDir>("asc")

const statusChoices = ["all", "empty", "weak", "ok"]
const sourceChoices = ["all", "template", "block", "body", "override"]

// Types dérivés des lignes présentes (un nouveau modèle dans le sitemap apparaît tout seul).
const typeChoices = computed<string[]>(() => [
	"all",
	...Array.from(new Set(allRows.value.map((row) => row.type))).sort(),
])

const statusLabel = (value: unknown): string => STATUS_LABELS[value as StatusFilter] ?? String(value)
const sourceLabel = (value: unknown): string => SOURCE_LABELS[value as string] ?? String(value)
const typeLabel = (value: unknown): string => MODEL_LABELS[value as string] ?? String(value)

const maxLength = computed<number | null>(() => {
	const parsed = Number(maxLengthFilter.value)
	return maxLengthFilter.value === "" || Number.isNaN(parsed) ? null : parsed
})

const visibleRows = computed<SeoRow[]>(() =>
	sortRows(
		filterRows(allRows.value, {
			url:         urlFilter.value,
			title:       titleFilter.value,
			description: descriptionFilter.value,
			type:        typeFilter.value,
			source:      sourceFilter.value,
			status:      statusFilter.value,
			maxLength:   maxLength.value,
		}),
		sortKey.value,
		sortDir.value,
	),
)

function toggleSort(key: SortKey): void {
	if (sortKey.value === key) {
		sortDir.value = sortDir.value === "asc" ? "desc" : "asc"
		return
	}
	sortKey.value = key
	sortDir.value = "asc"
}

function sortIndicator(key: SortKey): string {
	if (sortKey.value !== key) {
		return ""
	}
	return sortDir.value === "asc" ? " ▲" : " ▼"
}

const STATUS_META: Record<SeoStatus, {label: string; dot: string; row: string}> = {
	empty: {label: "vide", dot: "bg-red-500", row: "bg-red-50 dark:bg-red-950/40"},
	weak:  {label: "courte", dot: "bg-amber-500", row: "bg-amber-50 dark:bg-amber-950/40"},
	ok:    {label: "ok", dot: "bg-emerald-500", row: ""},
}
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Audit SEO</h1>
		<p class="mb-4 text-sm text-gray-500">
			Titres et descriptions résolus pour chaque URL du sitemap. En rouge : description
			vide (à corriger en priorité). En orange : description présente mais trop courte
			(moins de {{ WEAK_THRESHOLD }} caractères).
		</p>

		<p class="mb-2 text-sm text-gray-500">
			{{ visibleRows.length }} / {{ allRows.length }} lignes affichées
		</p>

		<table class="w-full text-sm border-collapse">
			<thead>
				<tr class="text-left border-b">
					<th class="py-2 pr-4">Statut</th>
					<th class="py-2 pr-4 cursor-pointer select-none" @click="toggleSort('url')">
						URL{{ sortIndicator("url") }}
					</th>
					<th class="py-2 pr-4 cursor-pointer select-none" @click="toggleSort('title')">
						Titre{{ sortIndicator("title") }}
					</th>
					<th class="py-2 pr-4">Description</th>
					<th class="py-2 pr-4 cursor-pointer select-none" @click="toggleSort('type')">
						Type{{ sortIndicator("type") }}
					</th>
					<th class="py-2 pr-4 cursor-pointer select-none" @click="toggleSort('source')">
						Source{{ sortIndicator("source") }}
					</th>
					<th class="py-2 pr-4 cursor-pointer select-none" @click="toggleSort('length')">
						Long.{{ sortIndicator("length") }}
					</th>
					<th class="py-2 pr-4">Actions</th>
				</tr>
				<tr class="border-b align-top">
					<th class="py-2 pr-4 font-normal">
						<FormSelect
							v-model="statusFilter"
							:choices="statusChoices"
							:label-map="statusLabel"
							xs
						/>
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormInput v-model="urlFilter" :icon="false" clearable xs />
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormInput v-model="titleFilter" :icon="false" clearable xs />
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormInput v-model="descriptionFilter" :icon="false" clearable xs />
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormSelect
							v-model="typeFilter"
							:choices="typeChoices"
							:label-map="typeLabel"
							xs
						/>
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormSelect
							v-model="sourceFilter"
							:choices="sourceChoices"
							:label-map="sourceLabel"
							xs
						/>
					</th>
					<th class="py-2 pr-4 font-normal">
						<FormInput
							v-model="maxLengthFilter"
							type="number"
							:icon="false"
							prepend="≤"
							clearable
							xs
						/>
					</th>
					<th class="py-2 pr-4" />
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in visibleRows"
					:key="rowKey(row)"
					class="border-b align-top"
					:class="STATUS_META[rowStatus(row)].row"
				>
					<td class="py-2 pr-4">
						<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
							<span
								class="inline-block w-2 h-2 rounded-full"
								:class="STATUS_META[rowStatus(row)].dot"
							/>
							{{ STATUS_META[rowStatus(row)].label }}
						</span>
					</td>
					<td class="py-2 pr-4">
						<a :href="row.url" class="text-blue-600 hover:underline" target="_blank">
							{{ row.url }}
						</a>
					</td>
					<td class="py-2 pr-4">{{ row.title }}</td>
					<td class="py-2 pr-4">{{ row.description }}</td>
					<td class="py-2 pr-4 whitespace-nowrap">{{ typeLabel(row.type) }}</td>
					<td class="py-2 pr-4">{{ row.source }}</td>
					<td class="py-2 pr-4">{{ row.length }}</td>
					<td class="py-2 pr-4">
						<ScButton
							v-if="row.type !== 'static'"
							type="edit"
							xs
							@click="openEdit(row)"
						>
							éditer
						</ScButton>
					</td>
				</tr>
			</tbody>
		</table>

		<SeoEditModal
			v-model="showEditModal"
			:row="editingRow"
			@saved="onSaved"
		/>
	</div>
</template>
