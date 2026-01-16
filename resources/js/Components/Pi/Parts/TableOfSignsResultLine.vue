<script setup lang="ts">

import {type TABLE_OF_SIGNS_VALUES} from "pimath"
import {TABLE_OF_SIGNS_COLUMNS_SIZES} from "@/Components/Pi/TableOfSigns.vue"

type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | 'm' | 'M' | '_' | 'I'
const props = defineProps<{
	label: string,
	signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	roots: string[],
	mode: 'grows' | 'curves',
	sizes: TABLE_OF_SIGNS_COLUMNS_SIZES
}>()

function extremeLabel(value: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES): string {
	switch (value) {
		case "m":
			return 'min'
		case 'M':
			return 'max'
		case '_':
			return 'replat'
		case "I":
			return "infl."
	}

	return ''
}

/**
 * Génère les classes dynamiques d'une cellule
 */
const getCellClass = (sign: string, n: number) => {
	const classes: string[] = []

	// Traits verticaux
	if (sign === 'd') classes.push('cell-v-line-d')
	else if (n % 2 === 1) classes.push('cell-v-line')

	// Largeur selon roots
	// Cas "h" avec bandes rouges
	if (sign === 'h') {
		classes.push('striped-background')
	}

	if (n === 0) classes.push(props.sizes.row.first)
	else if (n === 2 * props.roots.length) classes.push(props.sizes.row.last)
	else classes.push(props.sizes.row.middle)

	classes.push("text-center py-2 relative")
	return classes.join(' ')
}
</script>

<template>
	<tr
		class="border-t-2 border-gray-400"
	>
		<td
			v-katex.inline="`${label}`"
			class="min-w-25 border-r text-center border-gray-400"
		/>
		<td>
			<div class="flex flex-row h-16">
				<div
					v-for="(sign, n) in signs"
					:key="`tos-foot-cell-${n}`"
					:class="getCellClass(sign, n)"
				>
					<div
						v-if="n%2===1"
						v-katex.inline="`\\text{${extremeLabel(sign)}}`"
						class="text-center translate-y-6 absolute left-1/2 -translate-x-1/2 z-10"
					/>
					<i
						v-else-if="mode==='grows' && sign!=='h'"
						:class="{'bi-arrow-down-right':sign==='-','bi-arrow-up-right':sign==='+'}"
						class="bi"
					/>
					<span
						v-else-if="mode==='curves' && sign!=='h'"
						v-katex.inline="sign==='u' ? '\\cup' : '\\cap'"
					/>
				</div>
			</div>
		</td>
	</tr>
</template>
