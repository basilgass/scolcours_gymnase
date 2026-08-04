<!--
Sélecteur de formule existante à rattacher au chapitre courant (partage multi-chapitres).
Liste les formules de la bibliothèque globale en excluant celles déjà présentes dans le
chapitre. Le rattachement effectif est fait par le parent (qui a le contexte chapitre).
-->
<script lang="ts" setup>
import {computed, onMounted} from "vue"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import {useFormular} from "@/Composables/useFormular.ts"

const show = defineModel<boolean>()

const props = defineProps<{
	excludeIds: number[]
}>()

const emits = defineEmits<{
	attach: [id: number]
}>()

// Bibliothèque globale (composable sans chapitre → charge toutes les formules).
const library = useFormular()

const candidates = computed<FormulaInterface[]>(() =>
	library.formular.value.filter(f => !props.excludeIds.includes(f.id))
)

function searchFormula(item: FormulaInterface, value: string): boolean {
	return item.block.title?.toLowerCase().includes(value) ||
		item.block.body?.toLowerCase().includes(value) ||
		false
}

function pick(id: number) {
	emits("attach", id)
	show.value = false
}

onMounted(() => {
	library.load()
})
</script>

<template>
	<dialog-modal
		v-model="show"
		class="w-11/12 max-w-4xl max-h-[85vh] p-5"
	>
		<template #header>
			<h2 class="text-lg uppercase font-extralight px-1 pb-3">
				Rattacher une formule existante
			</h2>
		</template>

		<div
			v-if="library.formular.value.length === 0"
			class="grid place-items-center min-h-50"
		>
			<div class="flex flex-col gap-5 items-center">
				<div>Chargement de la bibliothèque...</div>
				<please-wait />
			</div>
		</div>

		<filtered-list
			v-else
			:filter-by-theme="(item:FormulaInterface)=>item.theme_id"
			:list="candidates"
			:search-function="searchFormula"
			list-class="grid grid-cols-1 md:grid-cols-2 gap-3"
			title="formules"
		>
			<template #card="{ item }: { item: FormulaInterface }">
				<div
					v-theme.border="item.theme_id"
					class="border-l-4 rounded-r bg-content shadow-sm p-3 flex flex-col gap-2 h-full"
				>
					<div
						v-if="item.block.title"
						v-katex.auto="item.block.title"
						class="font-extralight"
					/>
					<div class="flex flex-wrap gap-1 text-xs opacity-70">
						<span
							v-for="chapter of item.chapters"
							:key="chapter.id"
							v-katex.auto="chapter.title"
							class="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700"
						/>
						<span v-if="item.chapters.length === 0">orpheline</span>
					</div>
					<sc-button
						type="add"
						xs
						class="mt-auto"
						@click="pick(item.id)"
					>
						Rattacher
					</sc-button>
				</div>
			</template>
			<template #noItemMessage>
				Aucune formule disponible à rattacher.
			</template>
		</filtered-list>
	</dialog-modal>
</template>
