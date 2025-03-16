<!--<info>
parameters: auto

code: matrix
</info>-->
<script setup lang="ts">

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, reactive, ref, useTemplateRef, watch} from "vue"
import {Fraction, Polynom} from "pimath"
import KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import {useKeyboard} from "@/Composables/useKeyboard.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import TexCode from "@/Components/Ui/TexCode.vue"

export interface matriceAugmenteeInterface {
	target: number,
	operation: `+` | `-` | '*' | '/' | 'x',
	value: string, // can be a number or a fraction
	reference: number | null,
	description: string
}


const {getKeyboards} = useKeyboard()

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

const hoverItem = ref("")
const operationData = reactive<matriceAugmenteeInterface>({
	operation: null,
	value: null,
	description: null,
	reference: null,
	target: null
})
const valueKeyboard = useTemplateRef('valueKeyboard')

function selectLine(lineIndex: number) {
	if (operationData.target === null) {
		operationData.target = lineIndex
	} else if (operationData.target === lineIndex) {
		operationData.target = null
	} else if (operationData.reference === lineIndex) {
		operationData.reference = null
	} else {
		operationData.reference = lineIndex
	}
}

const operationDescription = computed(() => {
	if (operationData.target === null) {
		return "Sélectionner une ligne..."
	}

	if (operationData.operation === null) {
		return `Que faire pour la <code>ligne ${operationData.target + 1}</code> ?`
	}

	const op = operationData.operation
	const verb = op === '+' ? "ajouter à" : op === '-' ? "soustraire à" : op === '*' ? "multiplier" : op === "/" ? "diviser" : "permuter"
	let value = ""

	let scalar: string
	if (operationData.value === null) {
		scalar = "??"
	} else {
		try {
			scalar = new Fraction(operationData.value).tex
		} catch {
			scalar = "??"
		}
	}

	if (op === '+' || op === '-') {
		value = `\\(${scalar}\\) fois la <code>ligne ${operationData.reference === null ? "..." : operationData.reference + 1}</code>`
	} else if (op === '*' || op === '/') {
		value = `par \\(${scalar}\\)`
	} else if (op === 'x') {
		value = `avec la <code>ligne ${operationData.reference + 1}</code>`
	}

	return `${verb} la <code>ligne ${operationData.target === null ? "..." : operationData.target + 1}</code> ${value}`
})

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

	if (result.value) {
		matrixTex.value.push({
			tex: result.value?.tex,
			description: ''
		})
	}
}

function getShortDescription(operation: matriceAugmenteeInterface): string {
	if (operation.operation === 'x') {
		return `L_${operation.target} \\longleftrightarrow L_${operation.reference}`
	}

	if (operation.operation === '*') {
		return `${operation.value} \\cdot L_${operation.target}`
	}

	if (operation.operation === '/') {
		return `L_${operation.target} \\div ${operation.value}`
	}

	if (operation.operation === '+') {
		return `L_${operation.target} + ${operation.value} \\cdot L_${operation.reference}`
	}

	if (operation.operation === '-') {
		return `L_${operation.target} - ${operation.value} \\cdot L_${operation.reference}`
	}

	return ''

}

function updateMatrix(operation: matriceAugmenteeInterface) {
	if (matrix === false) {
		return
	}

	const matrixLine = matrix[operation.target]
	const value = new Fraction(operation.value)

	switch (operation.operation) {
		case "+":
		case "-": {
			const referenceLine = matrix[operation.reference]

			matrixLine.forEach((polynom, index) => {
				if (operation.operation === '+') {
					polynom.add(
						referenceLine[index].clone().multiply(value)
					)
				} else {
					polynom.subtract(
						referenceLine[index].clone().multiply(value)
					)
				}
			})
			break
		}

		case "*":
		case "/": {
			matrixLine.forEach(polynom => {
				// console.log('multiply', polynom.tex, 'by', +operation.value)
				if (operation.operation === '*') {
					polynom.multiply(value)
				} else {
					polynom.divide(value)
				}
			})
			break
		}
		case "x":
			swapLines(matrix, operation.target, operation.reference)
	}

	list_of_operations.value.push({
		...operation,
		description: operationDescription.value
	})

	// Store the current matrix.
	matrixTex.value.push({
		tex: result.value === false ? '' : result.value.tex,
		description: getShortDescription(operation)
	})

	// Reset du operationData
	operationData.operation = null
	operationData.value = null
	operationData.description = null
	operationData.reference = null
	operationData.target = null

	valueKeyboard.value.reset()

}

const operationIsComplete = computed(() => {
	const operation = operationData
	if (operation.target === null) {
		return false
	}

	if (operation.operation === 'x') {
		if (operation.reference === null ||
			operation.target === operation.reference
		) {
			return false
		}
	}

	if (operation.operation === '*' || operation.operation === '/') {
		if (+operation.value === 0) {
			return false
		}
	}

	if (operation.operation === '+' || operation.operation === '-') {
		if (operation.reference === null ||
			operation.target === operation.reference ||
			+operation.value === 0
		) {
			return false
		}
	}


	return true
})

const result = computed<
	{
		tex: string,
		flatten: Polynom[],
		matrix: Polynom[][]
	} | false
