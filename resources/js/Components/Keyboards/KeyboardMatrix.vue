<script lang="ts" setup>
import {
	getOneKeyboard,
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface,
} from "@/Composables/useKeyboard.ts"
import {computed, inject, onMounted, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import PiMatrix from "@/Components/Pi/Parts/PiMatrix.vue"
import {Polynom} from "pimath"
import {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"
import ScButton from "@/Components/Ui/scButton.vue"

// config: decimal

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(event: KeyboardInputInterface): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value === "") {
		// Reset des réponses.
		if (!hasFixedDimension.value) {
			dimension.value = {rows: null, columns: null}
			showDimensionKeyboard.value = true
			values.value = []
		} else {
			values.value = Array.from({length: dimension.value.rows}, () => Array.from({length: dimension.value.columns}, () => ""))
		}


	} else if (value !== undefined) {
		const [dim, v] = value.split(";")

		const [rows, columns] = dim.split("x").map(Number)
		dimension.value = {
			columns: columns ?? 1,
			rows: rows ?? 1
		}

		values.value = Array.from({length: rows}, () => Array.from({length: columns}, () => ""))

		let row = 0, column = 0
		v.split(',').forEach((a) => {
			values.value[row][column] = a
			column++
			if (column % dimension.value.columns === 0) {
				column = 0
				row++
			}
		})
	}

	return {
		input: `${dimension.value.rows}x${dimension.value.columns};${values.value.flat().join(',')}`,
		tex: matrixToTex(values.value, dimension.value),
		raw: ""
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// reset function
	},
	setInput,
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)\nlist (affichage d'une liste)"
})

/**
 * Keyboards custom configuration
 */

// Get the checker from above.
const questionData = inject<questionDataInterface>('questionData')

// REFACTOR: Move all these (duplicate) function to a class or something better
function matrixToTex(matrix: string[][], dim: { rows: number, columns: number }): string {

	let tex = "\\left(\\begin{array}{" + "c".repeat(dim.columns) + "}"

	tex += matrix.map(row => row.map(a => {
		try {
			return numericOutput.value
				? a
				: new Polynom(a).tex
		} catch {
			return a
		}
	})).map(line => line.join("&")).join("\\\\[0.8em]")

	tex += "\\end{array}\\right)"

	return tex
}

// Values settings
const values = ref<string[][]>([])
const aij = ref<{ row: number, column: number } | null>(null)
const valuesKeyboard = computed<string>(() => {
	const [_, kbrd] = questionData.config.raw.split('\n')[0].split('checker:')

	return kbrd
		? getOneKeyboard(kbrd).keyboard.config.name
		: numericOutput.value
			? 'number'
			: 'fraction'
})


// Dimension settings
const showDimensionKeyboard = ref<boolean>(true)
const dimension = ref<{ rows: number, columns: number }>({
	rows: null,
	columns: null,
})
const hasFixedDimension = computed<boolean>(() => fixedDimension.value[0] !== null)
const fixedDimension = computed<[number, number]>(() => {
	let dim: [number, number] = [null, null]
	props.keyboard.parameters.forEach(value => {
		if (value.match(/dim=\d+x\d+/)) {
			dim = value.split('dim=')[1].split('x').map(Number) as [number, number]
		}
	})
	return dim
})
const numericOutput = computed<boolean>(() => {
	return props.keyboard.parameters.includes('decimal')
})

function switchKeyboard(value?: boolean): void {
	if (hasFixedDimension.value) {
		// Les dimensions sont fixées
		showDimensionKeyboard.value = false
		return
	}

	if (!dimension.value.columns || !dimension.value.rows) {
		// Si une des dimensions n'est pas données, on affiche le clavier des dimensions.
		showDimensionKeyboard.value = true
		return
	}

	if (value !== undefined) {
		showDimensionKeyboard.value = value
		return
	}

	showDimensionKeyboard.value = !showDimensionKeyboard.value
}

function onKeyboardChange(event: KeyboardInputInterface): void {
	if (showDimensionKeyboard.value) {
		updateDimension(event.input)
		return
	}

	updateValue(event)

}

function updateDimension(value: string): void {
	let [m, n] = value.split('x').map(Number)

	if (m < 1) {
		m = null
	}

	if (n < 1) {
		n = null
	}

	if (m >= 10) {
		// on évite les valeurs trop grandes.
		m = null
	}

	if (n >= 10) {
		// on évite les valeurs trop grandes.
		n = null
	}

	dimension.value.rows = m ?? null
	dimension.value.columns = n ?? null

	// Build the values.
	let arr: string[][] = []
	for (let i = 0; i < m; i++) {
		const row: string[] = []
		for (let j = 0; j < n; j++) {
			row.push('')
		}
		arr.push(row)
	}

	values.value = arr
}

function updateValue(event: KeyboardInputInterface): void {
	// Update a value.
	if (aij.value === null) {
		return
	}

	values.value[aij.value.row][aij.value.column] = event.input

	onChange(event)
}

// Configuration on mount
onMounted(() => {
	if (fixedDimension.value[0] !== null) {
		switchKeyboard(false)

		updateDimension(fixedDimension.value.join('x'))

		onKeyboardChange({
			input: fixedDimension.value.join('x'),
			tex: '', raw: ''
		})

		aij.value = {row: 0, column: 0}
	}
})

const pimatrixDisplay = computed(() => {
	return values.value.map(row => row.map(x => {
		if (x === '') {
			return null
		}

		try {
			return numericOutput.value
				? x
				: new Polynom(x)
		} catch {
			return x
		}
	}))
})

console.log(aij.value)
</script>

<template>
	<div class="flex flex-col gap-3 items-center">
		<div v-if="!hasFixedDimension">
			Dimension de la matrice: <span
				v-katex.inline="`${ dimension.rows ?? 'm' } \\times ${dimension.columns ?? 'n'}`"
			/>
		</div>
		<sc-button
			v-if="!hasFixedDimension"
			@click="switchKeyboard"
			v-show="dimension.columns && dimension.rows"
		>
			dim à valeurs
		</sc-button>

		<pi-matrix
			:matrix="pimatrixDisplay"
			:dimension="dimension.columns"
			selection-mode="item"
			v-model:aij="aij"
			@click="switchKeyboard(false)"
		/>

		<div class="w-full">
			<KeyboardDisplay
				v-if="showDimensionKeyboard"
				keyboard="number"
				back
				reset
				:extra-letters="['x']"
				@change="onKeyboardChange"
			/>
			<KeyboardDisplay
				v-else
				:key="`aij-${aij?.row}-${aij?.column}`"
				:keyboard="valuesKeyboard"
				:disabled="aij===null"
				:class="aij===null?'cursor-not-allowed opacity-20':''"
				back
				reset
				@change="onKeyboardChange"
			/>
		</div>
	</div>
</template>
