<script setup lang="ts">

import { type TABLE_OF_SIGNS_VALUES } from "pimath"

type TABLE_OF_SIGNS_VALUES_WITH_EXTREMES = TABLE_OF_SIGNS_VALUES | 'm' | 'M' | '_' | 'I'
defineProps<{
	label: string,
	signs: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES[],
	roots: string[],
	mode: 'grows'|'curves'
}>()

function extremeLabel(value: TABLE_OF_SIGNS_VALUES_WITH_EXTREMES): string{
	switch (value){
		case "m": return 'min'
		case 'M': return 'max'
		case '_': return 'replat'
		case "I": return "infl."
	}

	return ''
}
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
			<div class="flex flex-row h-16">
				<div
					v-for="(sign, n) in signs"
					:key="`tos-foot-cell-${n}`"
					:class="{
						'cell-v-line-d':sign==='d',
						'cell-v-line': n%2===1,
						'w-24': roots.length===0,
						'w-12': roots.length>0,
						'bg-stripes bg-stripes-red-100 w-18 -mr-6': sign==='h' && n===0,
						'bg-stripes bg-stripes-red-100 w-18 -ml-6': sign==='h' && n===2*roots.length,
						'bg-stripes bg-stripes-red-100 w-24 -mr-6 -ml-6': sign==='h' && (n!==0 && n!==2*roots.length),
					}"

					class="w-12 text-center py-2 relative"
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
