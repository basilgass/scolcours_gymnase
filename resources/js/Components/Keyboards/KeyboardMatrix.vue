<script lang="ts" setup>
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface,
} from "@/Composables/useKeyboard.ts"
import {computed, onMounted, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import PiMatrix from "@/Components/Pi/Parts/PiMatrix.vue"
import {Fraction, Polynom} from "pimath"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()


// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(event: KeyboardInputInterface): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if(value ==="") {
		// Reset des réponses.
		if(!hasFixedDimension.value){
			dimension.value = {rows: null, columns: null}
			showDimensionKeyboard.value = true
			values.value = []
		}else{
			values.value = Array.from({ length: dimension.value.rows }, () => Array.from({ length: dimension.value.columns }, () => ""))
		}



	}else if (value !== undefined) {
		const [dim, v] = value.split(";")

		const [rows, columns] = dim.split("x").map(Number)
		dimension.value = {
			columns: columns ?? 1,
			rows: rows ?? 1
		}

		values.value = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ""))

		let row = 0, column = 0
		v.split(',').forEach((a) => {
			values.value[row][column] = a
			column++
			if(column%dimension.value.columns===0){
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
		//TODO: add a reset function
	},
	setInput,
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)\nlist (affichage d'une liste)"
})

/**
 * Keyboards custom configuration
 */

// TODO: Move all these (duplicate) function to a class or something better
function matrixToTex(matrix: string[][], dim: {rows: number, columns: number}): string{

	let tex = "\\left(\\begin{array}{" + "c".repeat(dim.columns) + "}"

	tex += matrix.map(row=>row.map(a=>new Polynom(a).tex)).map(line => line.join("&")).join("\\\\[0.8em]")
	tex += "\\end{array}\\right)"

	return tex
}

// Values settings
const values = ref<string[][]>([])
const aij = ref<{ row: number, column: number } | null>(null)


// Dimension settings
const showDimensionKeyboard = ref<boolean>(true)
const dimension = ref<{ rows: number, columns: number }>({
	rows: null,
	columns: null,
})
const hasFixedDimension = computed<boolean>(() => fixedDimension.value[0] !== null)
const fixedDimension = computed<[number, number]>(() => {
	let dim: number[] = [null, null]
	props.keyboard.parameters.forEach(value => {
		if (value.match(/dim=\d+x\d+/)) {
			dim = value.split('dim=')[1].split('x').map(Number)
			return [null, null]
		}
	})
	return dim
})


function switchKeyboard(value?: boolean): void {
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

</script>

<template>
	<div class="flex flex-col gap-3 items-center">
		<div v-if="!hasFixedDimension">
			Dimension de la matrice: <span
				v-katex.inline="`${ dimension.rows ?? 'm' } \\times ${dimension.columns ?? 'n'}`"
			/>
		</div>
		<button
			v-if="!hasFixedDimension"
			@click="switchKeyboard"
			v-show="dimension.columns && dimension.rows"
		>
			dim à valeurs
		</button>

		<pi-matrix
			:matrix="values.map(row=>row.map(x=>new Fraction(x)))"
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
				:keyboard="keyboard.config.name"
				:disabled="aij===null"
				:class="aij===null?'cursor-not-allowed opacity-20':''"
				back
				reset
				@change="onKeyboardChange"
			/>
		</div>
	</div>
</template>
