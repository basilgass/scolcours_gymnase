<script lang="ts" setup>

import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { flashInterface } from "@/types"
import { FormulaInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { inject } from "vue"

const flash = inject<flashInterface>("flash")
const props = defineProps<{
	formula: FormulaInterface
}>()

const emits = defineEmits<{
	destroy: [event: number]
}>()
function deleteFormula(){
	const id = props.formula.id
	axios.post(route('formulas.destroy', [props.formula.id]), {
		_method: "delete"
	}).then(()=>{
		flash.success('La formule a bien été supprimée.')
		emits('destroy', id)
	})
}
</script>

<template>
	<block-show
		v-theme.border="formula.theme_id"
		:block="formula.block"
		class="break-inside-avoid-column rounded-r shadow border-l-4"
	>
		<template #adminLeft>
			<div class="text-xs flex gap-3 items-baseline">
				<i class="bi bi-arrows-move draggable-handle" />
				<div class="font-code">
					F: {{ formula.id }} / B: {{ formula.block.id }}
				</div>
			</div>
		</template>
		<template #adminRight>
			<div class="flex gap-3 items-baseline">
				<InertiaLink
					class="text-xs"
					:href="route('blocks.edit', [formula.block.id])"
				>
					<i class="bi bi-pencil" />
				</InertiaLink>
				<confirm-button
					xs
					btn-class=""
					@confirm="deleteFormula"
				>
					<i class="bi bi-trash" />
					<template #confirm>
						<i class="bi bi-hand-thumbs-up" />
					</template>
				</confirm-button>
			</div>
		</template>
		<template #header>
			<div class="flex justify-between items-baseline px-5 pt-2">
				<h2
					v-if="formula.block.title"
					v-theme.text="formula.theme_id"
					class="text-xl font-extralight"
					v-katex.auto="formula.block.title"
				/>
			</div>
		</template>
	</block-show>
</template>

<style scoped>

</style>
