<script setup lang="ts">


import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {computed, ref} from "vue"
import {Point} from "pimath"
import type {PiDraw} from "pidraw/types"

interface XY {
	x: number,
	y: number
}

defineOptions({
	inheritAttrs: false
})

const props = withDefaults(defineProps<{
	matrix: string[][],
	labels?: string[]
	parameters?: string,
	deltaP?: number,
	radius?: number,
	digits?: number
}>(), {
	parameters: "",
	labels: () => ["A", "B", "C", "D"],
	deltaP: 3,
	radius: 1,
	digits: 2 // 0 = fraction, 1-10 decimal, 100: %
})

const showTeX = ref(false)

const calculatedParameters = computed(() => {
	if (props.parameters === '') {
		if (nodes.value === 2) {
			return "x=-6:6,y=-3:3,ppu=35,no-points"
		}

		return "x=-6:6,y=-6:6,ppu=35,no-points"

	}

	return props.parameters
})

const nodes = computed(() => props.labels.length)
const theMatrix = computed(() => {
	const matrix = props.matrix
		.map(row =>
			row.filter(n => n.trim() !== '')
		)

	const dim = matrix.length
	if (dim !== nodes.value) {
		return null
	}

	if (matrix.some(row => row.length !== dim)) {
		return null
	}

	return matrix
})
const theLabels = computed(() => {
	return props.labels.filter(x => x.trim() !== '')
})

// function getValue(aij: Polynom): string | number {
// 	if (props.digits === 0) {
// 		return aij.tex
// 	}
//
// 	if (props.digits === 100) {
// 		return (aij.value * 100).toFixed(0) + '\\%'
// 	}
//
// 	return +aij.value.toFixed(props.digits)
// }

const code = computed(() => {
	if (theMatrix.value === null) {
		return ""
	}

	const {points, anchors} = makeMarkovGraph()

	let n = points.map((p, index) => drawPoint(p, `N${index + 1}`, `tex=${theLabels.value[index] ?? ''}/mc`))
	n = [...n, ...points.map((_, index) => `c${index + 1}=circ N${index + 1},${props.radius}`)]

	for (let row = 0; row < theMatrix.value.length; row++) {
		for (let column = 0; column < theMatrix.value[row].length; column++) {
			const aij = theMatrix.value[row][column]
			if (aij !== '0') {
				const letter = `P${row}${column}`
				const data = anchors[row][column]
				const A1 = circleAnchors(points[row], +data[0])
				const A2 = circleAnchors(points[column], +data[1])

				const P = {x: (A1.x + A2.x) / 2 + (+data[2]), y: (A1.y + A2.y) / 2 + (+data[3])}

				n = [...n,
					...drawArrow(letter,
						A1,
						A2,
						P,
						aij,
						data[4].toString(),
						0.3
					)]
			}
		}
	}


	return n.join('\n')
})

function circleAnchors(point: XY, n: number, anchors = 12): XY {
	return {
		x: point.x + Math.cos(n * 2 * Math.PI / anchors) * props.radius,
		y: point.y + Math.sin(n * 2 * Math.PI / anchors) * props.radius,
	}
}

function drawPoint(point: Point, label: string, params?: string): string {
	return `${label}(${point.x},${point.y})${params ? `->${params}` : ''}`
}

function drawArrow(letter: string,
				   anchor1: XY, anchor2: XY, point: XY,
				   value: string | number, pos: string,
				   smooth: number
): string[] {
	const n: string[] = []

	n.push(`${letter}0(${anchor1.x},${anchor1.y})`)
	n.push(`${letter}2(${anchor2.x},${anchor2.y})`)
	n.push(`${letter}1(${point.x},${point.y})->tex=\\ ${value}/${pos}`)
	n.push(`${letter.toLowerCase()}=bezier ${letter}0,${letter}1/S/${smooth},${letter}2->mark=end`)

	return n
}

function makeMarkovGraph() {
	if (nodes.value === 2) {
		return markovGraph2()
	}

	if (nodes.value === 3) {
		return markovGraph3()
	}

	if (nodes.value === 4) {
		return markovGraph4()
	}
}


function markovGraph2() {
	const p = props.deltaP
	const points = [
		{x: -p, y: 0},
		{x: p, y: 0}
	]

	const a = 0.8
	const b = 0.3
	const anchors = [
		[[5, 6, -a, b, 'tl'], [11, 7, 0, -b, 'b']],
		[[5, 1, 0, b, 't'], [1, 0, a, b, 'tr']]
	]

	return {points, anchors}
}

function markovGraph3() {
	const p = props.deltaP
	const points = [
		{x: 0, y: p},
		{x: -p * 1.2, y: -p},
		{x: p * 1.2, y: -p},

	]

	const a = 0.8
	const b = 0.3
	const anchors = [
		[[4, 2, 0, a * 1.4, 't'], [7, 3, -b, b, 'tl'], [10, 4, -b, -b, 'bl']],
		[[2, 8, b, -b, 'rb'], [7, 8, -a, -a, 'bl'], [11, 7, 0, -b, 'b']],
		[[3, 11, b, b, 'tr'], [6, 0, 0, b, 't'], [10, 11, a, -a, 'br']],
	]

	return {points, anchors}
}

function markovGraph4() {
	const p = props.deltaP
	const points = [
		{x: p, y: p},
		{x: -p, y: p},
		{x: -p, y: -p},
		{x: p, y: -p}
	]

	const a = 0.8
	const b = 0.3
	const anchors = [
		[[1, 2, a, a, 'tr'], [5, 1, 0, b, 't'], [7, 2, -b, b, 'tl'], [9, 3, -b, 0, 'ml']],
		[[0, 6, 0, -b, 'b'], [4, 5, -a, a, 'tl'], [8, 4, -b, 0, 'ml'], [10, 5, -b, -b, 'bl']],
		[[1, 8, b, -b, 'br'], [3, 9, b, 0, 'r'], [7, 8, -a, -a, 'bl'], [11, 7, 0, -b, 'b']],
		[[2, 10, b, 0, 'r'], [4, 11, b, b, 'tr'], [6, 0, 0, b, 't'], [10, 11, a, -a, 'br']]
	]

	return {points, anchors}
}

const emits = defineEmits<{
	drawClick: [{ draw: PiDraw, mouse: MouseEvent }],
	update: [draw: PiDraw],
}>()

const drawMouseUp = function (evt: { draw: PiDraw, mouse: MouseEvent }) {
	emits("update", evt.draw)
	emits("drawClick", evt)
}
</script>

<template>
	<div>
		<pi-draw-parser
			v-bind="$attrs"
			v-if="matrix"
			:draw="{
				parameters:calculatedParameters,
				code
			}"
			@draw-click="drawMouseUp"
		/>
		<div v-admin>
			<div
				class="flex w-full justify-end text-xs cursor-pointer"
				@click="showTeX = !showTeX"
			>
				PiDraw
			</div>
			<pre
				v-show="showTeX"
				class="font-code text-xs"
			>{{ code }}</pre>
		</div>
	</div>
</template>
