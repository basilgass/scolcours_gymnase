<script setup lang="ts">

import {onMounted} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import {useFormular} from "@/Composables/useFormular.ts"

const editMode = useStoreEditMode()

const book = useFormular()

defineProps<{
	themeId?: number
}>()


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
			:list="book.formular.value"
			:list-class="editMode.enable? 'grid grid-cols-1 gap-2': 'columns-xs space-y-4'"
			:search-function="searchFormula"
		>
			<template #card="{ item }: { item: FormulaInterface }">
				<div :class="editMode.enable?'grid grid-cols-2 gap-3': ''">
					<div v-admin="editMode.enable">
						<div class="flex">
							<FormInput
								v-model="item.block.title"
								class="flex-1"
								inline-label
								input-class="rounded-r-none"
								label="titre"
								label-class="w-[50px]"
								sm
								type="text"
								@enter="book.formula.update(item)"
							/>
							<sc-button
								type="success"
								xs
								class="rounded-l-none"
								@click="book.formula.update(item)"
							>
								<i class="bi bi-save" />
							</sc-button>
						</div>
						<FormCodearea
							v-model="item.block.body"
							inline-label
							label="body"
							label-class="w-[50px]"
							sm
						/>
					</div>
					<formula-show :formula="item" />
				</div>
			</template>
		</filtered-list>
	</article>
</template>
