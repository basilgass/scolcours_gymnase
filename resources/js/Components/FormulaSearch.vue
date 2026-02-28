<script setup lang="ts">

import {onMounted, ref} from "vue"
import {AxiosResponseModel} from "@/types"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()
const editMode = useStoreEditMode()

const formulas = ref<FormulaInterface[]>([])

defineProps<{
	themeId?: number
}>()

function updateFormula(formula: FormulaInterface) {
	axios.patch(route("api.admin.blocks.update", formula.block.id), {
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

onMounted(() => {
	axios.get(route('api.formulas.index'))
		.then((res: AxiosResponseModel<FormulaInterface[]>) => {
			formulas.value = res.data
		})
})

</script>
<template>
	<article>
		<div
			v-if="formulas.length===0"
			class="grid place-items-center min-h-50"
		>
			<div class="flex flex-col gap-5">
				<div>Chargement du formulaire...</div>
				<please-wait />
			</div>
		</div>

		<filtered-list
			v-else
			:class="editMode.enable?'': ''"
			:filter-by-theme="(item:FormulaInterface)=>item.theme_id"
			:filter-by-theme-on-load="themeId"
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
							<sc-button
								type="success"
								xs
								class="rounded-l-none"
								@click="updateFormula(item)"
							>
								<i class="bi bi-save" />
							</sc-button>
						</div>
						<form-maker
							v-model="item.block.body"
							inline-label
							label="body"
							label-class="w-[50px]"
							sm
							type="codearea"
						/>
					</div>
					<formula-show :formula="item" />
				</div>
			</template>
			<template #noItemMessage v-if="themeId!==undefined">
				<sc-button type="primary" @click="">
					Charger tout le formulaire
				</sc-button>
			</template>
		</filtered-list>
	</article>
</template>
