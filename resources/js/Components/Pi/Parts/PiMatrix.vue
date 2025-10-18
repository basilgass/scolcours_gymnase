<script lang="ts" setup>

import {Polynom} from "pimath"
import {ref} from "vue"

const props = withDefaults(defineProps<{
		matrix: (Polynom | string)[][],
		dimension: number | null,
		selectionMode?: false | 'rows' | 'columns' | 'item',
		augmented?: boolean,
	}>(),
	{
		selectionMode: false,
		augmented: false
	})

const target = defineModel<number>('target', {default: null})
const reference = defineModel<number>('reference', {default: null})
const aij = defineModel<{ row: number, column: number }>('aij', {default: null})

const hoverItem = ref("")

function onRowSelection(index: number) {
	if (props.selectionMode !== 'rows') {
		return
	}

	if (target.value === null) {
		target.value = index
	} else if (target.value === index) {
		target.value = null
	} else if (reference.value === index) {
		reference.value = null
	} else {
		reference.value = index
	}
}

function onColumnSelection(index: number) {
	if (props.selectionMode !== 'columns') {
		return
	}

	if (target.value === null) {
		target.value = index
	} else if (target.value === index) {
		target.value = null
	} else if (reference.value === index) {
		reference.value = null
	} else {
		reference.value = index
	}
}

function onItemSelection(rowIndex: number, colIndex: number) {
	if (props.selectionMode === 'rows') {
		return onRowSelection(rowIndex)
	}

	if (props.selectionMode === 'columns') {
		return onColumnSelection(colIndex)
	}

	if (aij.value !== null && aij.value.row === rowIndex && aij.value.column === colIndex) {
		aij.value = null
		return
	}

	aij.value = {row: rowIndex, column: colIndex}
}
</script>

<template>
	<div class="relative inline-block min-h-[6rem] min-w-[100px] mb-4">
		<svg
			class="absolute left-[-30px] h-full"
			preserveAspectRatio="none"
			viewBox="0 0 20 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18,0 C5,10 5,90 18,100"
				fill="transparent"
				stroke="currentColor"
				stroke-width="1"
			/>
		</svg>

		<!-- Parenthèse droite -->
		<svg
			class="absolute right-[-30px] h-full"
			preserveAspectRatio="none"
			viewBox="0 0 20 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2,0 C15,10 15,90 2,100"
				fill="transparent"
				stroke="currentColor"
				stroke-width="1"
			/>
		</svg>

		<!-- info hover -->
		<div
			v-katex.inline="hoverItem"
			class="absolute left-[50%] translate-x-[-50%] -bottom-4 text-xs"
		/>

		<!-- Version tableau -->
		<table>
			<tr
				v-for="(row, rowIndex) in matrix"
				:key="`row-${rowIndex}`"
			>
				<td
					v-for="(item, colIndex) in row"
					:key="`a_${rowIndex}${colIndex}`"
					v-katex.inline="(typeof item==='string')?item:item?.tex?? '?'"
					:class="{
						'border-l border-red-500 px-2': colIndex===dimension,
						'outline bg-green-300/50 outline-green-600 rounded-xl': (selectionMode==='item' && aij?.row===rowIndex && aij?.column===colIndex),
						'bg-green-300/50 dark:bg-green-800': (selectionMode==='rows' && rowIndex===target) || (selectionMode==='columns' && colIndex===target),
						'bg-blue-300/50 dark:bg-blue-800': (selectionMode==='rows' && rowIndex===reference) || (selectionMode==='columns' && colIndex===reference),
						'border-l': colIndex === matrix[0].length-1,
					}"
					class="min-w-20 py-2 text-center cursor-pointer transition-all"
					@click="onItemSelection(rowIndex, colIndex)"
					@mouseenter="hoverItem=colIndex<dimension ? `a_{{${rowIndex+1}}{${colIndex+1}}}`: ''"
					@mouseleave="hoverItem=''"
				/>
			</tr>
		</table>
	</div>
</template>

<style scoped>

</style>
