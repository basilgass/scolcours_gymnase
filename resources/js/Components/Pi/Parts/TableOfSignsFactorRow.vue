<script setup lang="ts">

import {type TABLE_OF_SIGNS_VALUES} from "pimath"
// TODO: extremeType should be in pimath, with TABLE_OF_SIGNS_VALUES
type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | 'm' | 'M' | '_' | 'I'

defineProps<{
	label: string,
	signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	roots: string[]
}>()

</script>

<template>
	<tr
		class="border-t-2 border-gray-400"
	>
		<td
			v-katex.inline="`${label}`"
			class="min-w-[100px] border-r text-center border-gray-400"
		/>
		<td>
			<div class="flex flex-row">
				<div
					v-for="(sign, n) in signs"
					:key="`tos-foot-cell-${n}`"
					v-katex.inline="n%2===0?(sign==='h'?'':sign):(sign==='z'?'0':'')"
					:class="{
						'cell-v-line-d':sign==='d',
						'cell-v-line': n%2===1,
						'w-24': roots.length===0,
						'w-12': roots.length>0,
						'bg-stripes bg-stripes-red-100 w-18 -mr-6': sign==='h' && n===0,
						'bg-stripes bg-stripes-red-100 w-18 -ml-6': sign==='h' && n===2*roots.length,
						'bg-stripes bg-stripes-red-100 w-24 -mr-6 -ml-6': sign==='h' && (n!==0 && n!==2*roots.length),
					}"
					class="w-12 text-center py-2"
				/>
			</div>
		</td>
	</tr>
</template>
