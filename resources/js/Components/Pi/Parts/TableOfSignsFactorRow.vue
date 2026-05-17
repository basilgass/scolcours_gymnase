<script setup lang="ts">

import {type TABLE_OF_SIGNS_VALUES} from "pimath"
import {TABLE_OF_SIGNS_COLUMNS_SIZES} from "@/Components/Pi/TableOfSigns.vue"
import {computed} from "vue"

type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | 'm' | 'M' | '_' | 'I' | 't'

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
	else if (n % 2 === 0) classes.push(props.sizes.row.even)
	else classes.push(props.sizes.row.odd)

	classes.push('text-center py-2')

	return classes.join(' ')
}

const cellText = computed(() => {
	return props.signs.map((sign, n) => getCellText(sign, n))
})

function getCellText(sign, n) {
	if (sign === 't') return ''

	if (n % 2 === 0) return sign === 'h' ? '' : sign

	return sign === 'z' ? '0' : ''
}

const cellClasses = computed(() => {
	return props.signs.map((sign, n) => getCellClass(sign, n))
})
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
			<div class="flex flex-row min-h-10">
				<div
					v-for="(sign, n) in cellText"
					:key="`tos-foot-cell-${n}`"
					v-katex.inline="sign"
					:data-tos="`sign-${n}`"
					:class="cellClasses[n]"
					class="self-stretch"
				/>
			</div>
		</td>
	</tr>
</template>
