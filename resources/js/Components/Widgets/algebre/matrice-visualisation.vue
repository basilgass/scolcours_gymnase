<!--<info>
parameters: auto,no-ui,solve,n=<number>

code:
a b c|x
d e f|y
</info>-->
<script lang="ts" setup>

// TODO: a quoi que ça sert ?

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import PiDrawDisplay from "@/Components/Pi/Parts/PiDrawDisplay.vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const params = computed(() => props.illustration.parameters.split(','))
const draw = ref<string>(props.illustration.code ?? "")
const transformValue = ref<string>("2")
const points = [
	[3, 4], [7, -1], [-1, 3]
]

class Matrix {
	#array: number[][]

	constructor(values?: number[][]) {
		this.#array = values ? values : []
	}

	get array(): number[][] {
		return this.#array
	}

	aij(i: number, j: number, value?: number): number {
		if (value !== undefined) {
			this.#array[i][j] = value
		}

		return this.#array[i][j]
	}

	col(idx: number): number[] {
		return [...this.#array.map(row => row[idx])]
	}

	dimensions(): { rows: number, cols: number } {
		return {
			rows: this.#array.length,
			cols: this.#array[0].length
		}
	}

	forEach(callback: (aij: number, row: number, column: number) => void): void {
		this.#array.forEach((row, i) => {
			row.forEach((aij, j) => {
				callback(aij, i, j)
			})
		})
	}

	fromDimension(rows: number, cols: number): Matrix {
		this.#array = Array.from({length: rows}, () => {
			return Array.from({length: cols}, () => 0)
		}) as unknown as number[][]

		return this
	}

	multiply<T extends number[] | Matrix>(value: T): T {
		if (Array.isArray(value) && typeof value[0] === "number") {
			const vector = []
			value.forEach(v => {
				vector.push([v])
			})
			const vectorAsMatrix = new Matrix(vector)
			return this.multiply(vectorAsMatrix).col(0) as T
		}

		const result = new Matrix().fromDimension(
			this.dimensions().rows,
			(value as Matrix).dimensions().cols
		)

		result.forEach((_, i, j) => {
			const row = this.row(i)
			const col = (value as Matrix).col(j)

			const v = row.reduce((acc, left, k) => acc + left * col[k], 0)

			result.aij(i, j, v)
		})

		return result as T
	}

	row(idx: number): number[] {
		return [...this.#array[idx]]
	}
}


function generateFigure(p) {
	const letter = currentLetter.value

	currentLetter.value = letters[letters.split('').indexOf(letter) + 1]

	return p
			.map((pt, idx) => `${letter}${idx}(${pt[0]},${pt[1]})`)
			.join('\n') +
		`\np=poly ${p.map((_, idx) => `${letter}${idx}`).join(',')}`
	//'A(3,4)\nB(7,-1)\nC(-1,3)\np=poly A,B,C'
}

enum TRANSFORMATION {
	translation,
	scale,
	mirrorX,
	mirrorY,
	mirrorXY,
	rotate
}

function transformMatrix(type: TRANSFORMATION, value?: string) {
	if (type === TRANSFORMATION.translation) {
		const [x, y] = value.split(',')
		return new Matrix(
			[
				[1, 0, +x],
				[0, 1, y === undefined ? +x : +y],
				[0, 0, 1]
			]
		)
	}

	if (type === TRANSFORMATION.scale) {
		return new Matrix([
			[+value, 0, 0],
			[0, +value, 0],
			[0, 0, 1]
		])
	}

	if (type === TRANSFORMATION.mirrorX) {
		return new Matrix([
			[1, 0, 0],
			[0, -1, 0],
			[0, 0, 1]
		])

	}
	if (type === TRANSFORMATION.mirrorY) {
		return new Matrix([
			[-1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		])
	}
	if (type === TRANSFORMATION.mirrorXY) {
		return new Matrix([
			[0, 1, 0],
			[1, 0, 0],
			[0, 0, 1]
		])
	}

	if (type === TRANSFORMATION.rotate) {
		const rad = (+value) * Math.PI / 180
		return new Matrix([
			[Math.cos(rad), -Math.sin(rad), 0],
			[Math.sin(rad), Math.cos(rad), 0],
			[0, 0, 1]
		])
	}
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const currentLetter = ref<string>('A')

function appTransform(type: TRANSFORMATION) {
	const M = transformMatrix(type, transformValue.value)
	const Q = []
	points.forEach(pt => {
		const v = [...pt, 1]
		Q.push(M.multiply<number[]>(v))
	})

	draw.value = draw.value + '\n' +
		generateFigure(Q)
}


</script>
<template>
	<article class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div class="order-2 md:order-1">
			<form-maker
				v-model="draw"
				language="pidraw"
				type="codearea"
			/>


			<div class="flex gap-3">
				<button @click="draw = generateFigure(points)">
					figure
				</button>
				<button @click="appTransform(TRANSFORMATION.translation)">
					translate
				</button>
				<button @click="appTransform(TRANSFORMATION.scale)">
					scale
				</button>
				<button @click="appTransform(TRANSFORMATION.mirrorX)">
					mirrorX
				</button>
				<button @click="appTransform(TRANSFORMATION.mirrorY)">
					mirrorY
				</button>
				<button @click="appTransform(TRANSFORMATION.mirrorXY)">
					mirrorXY
				</button>
				<button @click="appTransform(TRANSFORMATION.rotate)">
					rotate
				</button>
			</div>
			<form-maker
				v-model="transformValue"
				label="valeur de transformation"
			/>
		</div>
		<div class="order-1 md:order-2">
			<pi-draw-display
				:code="draw"
				:parameters="illustration.parameters"
			/>
		</div>
	</article>
</template>
