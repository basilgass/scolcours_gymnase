<script setup lang="ts">

import {TOS_TABLE_OF_SIGNS} from "@/Components/Pi/TableOfSigns.vue"

defineProps<{
	roots: string[],
	sizes: TOS_TABLE_OF_SIGNS
}>()

</script>
<template>
	<thead>
		<tr>
			<th class="border-r border-gray-400" />
			<th>
				<div
					class="flex flex-row items-center"
				>
					<div
						v-katex.inline="`-\\infty`"
						:class="[
							'text-tiny pl-1 text-left',
							sizes.infty,
						]"
					/>
					<div
						v-for="(zero, n) in roots"
						:key="n"
						v-katex.inline.ascii="zero"
						:class="[
							sizes.text,
							'text-center hover:bg-white py-2',
							sizes.root
						]"
					>
						/>
					</div>
					<div
						v-katex.inline="`+\\infty`"
						:class="[
							'text-tiny text-right',
							sizes.infty,
							sizes.ml
						]"
					/>
				</div>
			</th>
		</tr>
	</thead>
</template>
