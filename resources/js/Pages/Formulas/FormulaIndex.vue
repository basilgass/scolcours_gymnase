<script lang="ts" setup>

import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { FormulaInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { inject } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")
const editMode = useStoreEditMode()

defineProps<{
	formulas: FormulaInterface[]
}>()

function updateFormula(formula: FormulaInterface) {
	axios.patch(route("blocks.update", formula.block.id), {
		_method: "patch",
		...formula.block
	})
		.then(() => {
			flash.success("formulaire mis à jour")
		})
		.catch((error) => {
			console.log(error)
			flash.error("erreur lors de la mise à jour du formulaire")
		})
}

function searchFormula(item: FormulaInterface, value: string): boolean {
	// value is already toLowerString
	return item.block.title?.includes(value) ||
		item.block.body?.includes(value)

}
</script>

<template>
	<main class="scolcours-container">
		<article-title
			title="formulaire"
		/>

		<filtered-list
			:class="editMode.enable?'': ''"
			:filter-by-theme="(item:FormulaInterface)=>item.theme_id"
			:list="formulas"
			:list-class="editMode.enable? 'grid grid-cols-1 gap-2': 'columns-xs space-y-4'"
			:search-function="searchFormula"
		>
			<template #card="{ item }: { item: FormulaInterface }">
				<div :class="editMode.enable?'grid grid-cols-2 gap-3': ''">
					<div v-admin="editMode.enable">
						<div class="flex">
							<form-maker
								v-model="item.block.title"
								class="flex-1"
								inline-label
								input-class="rounded-r-none"
								label="titre"
								label-class="w-[50px]"
								sm
								type="text"
								@enter="updateFormula(item)"
							/>
							<button
								class="btn-success btn-xs rounded-l-none"
								@click="updateFormula(item)"
							>
								<i class="bi bi-save" />
							</button>
						</div>
						<form-maker
							v-model="item.block.body"
							inline-label
							label="body"
							label-class="w-[50px]"
							sm
							type="code"
						/>
					</div>
					<formula-show :formula="item" />
				</div>
			</template>
		</filtered-list>
	</main>
</template>

<style scoped>

</style>
