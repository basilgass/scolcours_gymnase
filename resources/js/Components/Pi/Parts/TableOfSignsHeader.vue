<script setup lang="ts">

import {TABLE_OF_SIGNS_COLUMNS_SIZES} from "@/Components/Pi/TableOfSigns.vue"

defineProps<{
	roots: string[],
	sizes: TABLE_OF_SIGNS_COLUMNS_SIZES
}>()

</script>
<template>
	<thead>
		<tr>
			<th class="border-r border-gray-400" />
			<th>
				<div
					class="flex flex-row items-center relative min-h-10"
				>
					<div
						v-katex.inline="`-\\infty`"
						:class="[
							'text-tiny pl-1 text-left',
							sizes.infty.width,
							sizes.name==='xs' ? 'invisible' : ''
						]"
					/>
					<div
						v-for="(zero, n) in roots"
						:key="n"
						v-katex.inline.ascii="zero"
						:data-tos="`zero-${n}`"
						:class="[
							sizes.text,
							'self-stretch',
							'text-center hover:bg-white py-2',
							sizes.root
						]"
					>
						/>
					</div>
					<div
						v-katex.inline="`+\\infty`"
						:class="[
							'text-tiny absolute right-0 pr-1 text-right whitespace-nowrap',
							sizes.name==='xs' ? 'invisible' : ''
						]"
					/>
				</div>
			</th>
		</tr>
	</thead>
</template>
