<!--<info>
parameters: /100 (divisé par 100), % ou d.100 (affichage pourcent), d.<digit>, f[rac]

code:
<label>,<label>,<label>,... (2 à 4 labels)
a b
c d
</info>-->
<script lang="ts" setup>

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"
import PiMarkovGraph from "@/Components/Pi/PiDrawComponents/PiMarkovGraph.vue"
import {Fraction} from "pimath"
import type {PiDraw} from "pidraw/types"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const params = computed(() => props.illustration.parameters?.split(',') ?? [])

const digits = computed<number>(() => {
	if (params.value.includes('f') || params.value.includes('frac')) {
		return 0
	}

	if (params.value.includes('%') || params.value.includes('d.100')) {
		return 100
	}

	const d = params.value.find(p => p.startsWith('d.'))

	if (!d) {
		return 2
	}

	return Number(d.split('d.')[1])
})
const labels = computed<string[]>(() => {
	return props.illustration.code
		.split('\n').shift()
		.split(',')
		.filter(x => x.trim() !== '')
})

const nodes = computed<number>(() => {
	const n = labels.value.length

	if (n < 2 || n > 4) {
		return null
	}

	return n
})

const matrix = computed<Fraction[][]>(() => {
	if (!nodes.value) {
		return null
	}

	const divideBy100 = params.value.includes('/100')

	const input = props.illustration.code
		.split('\n').slice(1)
		.map(row => row.split(' ')
			.filter(n => n.trim() !== '')
			.map(n => divideBy100 ? ((+n) / 100).toString() : n)
		)

	const m: string[][] = []
	for (let row = 0; row < nodes.value; row++) {
		const rowValues: string[] = []
		for (let col = 0; col < nodes.value; col++) {
			rowValues.push(input[row]?.[col] ?? '0')
		}
		m.push(rowValues)
	}

	return m
})

const emits = defineEmits<{
	drawClick: [{ draw: PiDraw, mouse: MouseEvent | TouchEvent }],
	update: [draw: PiDraw],
}>()

const drawMouseUp = function (evt: { draw: PiDraw, mouse: MouseEvent }) {
	emits("update", evt.draw)
	emits("drawClick", evt)
}

</script>
<template>
	<pi-markov-graph
		:labels
		:matrix
		:digits
		@draw-click="drawMouseUp"
	/>
</template>
