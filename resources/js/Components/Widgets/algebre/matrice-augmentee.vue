<!--<info>
parameters: auto

code: matrix
</info>-->
<script lang="ts" setup>

import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, reactive, ref, useTemplateRef, watch} from "vue"
import {Fraction, Polynom} from "pimath"
import KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import {useKeyboard} from "@/Composables/useKeyboard.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {matrixSolver} from "@/Components/Widgets/algebre/matrixSolver.ts"

type operationType = `+` | `-` | '*' | '/' | 'x'

export interface matriceAugmenteeInterface {
	target: number,
	operation: operationType,
	value: string, // can be a number or a fraction
	reference: number | null,
	description: string
}

const buttonsConfig: { label: string, value: operationType }[] = [
	{
		label: "ajouter",
		value: "+"
	},
	{
		label: "soustraire",
		value: "-"
	},
	{
		label: "multiplier",
		value: "*"
	},
	{
		label: "diviser",
		value: "/"
	},
	{
		label: "permuter",
		value: "x"
	},

]

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

const list_of_operations = ref<Partial<matriceAugmenteeInterface>[]>([])

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

function getOperationDescription(operation: Partial<matriceAugmenteeInterface>): string {
	if (operation.target === null) {
		return "Sélectionner une ligne..."
	}

	if (operation.operation === null) {
		return `Que faire pour la <code>ligne ${operation.target + 1}</code> ?`
	}

	const op = operation.operation
	const verb = op === '+' ? "ajouter à" : op === '-' ? "soustraire à" : op === '*' ? "multiplier" : op === "/" ? "diviser" : "permuter"

	let value = ""

	let scalar: string
	if (operation.value === null || operation.value === "" || operation.value === undefined) {
		scalar = "\\ \\textcolor{red}{\\langle\\text{entrer une valeur}\\rangle}\\ "
	} else {
		try {
			scalar = new Fraction(operation?.value).tex
		} catch {
			scalar = "\\ \\textcolor{red}{\\langle\\text{valeur non reconnue}\\rangle}\\ "
		}
	}

	if (op === '+' || op === '-') {
		value = `\\(${scalar}\\) fois la <code>ligne ${operation.reference === null ? "..." : operation.reference + 1}</code>`
	} else if (op === '*' || op === '/') {
		value = `par \\(${scalar}\\)`
	} else if (op === 'x') {
		value = `avec la <code>ligne ${operation.reference + 1}</code>`
	}

	return `${verb} la <code>ligne ${operation.target + 1}</code> ${value}`
}

