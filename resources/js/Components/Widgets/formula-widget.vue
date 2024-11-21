<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import { FormulaInterface, WidgetInterface } from "@/types/modelInterfaces"
import axios from "axios"
import { onMounted, ref } from "vue"

const props = defineProps<{
	illustration: WidgetInterface
}>()

const formulas = ref<FormulaInterface[]>([])

onMounted(() => {
	const ids = props.illustration.code.split('\n').join(',')
	axios.get(route("formulas.multiple", [ids]))
		.then(res => {
			// Sort the value to match the id's order
			formulas.value = res.data
		})
})

</script>

<template>
	<div
		class="grid
	grid-cols-1 md:grid-cols-2 lg:grid-cols-3
	gap-5
	place-items-center"
	>
		<block-show
			v-for="formula in formulas"
			:key="formula.id"
			v-theme.border
			:block="formula.block"
			class="max-w-[400px] w-full h-full
			shadow
			border border-l-4"
			no-admin
		>
			<template #header>
				<div class="flex justify-between items-baseline px-5 pt-2">
					<h2
						v-if="formula.block.title"
						v-theme.text="formula.theme.id"
						class="text-xl font-extralight"
					>
						{{ formula.block.title }}
					</h2>
					<div
						v-admin
						class="text-xs font-code"
					>
						id: {{ formula.id }}
					</div>
				</div>
			</template>
		</block-show>
	</div>
</template>

<style scoped>

</style>
