<script lang="ts" setup>

import BlockShow from "@/Components/Blocks/BlockShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import type { FormulaInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { inject, PropType } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")
const editMode = useStoreEditMode()

defineProps({
	"formulas": {
		type: Object as PropType<FormulaInterface[]>,
		required: true
	}
})

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

function searchFormula(item:FormulaInterface, value: string): boolean {
	// value is already toLowerString
	return item.block.title?.includes(value) ||
		item.block.body?.includes(value)

}
</script>

<template>
	<main class="scolcours-container">
		<h1>formulaire</h1>

		<filtered-list
			:class="editMode.enable?'': ''"
			:list="formulas"
			:filter-by-theme="(item:FormulaInterface)=>item.chapter.theme.slug"
			:search-function="searchFormula"
			:list-class="editMode.enable? 'grid grid-cols-1 gap-2': 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:md:grid-cols-3'"
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
					<block-show
						v-theme.border="item.chapter.theme.id"
						:block="item.block"
						class="rounded-r shadows border-l-4"
					>
						<template #header>
							<div class="flex justify-between items-baseline px-5 pt-2">
								<h2
									v-if="item.block.title"
									v-theme.text="item.chapter.theme.id"
									class="text-xl font-extralight"
								>
									{{ item.block.title }}
								</h2>
								<div
									v-admin
									class="text-xs font-code"
								>
									id: {{ item.id }}
								</div>
							</div>
						</template>
					</block-show>
				</div>
			</template>
		</filtered-list>
	</main>
</template>

<style scoped>

</style>
