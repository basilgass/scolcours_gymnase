<script setup lang="ts">

import {
	ITEM_TYPES,
	itemGraphInterface,
	kbrdStudyButtons,
	POINT_TYPES
} from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyHelpers.ts"
import {computed} from "vue"

const props = defineProps<{
	items: itemGraphInterface[]
}>()

const emit = defineEmits<{
	removeItem: [item: itemGraphInterface],
	removeAll: []
}>()

function displayItem(item: itemGraphInterface): string {
	if (item === undefined) {
		return "?"
	}

	if (item.type === ITEM_TYPES.AH ||
		item.type === ITEM_TYPES.AV ||
		item.type === ITEM_TYPES.AO
	) {
		return `\\text{${item.type.toUpperCase()}} : ${item.id}`
	}

	const btnMap: Partial<Record<ITEM_TYPES, string>> = {}
	btnMap[POINT_TYPES.MIN] = 'min'
	btnMap[POINT_TYPES.MAX] = 'max'
	btnMap[POINT_TYPES.REPLAT] = 'replat'
	btnMap[POINT_TYPES.TROU] = 'trou'
	btnMap[POINT_TYPES.ZERO] = 'zéro'
	btnMap[POINT_TYPES.ORDONNEE] = 'ordonnée'
	btnMap[POINT_TYPES.QUELCONQUE] = ''

	return `\\text{${btnMap[item.kind]}}${item.id}`
}

function getGroup(item: itemGraphInterface): string {
	return item.type === 'point'
		? kbrdStudyButtons[item.kind].group
		: kbrdStudyButtons[item.type]?.group ?? ''
}

const groups = computed(() => {
	const g = new Set()

	props.items.forEach((item) => {
		g.add(getGroup(item))
	})

	const arr = [...g]
	arr.sort()
	return arr
})


</script>

<template>
	<div class="keyboard-study-items my-3 border-t">
		<h3 class="text-center mt-1">
			{{
				items.length === 0 ? "aucun élément créé" : items.length === 1 ? "élément créé" : "éléments créés"
			}}
		</h3>

		<div
			v-for="group in groups"
			:Key="`group-${group}`"
			class="my-3"
		>
			<h4 class="font-semibold">
				{{ group }}
			</h4>
			<div
				class="flex gap-1 lg:gap-2
				text-xs
				items-baseline
				flex-wrap
				keyboard min-h-[3em]"
			>
				<button
					v-for="item in items.filter(item=>getGroup(item)===group)"
					:key="item.id"
					v-katex.ascii.nomargin="displayItem(item)"
					class="key-touch cursor-pointer
						bg-action border rounded px-3 py-1
						hover:bg-amber-300 transition-colors"
					@dblclick="emit('removeItem', item)"
				/>
			</div>
		</div>


		<div
			v-show="items.length>0"
			class="text-xs text-gray-700 text-center"
		>
			double-cliquer pour supprimer ou
			<button
				class="bg-content border border-content px-3 py-1 cursor-pointer"
				@click="emit('removeAll')"
			>
				<i class="bi bi-trash mr-3 text-red-800" />tout supprimer
			</button>
		</div>
	</div>
</template>

<style scoped>

</style>
