<script setup lang="ts">

import {type TABLE_OF_SIGNS_VALUES} from "pimath"
import {TABLE_OF_SIGNS_COLUMNS_SIZES} from "@/Components/Pi/TableOfSigns.vue"

type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | 'm' | 'M' | '_' | 'I'

const props = defineProps<{
	label: string,
	signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	roots: string[],
	sizes: TABLE_OF_SIGNS_COLUMNS_SIZES
}>()

function getCellClass(sign: string, n: number): string {
	const classes: string[] = []

	// Traits verticaux
	if (sign === 'd') classes.push('cell-v-line-d')
	if (n % 2 === 1) classes.push('cell-v-line')

	// Cas "h" avec bandes rouges
	if (sign === 'h') {
		classes.push('striped-background')
	}

	if (n === 0) classes.push(props.sizes.row.first)
	else if (n === 2 * props.roots.length) classes.push(props.sizes.row.last)
	else classes.push(props.sizes.row.middle)

	classes.push('text-center py-2')

	return classes.join(' ')
}
</script>

<template>
	<tr
		class="border-t-2 border-gray-400 "
	>
		<td
			v-katex.inline="`${label}`"
			class="min-w-25 border-r text-center border-gray-400"
		/>
		<td>
			<div class="flex flex-row">
				<div
					v-for="(sign, n) in signs"
					:key="`tos-foot-cell-${n}`"
					v-katex.inline="n%2===0?(sign==='h'?'':sign):(sign==='z'?'0':'')"
					:class="getCellClass(sign, n)"
				/>
			</div>
		</td>
	</tr>
</template>
