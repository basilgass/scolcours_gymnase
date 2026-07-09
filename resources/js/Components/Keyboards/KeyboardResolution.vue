<script lang="ts" setup>/**
 * KeyboardResolution : pour aider à résoudre des équations ou des systèmes
 * emits: ["validate", "next", "change", "clear"]
 */
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"
import {type Component, computed, ref, shallowRef, triggerRef} from "vue"
import {Equation} from "pimath"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {
	equationLineType,
	KeyboardResolutionEvent,
	operationIdType
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import KeyboardResolutionEquivalence
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionEquivalence.vue"
import KeyboardResolutionFactorisation
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionFactorisation.vue"
import KeyboardResolutionSolution
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionSolution.vue"
import {asciiToTex} from "@/Composables/keyboardConfig.ts"


// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	// Augmentation de l'opération id, pour la réactivité
	triggerRef(equationLines)

	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value !== undefined) {
		return {input: value, tex: asciiToTex(value), raw: ""}
	}

	return solution.value?.input
		? solution.value
		: {input: "", tex: "\\ldots", raw: ""}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		equationLines.value = [{
			equation: new Equation(props.keyboard.values[0]),
			polyfactor: null,
			operation: null
		}]

		solution.value = null
		nextLine.value = null
	},
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */
const numericOutput = computed<boolean>(() => {
	return props.keyboard.parameters.includes('decimal')
})

// Nouvelle version
const kbrds: Record<operationIdType, Component> = {
	'equivalence': KeyboardResolutionEquivalence,
	'factorisation': KeyboardResolutionFactorisation,
	'solution': KeyboardResolutionSolution
}

const equationLines = shallowRef<equationLineType[]>([
	{
		equation: new Equation(props.keyboard.values[0]),
		polyfactor: null,
		operation: null
	}
])
const lastLine = computed(() => equationLines.value?.[equationLines.value.length - 1] ?? null)
const nextLine = shallowRef<equationLineType | null>(null)

const solution = ref<KeyboardInputInterface | null>(null)

// display UI
const showAllLines = ref(false)
const canDelete = computed(() => {
	return equationLines.value.length > 1
})

const availableOperations: operationIdType[] = ['equivalence', 'factorisation', 'solution']
const selectedOperation = ref<operationIdType>('factorisation')

const canFactorize = computed(() => {
	return equationLines.value[equationLines.value.length - 1]
		.equation.right
		.isZero()
})
const canGiveSolution = computed(() => {
	// Pas de données
	if (equationLines.value.length === 0) return false

	// Equation du premier degré, de la forme x=a
	if (equationLines.value[0].equation.left.display === 'x' && equationLines.value[0].equation.right.degree().isZero()) return true

	return equationLines.value.length > 1 // && availableFactors.value.length === 0
})

// display TeX
const displayTex = computed(() => {
	const lines: string[] = []

	equationLines.value.forEach((line) => {
		const equ = line.polyfactor
			? `${line.polyfactor.asRoot.tex}&=0`
			: `${line.equation.left.tex}&=${line.equation.right.tex}`

		const op = formatValue(line.operation)

		lines.push(`${equ}\\quad&${op}`)
	})

	return showAllLines.value
		? `\\def\\arraystretch{1.5em}\\begin{darray}{rl|l}${lines.join('\\\\')}\\end{darray}`
		: `\\def\\arraystretch{1.5em}\\begin{darray}{rl|l}${lines[lines.length - 1]}\\end{darray}`
})

function formatValue(value: string | null): string {
	if (value === null || value === "") return ' \\dots '

	const op = value[0]

	if (op === '+' || op === '-') return value

	const v = value.substring(1)
	if (op !== '*' && op !== '/') {
		return ` ? `
	}

	const opF = op === '/' ? '\\div' : '\\cdot'
	return v.startsWith('-')
		? `${opF}\\left( ${v} \\right)`
		: `${opF}${v}`
}


// Inversion de l'équation gauche - droite
function revertEquation(): void {
	const line = equationLines.value.pop()
	if (!line) return

	line.equation = new Equation(line.equation.right.clone(), line.equation.left.clone())
	equationLines.value.push(line)

	onChange()
}

const canApply = ref<boolean>(false)

function apply(): void {
	if (nextLine.value === null) return

	// création de la ligne suivante.
	equationLines.value.push(nextLine.value)

	onChange()
}

function onKeyboardChange(line: KeyboardResolutionEvent): void {
	// modification de la ligne acutelle (affichage de l'opération
	if (line.method === 'equivalence') {
		equationLines.value[equationLines.value.length - 1].operation = line.value
	}

	// préparation de la ligne suivante...
	canApply.value = line.success
	nextLine.value = {
		operation: null,
		polyfactor: line.polyfactor?.clone() ?? null,
		equation: line.equation.clone()
	}

	onChange()
}

function onSolutionChange(ev: KeyboardInputInterface) {
	solution.value = ev

	onChange()
}

function removeLastOperation() {
	if (equationLines.value.length === 1) return

	equationLines.value.pop()
	equationLines.value[equationLines.value.length - 1].operation = null

	onChange()
}

</script>

<template>
	<div class="space-y-3">
		<!-- output TeX -->
		<div>
			<div v-katex.boxed.nomargin="displayTex" />
			<div class="flex justify-between">
				<sc-button
					ghost
					xs
					@click="showAllLines=!showAllLines"
				>
					<i class="bi bi-eye" />{{ showAllLines ? 'toutes les lignes' : 'dernière ligne' }}
				</sc-button>

				<sc-button
					xs
					ghost
					type="action"
					@click="revertEquation"
				>
					<i class="bi bi-arrows-expand-vertical" />
				</sc-button>

				<sc-button
					type="delete"
					ghost
					xs
					class="transition-opacity"
					:class="canDelete ? 'opacity-100' : 'opacity-30'"
					:disabled="!canDelete"
					@click="removeLastOperation"
				>
					<i class="bi bi-trash" /> supprimer
				</sc-button>
			</div>
		</div>
		<!-- fin de output TeX -->

		<!-- operations possibles -->
		<div
			v-if="availableOperations.length"
			class="flex gap-3 flex-wrap"
		>
			<sc-button
				v-for="item in availableOperations"
				:key="item"
				type="action"
				:outline="selectedOperation!==item"
				xs
				:title="item"
				@click="selectedOperation = item"
			>
				{{ item }}
			</sc-button>
		</div>

		<!-- appliquer les opérations d'équivalence -->
		<div class="flex gap-3 items-baseline">
			<sc-button
				type="action"
				:outline="!canApply"
				sm
				class="flex-1"
				:disabled="!canApply"
				@click="apply"
			>
				<i class="bi bi-plus-circle mr-2" />appliquer
			</sc-button>
		</div>

		<!-- le clavier en fonction de l'opération -->
		<div
			v-if="lastLine"
		>
			<component
				:is="kbrds[selectedOperation]"
				:equation-line="lastLine"
				@update="onKeyboardChange"
				@update-solution="onSolutionChange"
			/>
		</div>
	</div>
</template>

