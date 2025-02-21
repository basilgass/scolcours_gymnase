<!--<info>
parameters: auto

code: matrix
</info>-->
<script setup lang="ts">

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import MatriceAugmenteeBoutons, {
	matriceAugmenteeInterface
} from "@/Components/Widgets/algebre/Parts/matrice-augmentee-boutons.vue"
import {computed, onMounted, ref, watch} from "vue"
import {Fraction, Polynom} from "pimath"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

let matrix: false | ((Polynom[])[]) = []

const left = computed<string[][]>(() => {
	return (props.illustration.code)
		.split('\n')            // Line split
		.filter(x => x.trim() !== "")    // Remove empty lines
		.map(x => x
			.split('|')[0]        // left part
			.split(' ')        // split each values
			.filter(x => x.trim() !== "")	// remove empty values
		)
})

const right = computed<string[][]>(() => {
	return (props.illustration.code)
		.split('\n')            // Line split
		.filter(x => x.trim() !== "")    // Remove empty lines
		.map((x, index) => {
				const rightPart = x
					.split('|')[1]        // right part

				if (matrix_dimension.value.n === matrix_dimension.value.m &&
					rightPart === undefined) {
					// Suppose in this case we want the identity matrix
					// identity line for index i is 1 at index i and 0 elsewhere
					const idMatrix = Array(matrix_dimension.value.n).fill("0")
					idMatrix[index] = "1"
					return idMatrix
				}

				return rightPart.split(' ')
					.filter(x => x.trim() !== "")
			}
		)
})

const matrix_dimension = computed(() => {
	return {
		n: left.value.length,
		m: left.value[0].length
	}
})

const list_of_operations = ref<matriceAugmenteeInterface[]>([])

function createPolynomMatrix() {
	const number_of_lines = left.value.length

	if (right.value.length === 1 && right.value[0][0] === 'id') {
		// TODO : Création de la matrice identité de taille number_of_lines
	}

	// Même nombre de lignes
	if (number_of_lines !== right.value.length) {

		// console.log(number_of_lines, right.value.length)
		return false
	}

	const output: Polynom[][] = []

	for (let i = 0; i < number_of_lines; i++) {
		const matrixLine: Polynom[] = []

		left.value[i].forEach((value: string) => {
			matrixLine.push(new Polynom(value))
		})
		right.value[i].forEach((value: string) => {
			matrixLine.push(new Polynom(value))
		})
		output.push(matrixLine)
	}

	return output
}

function convertPolynomToTex(matrix: Polynom[][]): string[][] {
	return matrix.map(line => {
		return line.map(item => item.tex)
	})
}

function swapLines<T>(arr: T[], index1: number, index2: number): void {
	if (index1 < 0 || index2 < 0 || index1 >= arr.length || index2 >= arr.length) {
		throw new Error("Indices out of bounds")
	}

	[arr[index1], arr[index2]] = [arr[index2], arr[index1]]
}

function initMatrix() {
	list_of_operations.value = []
	matrix = createPolynomMatrix()
}

function updateMatrix(operation: matriceAugmenteeInterface) {
	if (matrix === false) {
		return
	}

	const matrixLine = matrix[operation.target]
	const value = new Fraction(operation.value)

	if (operation.operation === '+' && operation.reference !== null) {
		const referenceLine = matrix[operation.reference]
		matrixLine.forEach((polynom, index) => {
			// console.log('add L',referenceLine[index].tex , 'multiplied by', value)
			polynom.add(
				referenceLine[index].clone().multiply(value)
			)
		})

	} else if (operation.operation === '*') {
		matrixLine.forEach(polynom => {
			// console.log('multiply', polynom.tex, 'by', +operation.value)
			polynom.multiply(value)
		})
	} else if (operation.operation === 'x') {
		// console.log('swap ', operation.target, +operation.value)
		swapLines(matrix, operation.target, +operation.value)
	}

	list_of_operations.value.push(operation)
}

const result = computed(() => {
	try {
		if (left.value.length === 0) {
			return "\\text{Aucune matrice donnée...}"
		}

		if (matrix === false) {
			return false
		}
		if (list_of_operations.value.length > -1) {
			let tex = "\\left(\\begin{array}{" + "c".repeat(matrix_dimension.value.m) + "|c" + "}"

			convertPolynomToTex(matrix).forEach(line => {
				line.push("\\mid")
			})

			tex += convertPolynomToTex(matrix).map(line => line.join("&")).join("\\\\[0.8em]")
			tex += "\\end{array}\\right)"

			return tex
		}
	} catch (e) {
		console.error(e)
		return false
	}

	return false
})


watch(() => props.illustration.code, () => {
	initMatrix()
})

onMounted(() => {
	initMatrix()
})


</script>
<template>
	<div class="augmented-matrix-wrapper">
		<div class="flex justify-center gap-3">
			<div v-katex="result" />

			<div class="flex flex-col my-4 gap-3">
				<matrice-augmentee-boutons
					v-for="index of matrix_dimension.n"
					:key="`C${index}`"
					class="pl-10"
					:current-line="index-1"
					:number-of-lines="matrix_dimension.n"
					@validate="updateMatrix"
				/>
			</div>
		</div>

		<ol class="list-inside list-decimal">
			<li
				v-for="(op, index) in list_of_operations"
				:key="`op-${index}`"
				v-katex.auto.inline="op.description"
			/>
		</ol>
	</div>
</template>