const operationDescription = computed(() => {
	return getOperationDescription(operationData)
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

function initMatrix(refreshOnly?: boolean) {
	if (refreshOnly !== true) {
		list_of_operations.value = []
	}

	matrix = createPolynomMatrix()
	matrixTex.value = []

	if (result.value) {
		matrixTex.value.push({
			tex: result.value?.tex,
			description: ''
		})
	}
}

function getShortDescription(operation: Partial<matriceAugmenteeInterface>): string {

	if (operation.operation === 'x') {
		return `L_${operation.target + 1} \\longleftrightarrow L_${operation.reference + 1}`
	}

	const F = new Fraction(operation.value)

	if (operation.operation === '*') {
		return `${F.tex} \\cdot L_${operation.target + 1}`
	}

	if (operation.operation === '/') {
		return `\\frac{ L_${operation.target + 1} }{ ${F.tex} }`
	}

	// (operation.operation === '+' || operation.operation === '-')
	return `L_${operation.target + 1} ${operation.operation} ${F.value < 0 ? `\\left(${F.tex}\\right)` : F.tex} \\cdot L_${operation.reference + 1}`

}

function updateMatrix(operation: Partial<matriceAugmenteeInterface>, refreshOnly?: boolean) {
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

	if (refreshOnly !== true) {
		list_of_operations.value.push({
			...operation,
			description: getOperationDescription(operation)
		})
	}

	// Store the current matrix.
	matrixTex.value.push({
		tex: getCurrentMatrixTex().tex,
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

function autoSolve() {
	if (matrix === false) {
		return
	}
	const MS = new matrixSolver(
		matrix.map(row => row.map(polynom => {
				return polynom.monoms[0]?.coefficient ?? new Fraction(0)
			}),
			matrix_dimension.value.m
		)
	)

	MS.solve()

	MS.operations.forEach(op => {
		updateMatrix(op)
	})
}

function removeOperation(index: number) {
	// remove item from operationValue
	list_of_operations.value.splice(index, 1)

	// Reset matrix
	initMatrix(true)

	// Reapply all operations
	list_of_operations.value.forEach(operation => {
		updateMatrix(operation, true)
	})

}

const operationIsComplete = computed<boolean>(() => {
	const operation = operationData

	if (operation.target === null) {
		return false
	}

	if (operation.operation === null) {
		return false
	}

	if (operation.operation === 'x') {
		return !(operation.reference === null || operation.target === operation.reference)
	}

	if(operation.value===null || operation.value==='') { return false }

	try {
		const F = new Fraction(operation?.value)
		if (F.isNaN() || F.isZero()) {
			return false
		}
	} catch {
		return false
	}

	if (operation.operation === '+' || operation.operation === '-') {
		if (operation.reference === null ||
			operation.target === operation.reference
		) {
			return false
		}
	}


	return true
})

function getCurrentMatrixTex() {
	if (matrix === false) {
		return {tex: "\\text{Aucune matrice donnée...}", flatten: [], matrix: []}
	}

	let tex = "\\left(\\begin{array}{" + "c".repeat(matrix_dimension.value.m) + "|c" + "}"

	tex += convertPolynomToTex(matrix).map(line => line.join("&")).join("\\\\[0.8em]")
	tex += "\\end{array}\\right)"

	return {
		tex,
		flatten: matrix.flat(),
		matrix
	}
}

const result = computed<{ tex: string, flatten: Polynom[], matrix: Polynom[][] } | false>(() => {
	try {
		if (left.value.length === 0) {
			return {tex: "\\text{Aucune matrice donnée...}", flatten: [], matrix: []}
		}

		if (matrix === false) {
			return {tex: "\\text{Aucune matrice donnée...}", flatten: [], matrix: []}
		}

		if (list_of_operations.value.length > -1) {
			return getCurrentMatrixTex()
		}
	} catch (err) {
		console.warn(err)
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

	const arrAvecRetourALaLigne: string[] = []

	arr.forEach((line, index) => {
		if (index % matrixPerLine.value === 0 && index !== 0) {
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
	<div class="augmented-matrix-wrapper">
		<div class="flex justify-center my-6">
			<div class="relative inline-block min-h-[6rem] min-w-[200px]">
				<svg
					class="absolute left-0 h-full"
					preserveAspectRatio="none"
					viewBox="0 0 20 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18,0 C5,10 5,90 18,100"
						fill="transparent"
						stroke="currentColor"
						stroke-width="1"
					/>
				</svg>

				<!-- Parenthèse droite -->
				<svg
					class="absolute right-0 h-full"
					preserveAspectRatio="none"
					viewBox="0 0 20 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2,0 C15,10 15,90 2,100"
						fill="transparent"
						stroke="currentColor"
						stroke-width="1"
					/>
				</svg>

				<!-- info hover -->
				<div
					v-katex.inline="hoverItem"
					class="absolute left-[50%] translate-x-[-50%] -bottom-4 text-xs"
				/>

				<!-- Grille -->
				<div
					v-if="result!==false && result.matrix.length>0"
					class="grid grid-cols-1"
				>
					<div
						v-for="(line, lineIndex) in result.matrix"
						:key="`line-${lineIndex}`"
						:class="{
							'bg-green-200 dark:bg-green-800': lineIndex===operationData.target,
							'bg-blue-200 dark:bg-blue-800': lineIndex===operationData.reference
						}"
						class="flex gap-2"
						@click="selectLine(lineIndex)"
					>
						<div
							v-for="(item, index) in line"
							:key="`a_${lineIndex}${index}`"
							v-katex.inline="item.tex"
							:class="index===matrix_dimension.m ? 'border-l border-red-500 px-2':''"
							class="w-20 py-2 text-center cursor-pointer"
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
				class="text-center border p-3"
			/>

			<div>
				<sc-button
					type="primary"
					class="mx-auto min-w-[100%] md:min-w-[350px]"
					xl
					:outline="!operationIsComplete"
					:disabled="!operationIsComplete"
					@click="updateMatrix(operationData)"
				>
					{{ operationIsComplete ? 'Valider' : "Compléter les instructions" }}
				</sc-button>
			</div>

			<div
				class="flex flex-wrap gap-3 justify-center"
			>
				<sc-button
					v-for="button in buttonsConfig"
					:key="button.value"
					:active="operationData.operation===button.value"
					@click="operationData.operation=button.value"
				>
					{{ button.label }}
				</sc-button>
			</div>

			<div v-show="operationData.operation!== null && operationData.operation!=='x'">
				<!--demande d'un nombre-->
				<keyboard-basic
					ref="valueKeyboard"
					:keyboard="getKeyboards('fraction')[0].keyboard"
					answer=""
					@change="operationData.value = $event.input"
				/>
				<div
					v-katex.ascii.boxed="operationData.value"
					class="font-code h-[1.5rem] text-center"
				/>
			</div>

			<div class="flex flex-col gap-1 w-full">
				<div
					v-for="(item, index) in list_of_operations"
					:key="`description-${index}`"
					class="flex justify-between w-full border p-3"
				>
					<markdown-it
						:text="`${index+1}. ${item.description}`"
						class=""
					/>
					<button
						v-show="index===list_of_operations.length-1"
						class="text-red-500 px-3"
						@click="removeOperation(index)"
					>
						<i class="bi bi-trash" />
					</button>
				</div>
			</div>

			<div v-katex.boxed="matrixTexToAligned" />

			<div>
				<sc-button
					type="primary"
					@click="autoSolve"
				>
					auto solve
				</sc-button>
			</div>
			<tex-code
				:tex="matrixTexToAligned"
				slug="matrice-augmentee"
				title="matrice augmentée"
			/>
		</div>
	</div>
</template>
