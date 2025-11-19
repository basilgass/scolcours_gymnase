<script
	generic="T"
	lang="ts"
	setup
>

import {computed} from "vue"
import {ITEM_STATUS} from "@/types/evaluationInterfaces.ts"


const props = withDefaults(
	defineProps<{
		items: T[],
		status?: (item: T) => ITEM_STATUS	// -1, 0, 1,
		maxItems: number
	}>(),
	{
		status: () => ITEM_STATUS.NEW,
		maxItems: 5
	}
)
const emits = defineEmits<{
	change: [e: { value: T, index: number }]
}>()
const itemIndex = defineModel<number>()

const itemsSelector = computed(() => {
	if (props.items.length === 0) return []

	if (props.items.length <= props.maxItems) return incrementArray(0, props.items.length - 1)

	const halfMaxItems = (props.maxItems - 1) / 2
	if (itemIndex.value < halfMaxItems) {
		return incrementArray(0, props.maxItems - 1)
	}
	if (itemIndex.value > props.items.length - 1 - halfMaxItems) {
		return incrementArray(props.items.length - props.maxItems, props.items.length - 1)
	}

	return incrementArray(
		itemIndex.value - halfMaxItems,
		itemIndex.value + halfMaxItems
	)
})

function incrementArray(start: number, end: number): number[] {
	const arr = []
	for (let i = start; i <= end; i++) {
		arr.push(i)
	}
	return arr
}

function selectQuestion(index: number) {
	itemIndex.value = index
	emits('change', {index, value: props.items[itemIndex.value]})
}

</script>

<template>
	<div class="flex justify-around my-10 relative">
		<hr
			:class="[
				itemsSelector[0]===0 ? 'left-10' : '-left-5',
				itemsSelector[itemsSelector.length-1]=== items.length-1 ? 'right-10' : '-right-5'
			]"
			class="absolute border border-content top-[50%] z-0"
		>
		<!-- List of the questions -->
		<div
			v-for="i in itemsSelector"
			:key="`question-${i}`"
			:class="{
				'border-4 border-blue-600 bg-blue-100! text-blue-800':
					i === itemIndex,
				'bg-content  text-gray-300': status(items[i])===ITEM_STATUS.NEW && (i !== itemIndex),
				'bg-green-50! border-green-600 text-green-600':
					status(items[i])===ITEM_STATUS.PARTIAL ,
				'bg-green-600! border-green-800 text-white':
					status(items[i])===ITEM_STATUS.SUCCESS ,
			}"
			class="z-10 rounded-full font-lg
					border-content font-semibold  border w-12 h-12 grid place-items-center cursor-pointer transition-all"
			@click="selectQuestion(i)"
		>
			{{ i + 1 }}
		</div>
	</div>
</template>

<style scoped>

</style>
