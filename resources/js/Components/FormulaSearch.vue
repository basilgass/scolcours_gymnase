<script setup lang="ts">

import {computed, onMounted, ref} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import {useFormular} from "@/Composables/useFormular.ts"
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"

const editMode = useStoreEditMode()

const book = useFormular()

defineProps<{
	themeId?: number
}>()

// Filtre « orphelines seulement » : formules rattachées à aucun chapitre.
const orphansOnly = ref(false)

const visibleFormulas = computed<FormulaInterface[]>(() =>
	orphansOnly.value
		? book.formular.value.filter(f => f.chapters.length === 0)
		: book.formular.value
)

function searchFormula(item: FormulaInterface, value: string): boolean {
	// value is already toLowerString
	return item.block.title?.includes(value) ||
		item.block.body?.includes(value)
}

onMounted(async () => {
	book.load()
})

</script>
<template>
	<article>
		<div
			v-if="book.formular.value.length===0"
			class="grid place-items-center min-h-50"
		>
			<div class="flex flex-col gap-5">
				<div>Chargement du formulaire...</div>
				<please-wait />
			</div>
		</div>

		<filtered-list
			v-else
			:filter-by-theme="(item:FormulaInterface)=>item.theme_id"
			:filter-by-theme-on-load="themeId"
			:list="visibleFormulas"
			list-class="columns-xs space-y-4"
			:search-function="searchFormula"
		>
			<template #button>
				<sc-button
					v-admin
					:outline="!orphansOnly"
					type="warning"
					xs
					@click="orphansOnly = !orphansOnly"
				>
					<i class="bi bi-unlink" />
					orphelines
				</sc-button>
			</template>

			<template #card="{ item }: { item: FormulaInterface }">
				<div class="break-inside-avoid-column">
					<div
						v-if="item.chapters.length === 0"
						v-admin
						class="flex items-center justify-between gap-2
								px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/40
								text-amber-800 dark:text-amber-200 rounded-t"
					>
						<span class="flex items-center gap-1">
							<i class="bi bi-unlink" />
							orpheline — rattachée à aucun chapitre
						</span>
						<confirm-button
							xs
							@confirm="book.formula.deleteOrphan(item.id)"
						>
							<i class="bi bi-trash" />
							<template #confirm>
								<i class="bi bi-hand-thumbs-up" />
							</template>
						</confirm-button>
					</div>
					<formula-show
						:formula="item"
						library
					/>
				</div>
			</template>
		</filtered-list>
	</article>
</template>
