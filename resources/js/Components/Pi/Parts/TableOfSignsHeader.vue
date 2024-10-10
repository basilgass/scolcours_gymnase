<script setup lang="ts">

defineProps<{roots: string[]}>()
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
						:class="roots.length===0?'w-12':'w-6'"
						class="text-xs pl-1 text-left"
					/>
					<div
						v-for="(zero, n) in roots"
						:key="n"
						v-katex.inline="zero"
						class="w-24 text-center hover:bg-white py-2"
					>
						/>
					</div>
					<div
						v-katex.inline="`+\\infty`"
						:class="roots.length===0?'w-12':'w-6'"
						class="text-xs mr-1 text-right"
					/>
				</div>
			</th>
		</tr>
	</thead>
</template>