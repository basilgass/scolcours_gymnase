<script lang="ts" setup>

import { computed } from "vue"

const props = defineProps<{
	roots: string[],
	extremes: string[]
}>()

const formattedExtremes = computed<string[]>(() => {
	const arr = []
	for (let i = 0; i < 2 * props.roots.length + 1; i++) {
		const extreme = props.extremes[(i - 1) / 2] ?? ""
		const root = extreme === "" ? "" : `(${props.roots[(i - 1) / 2]};${extreme})`
		arr.push(
			i % 2 === 0 ? "" : root
		)
	}
	return arr

})
</script>

<template>
	<tr
		class="border-t-2 border-gray-400"
	>
		<td
			class="min-w-[100px] border-r border-gray-400"
		/>
		<td>
			<div class="flex flex-row">
				<div
					v-for="(extreme, index) in formattedExtremes"
					:key="`tos-foot-cell-extreme-${index}`"
					class="w-12 text-center py-2 relative"
				>
					<div
						v-if="index%2===1"
						v-katex.inline.ascii="extreme"
						class="text-center absolute left-1/2 -translate-x-1/2 z-10"
					/>
				</div>
			</div>
		</td>
	</tr>
</template>