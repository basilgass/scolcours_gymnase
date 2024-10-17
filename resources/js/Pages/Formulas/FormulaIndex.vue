<script lang="ts" setup>

import BlockShow from "@/Components/Blocks/BlockShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import type { FormulaInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { inject, PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")

const props = defineProps({
	"formulas": {
		type: Object as PropType<FormulaInterface[]>,
		required: true
	},
})

const theFormulas = ref(props.formulas)

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

</script>

<template>
	<div>
		<h1>Formular</h1>

		<div class="grid grid-cols-1 gap-5">
			<div
				v-for="formula in theFormulas"
				:key="formula.id"
				class="grid grid-cols-2 gap-3"
			>
				<div>
					<div class="flex">
						<form-maker
							v-model="formula.block.title"
							class="flex-1"
							inline-label
							input-class="rounded-r-none"
							label="titre"
							label-class="w-[50px]"
							sm
							type="text"
							@enter="updateFormula(formula)"
						/>
						<button
							class="btn-success btn-xs rounded-l-none"
							@click="updateFormula(formula)"
						>
							<i class="bi bi-save" />
						</button>
					</div>
					<form-maker
						v-model="formula.block.body"
						inline-label
						label="body"
						label-class="w-[50px]"
						sm
						type="code"
					/>
				</div>
				<block-show
					:block="formula.block"
					class="rounded-r shadows border-l-4"
					v-theme.border="formula.chapter.theme.id"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
