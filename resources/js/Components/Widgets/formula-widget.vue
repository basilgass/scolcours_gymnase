<script
	lang="ts"
	setup
>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {FormulaInterface, WidgetPropsInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {computed, onMounted, ref} from "vue"
import {AxiosErrorMessage} from "@/types"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const formulas = ref<FormulaInterface[]>([])

const grid = computed(() => {
	if (formulas.value.length <= 1) return 'grid gap-3 grid-cols-1'

	return 'grid gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
})

onMounted(() => {
	// props.illustrations.code is like:
	// <id1>[,some parameters]
	// <id2>[,some parameters]
	// <id3>[,some parameters]
	const ids = props.illustration.code
		.split('\n')
		.map(line => line.split(',')[0])
		.map(Number)

	axios.get(route("api.formulas.index", {
		ids: ids
	}))
		.then(res => {
			// Sort the value to match the id's order
			formulas.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
})

</script>

<template>
	<div
		:class="[
			grid,
			'gap-5 place-items-center'
		]"
	>
		<block-show
			v-for="formula in formulas"
			:key="formula.id"
			v-theme.border
			:block="formula.block"
			class="w-full h-full
			shadow
			border border-l-4"
			no-admin
		>
			<template #header>
				<div class="flex justify-between items-baseline px-5 pt-2">
					<h2
						v-if="formula.block.title"
						v-theme.text="formula.theme_id"
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


