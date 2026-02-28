<!--<info>
WIP : Visualisation des transformations géométriques à l'aide de matrice
parameters:

code:
2,3
4,5
a,b
... coordonnées des points de la figure
</info>-->
<script lang="ts" setup>

// WIP: visualisation des transformations par des matrices.

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import PiDrawDisplay from "@/Components/Pi/Parts/PiDrawDisplay.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

// const params = computed(() => props.illustration.parameters.split(','))

const transformValue = ref<string>("2")
const initPoints = computed<[number, number][]>(() => {
	if (props.illustration.code === '') {
		return [[3, 4], [7, -1], [-1, 3]]
	}

	const pts: [number, number][] = []

	props.illustration.code.split('\n')
		.forEach(line => {
			pts.push(line.split(',')
				.map(Number) as [number, number])
		})

	return pts
})

const figuresId = ref<number>(-1)
const figures = ref<{
	id: number,
	refId: number,
	transform: {
		type: TRANSFORMATION,
		value: string
	},
	points: [number, number][]
}[]>([])

const refPoints = computed<[number, number][]>(() => {
	return figures.value[figuresId.value]?.points ?? initPoints.value
})

onMounted(() => {
	createFigure(null)
	figuresId.value = 0
})

type matrixCB = (aij: number, i: number, j: number) => void

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

	forEach(cb: matrixCB): void {
		this.#array.forEach((row: number[], i: number) => {
			row.forEach((aij: number, j: number) => {
				cb(aij, i, j)
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


function createFigure(type: TRANSFORMATION | null) {
	const id = figures.value.length > 0
		? Math.max(...figures.value.map(x => x.id)) + 1
		: 0

	const refId = figuresId.value >= 0
		? figuresId.value
		: 0

	const points = type === null
		? initPoints.value
		: appTransform(type, transformValue.value)

	// Keep the cache.
	figures.value.push({
			id,
			refId,
			transform: {type, value: transformValue.value},
			points
		}
	)
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const draw = computed<string>(() => {
	if (figures.value.length === 0) return ""

	const d: string[] = []

	figures.value.forEach(fig => {
		const id = fig.id === 0 ? '' : fig.id
		const names: string[] = []
		// création des points
		fig.points.forEach((pt, index) => {
			const name = `${letters[index]}${id}`
			names.push(name)
			d.push(`${name}(${pt[0]},${pt[1]})`)
		})
		// création du polygone.
		d.push(`p${id}=poly ${names.join(',')}${fig.id === figuresId.value ? '->fill=blue/0.2' : ''}`)
	})

	return d.join('\n')
})

enum TRANSFORMATION {
	translation = "translation",
	scale = "scale",
	mirrorX = "mirrorX",
	mirrorY = "mirrorY",
	mirrorXY = "mirrorXY",
	rotate = "rotate"
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

function appTransform(type: TRANSFORMATION, value: string): [number, number][] {
	const M = transformMatrix(type, value)
	const Q = []

	refPoints.value.forEach(pt => {
		const v = [...pt, 1]
		Q.push(M.multiply<number[]>(v))
	})

	return Q
}


</script>
<template>
	<article class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div class="order-2 md:order-1">
			<!--			<form-maker-->
			<!--				v-model="draw"-->
			<!--				language="pidraw"-->
			<!--				type="codearea"-->
			<!--			/>-->


			<div class="flex flex-wrap gap-3">
				<sc-button
					xs
					@click="createFigure(null)"
				>
					figure
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.translation)"
				>
					translate
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.scale)"
				>
					scale
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.mirrorX)"
				>
					mirrorX
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.mirrorY)"
				>
					mirrorY
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.mirrorXY)"
				>
					mirrorXY
				</sc-button>
				<sc-button
					xs
					@click="createFigure(TRANSFORMATION.rotate)"
				>
					rotate
				</sc-button>
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

		<div>
			<div
				v-for="fig in figures"
				:key="fig.id"
				class="cursor-pointer"
				:class="{
					'bg-blue-200 border border-blue-500 text-blue-800': figuresId===fig.id
				}"
				@click="figuresId=fig.id"
			>
				{{ fig.id }} : {{ fig.transform }}
			</div>
		</div>
	</article>
</template>