>(() => {
	try {
		if (left.value.length === 0) {
			return {tex: "\\text{Aucune matrice donnée...}", flatten: [], matrix: []}
		}

		if (matrix === false) {
			return {tex: "\\text{Aucune matrice donnée...}", flatten: [], matrix: []}
		}

		if (list_of_operations.value.length > -1) {
			let tex = "\\left(\\begin{array}{" + "c".repeat(matrix_dimension.value.m) + "|c" + "}"

			convertPolynomToTex(matrix).forEach(line => {
				line.push("\\mid")
			})

			tex += convertPolynomToTex(matrix).map(line => line.join("&")).join("\\\\[0.8em]")
			tex += "\\end{array}\\right)"

			return {
				tex,
				flatten: matrix.flat(),
				matrix
			}
		}
	} catch {
		return false
	}

	return false
})

const matrixPerLine = ref<number>(3)
const matrixTex = ref<{
	tex: string,
	description: string
}[]>([])

const matrixTexToAligned = computed<string>(() => {

	if (!result.value || matrixTex.value.length === 0) {
		return ''
	}

	const arr: string[] = [`& && ${matrixTex.value[0].tex}`]

	for (let i = 1; i < matrixTex.value.length; i++) {
		arr.push(`& \\stackrel{ ${
			matrixTex.value[i].description
		} }{\\Longleftrightarrow} && ${
			matrixTex.value[i].tex
		}`)
	}

	const arrAvecRetourALaLigne:string[] = []

	arr.forEach((line, index) => {
		if(index % matrixPerLine.value === 0 && index!==0) {
			arrAvecRetourALaLigne.push('\\\\[1.5em]')
		}
		arrAvecRetourALaLigne.push(line)
	})

	return `\\begin{aligned} ${arrAvecRetourALaLigne.join('')} \\end{aligned}`
})


watch(() => props.illustration.code, () => {
	initMatrix()
})

onMounted(() => {
	initMatrix()
})


</script>
<template>
	<div class="augmented-matrix-wrapper grid place-items-center">
		<div class="flex items-stretch my-6">
			<div class="relative inline-block">
				<svg
					class="absolute left-0 h-full"
					viewBox="0 0 20 100"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18,0 C5,10 5,90 18,100"
						stroke="currentColor"
						fill="transparent"
						stroke-width="1"
					/>
				</svg>

				<!-- Parenthèse droite -->
				<svg
					class="absolute right-0 h-full"
					viewBox="0 0 20 100"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2,0 C15,10 15,90 2,100"
						stroke="currentColor"
						fill="transparent"
						stroke-width="1"
					/>
				</svg>

				<!-- info hover -->
				<div
					class="absolute left-[50%] translate-x-[-50%] -bottom-4 text-xs"
					v-katex.inline="hoverItem"
				/>

				<!-- Grille -->
				<div
					class="flex flex-col px-4 py-1"
					v-if="result!==false && result.matrix.length>0"
				>
					<div
						v-for="(line, lineIndex) in result.matrix"
						:key="`line-${lineIndex}`"
						class="flex gap-2"
						:class="{
							'bg-green-200 dark:bg-green-800': lineIndex===operationData.target,
							'bg-blue-200 dark:bg-blue-800': lineIndex===operationData.reference
						}"
						@click="selectLine(lineIndex)"
					>
						<div
							v-for="(item, index) in line"
							:key="`a_${lineIndex}${index}`"
							v-katex.inline="item.tex"
							class="w-10 py-2 text-center cursor-pointer"
							:class="index===matrix_dimension.m ? 'border-l border-red-500 px-2':''"
							@mouseenter="hoverItem=index<matrix_dimension.m ? `a_{{${lineIndex+1}}{${index+1}}}`: ''"
							@mouseleave="hoverItem=''"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="py-10 space-y-10 w-full">
			<markdown-it
				:text="operationDescription"
				class="text-center border p-3 bg-content"
			/>

			<div
				class="flex gap-3 justify-center *:border *:px-3 *:py-1 *:rounded"
			>
				<button @click="operationData.operation='+'">
					ajouter
				</button>
				<button @click="operationData.operation='-'">
					soustraire
				</button>
				<button @click="operationData.operation='*'">
					multiplier
				</button>
				<button @click="operationData.operation='/'">
					diviser
				</button>
				<button @click="operationData.operation='x'">
					permuter
				</button>
			</div>

			<div v-show="operationData.operation!== null && operationData.operation!=='x'">
				<!--demande d'un nombre-->
				<keyboard-basic
					ref="valueKeyboard"
					answer=""
					:keyboard="getKeyboards('fraction')[0].keyboard"
					@change="operationData.value = $event.input"
				/>
			</div>

			<div class="text-center">
				<button
					v-show="operationIsComplete"
					@click="updateMatrix(operationData)"
					class="rounded px-10 py-5 bg-blue-500 text-white
						cursor-pointer disabled:cursor-not-allowed"
				>
					Valider
				</button>
			</div>

			<markdown-it
				:text="list_of_operations.map((x, i)=>`${i+1}. ${x.description}`).join('\n')"
				class="border p-3 bg-content"
			/>

			<!--			<div v-katex="matrixTexToAligned" />-->
			<tex-code
				:tex="matrixTexToAligned"
				title="matrice augmentée"
				slug="matrice-augmentee"
			/>
		</div>
	</div>
</template>
