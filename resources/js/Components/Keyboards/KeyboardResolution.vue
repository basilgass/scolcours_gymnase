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
import {computed, onMounted, ref, useTemplateRef} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {Equation, Fraction, PolyFactor, Polynom} from "pimath"
import KeyboadResolutionTrinome from "@/Components/Keyboards/KeayboardHelpers/KeyboadResolutionTrinome.vue"
import KeyboadResolutionMiseEvidence from "@/Components/Keyboards/KeayboardHelpers/KeyboadResolutionMiseEvidence.vue"
import Accordion from "@/Components/Ui/Accordion.vue"
import AccordionItem from "@/Components/Ui/AccordionItem.vue"


// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	if (value === "") {
		// Reset des réponses.

	} else if (value !== undefined) {

	}

	equationID.value = resolutionOutput.length - 1
	const lastLine = resolutionOutput[equationID.value]

	canFactorize.value = lastLine.equ.right.isZero()
	factors.value = lastLine.polyfactor?.factors.map(x => x.tex) ?? [lastLine.equ.left.tex]
	return {
		input: lastLine.equ.right.display ?? '',
		tex: TeXoutput(),
		raw: ""
	}
}

defineExpose<KeyboardExposeInterface>({
	reset: () => {
		// reset function
	},
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */

const systemMode = computed<boolean>(() => {
	return props.keyboard.values.length > 1
})

const numericOutput = computed<boolean>(() => {
	return props.keyboard.parameters.includes('decimal')
})

interface IRESOLLINE {
	equ: Equation,
	polyfactor: PolyFactor,
	value: string
}

const equationID = ref<number>(null)
const resolutionOutput: IRESOLLINE[] = []

function TeXoutput(): string {
	const lines: string[] = []
	resolutionOutput.forEach(line => {
		// S'il y a plusieurs éléments, c'est que tout est à gauche, à droite, c'est zéro
		const equ = line.polyfactor
			? `${line.polyfactor.asRoot.tex}&=0`
			: `${line.equ.left.tex}&=${line.equ.right.tex}`

		const op = formatValue(line.value)

		lines.push(`${equ}\\quad&${op}`)
	})

	return `\\def\\arraystretch{1.5em}\\begin{darray}{rl|l}${lines.join('\\\\')}\\end{darray}`
}

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


const keyboardRef = useTemplateRef<InstanceType<typeof KeyboardDisplay>>('keyboard')

function onKeyboardChange(event: KeyboardInputInterface): void {
	const line = resolutionOutput.pop()
	line.value = event.input
	resolutionOutput.push(line)

	onChange()
}

function revertEquation(): void {
	const line = resolutionOutput.pop()
	line.equ = new Equation(line.equ.right.clone(), line.equ.left.clone())
	resolutionOutput.push(line)

	onChange()
}

function applyOperation() {
	if (resolutionOutput.length === 0) {
		resolutionOutput.push({
			equ: new Equation(props.keyboard.values[0]),
			polyfactor: null,
			value: null
		})
		resolutionOutput.push({
			equ: new Equation('4x^2-20x+24=0'),
			polyfactor: null,
			value: null
		})

		onChange()

		return
	}

	const {equ: refEqu, value} = resolutionOutput[equationID.value]

	if (!value) {
		return
	}

	const operation = value[0]

	if (!['*', '/', '+', '-'].includes(operation)) {
		return
	}

	const equ = refEqu.clone()
	if (operation === '+' || operation === '-') {
		const m = new Polynom(value)
		equ.add(m)
	}
	if (operation === '*') {
		const f = new Fraction(value.substring(1).replaceAll(/[()]/g, ''))
		equ.multiply(f)
	}
	if (operation === '/') {
		const f = new Fraction(value.substring(1).replaceAll(/[()]/g, ''))
		equ.divide(f)
	}

	resolutionOutput.push({
		equ,
		value: null,
		polyfactor: null
	})

	keyboardRef.value.resetKeyStrokes()
	onChange()
}

function removeLastOperation() {
	if (resolutionOutput.length === 1) return

	keyboardRef.value.resetKeyStrokes()
	resolutionOutput.pop()
	resolutionOutput[resolutionOutput.length - 1].value = null

	onChange()
}

const canFactorize = ref(false)
const factorize = ref(false)
const factors = ref<string[]>([])
const factorId = ref<number>(null)
const factorPolynom = computed(() => {
	if (factorId.value === null) return null

	if (!resolutionOutput[equationID.value].polyfactor) return resolutionOutput[equationID.value].equ.left

	return resolutionOutput[equationID.value].polyfactor.factors[factorId.value].polynom
})

function toggleFactorization() {
	const {polyfactor} = resolutionOutput[equationID.value]

	if (polyfactor) {
		factorize.value = true
		return
	}

	factorize.value = !factorize.value
}

function applyFactorization(polynoms: Polynom[]) {
	const {equ, polyfactor} = resolutionOutput[equationID.value]

	const updatedFactor = polyfactor?.factors[factorId.value].clone() ?? null

	resolutionOutput.push({
		equ: equ.clone(),
		value: null,
		polyfactor: polyfactor?.clone() ?? new PolyFactor()
	})


	equationID.value++
	resolutionOutput[equationID.value].polyfactor
		.multiply(...polynoms.map(x => new PolyFactor(x)))

	if (updatedFactor) {
		resolutionOutput[equationID.value].polyfactor
			.divide(new PolyFactor(updatedFactor))
			.reduce()
	}

	factorId.value = null
	onChange()
}

onMounted(() => {
	applyOperation()
})
</script>

<template>
	<div class="space-y-3">
		<div class="flex gap-3 items-baseline">
			<button
				class="keyboard-key flex-1"
				@click="applyOperation"
			>
				<i class="bi bi-plus-circle mr-2" />appliquer
			</button>
			<button
				class="keyboard-key bg-red-300"
				@click="removeLastOperation"
			>
				<i class="bi bi-trash" />
			</button>
		</div>

		<button
			class="keyboard-key w-full"
			@click="revertEquation"
		>
			<i class="bi bi-arrows-expand-vertical" />
		</button>

		<button
			v-show="canFactorize"
			class="keyboard-key w-full"
			:class="factorize ? 'btn-active':''"
			@click="toggleFactorization"
		>
			factoriser
		</button>

		<KeyboardDisplay
			v-show="!factorize"
			ref="keyboard"
			keyboard="equation"
			back
			reset
			@change="onKeyboardChange"
		/>
		<div v-if="factorize">
			<div class="flex gap-3 flex-wrap">
				<div
					v-for="(factor, index) in factors"
					:key="`factor-${index}`"
					v-katex.nomargin="factor"
					:class="[
						'keyboard-key',
						factorId===index ? 'btn-active' : ''
					]"
					@click="factorId = index"
				/>
			</div>

			<accordion
				v-if="factorPolynom"
				multiple
			>
				<accordion-item :id="1">
					<template #title>
						mise en évidence
					</template>

					<keyboad-resolution-mise-evidence
						:polynom="factorPolynom"
						@validate="applyFactorization"
					/>
				</accordion-item>


				<accordion-item :id="2">
					<template #title>
						produit remarquable
					</template>
				</accordion-item>
				<accordion-item :id="3">
					<template #title>
						décomposition du trinôme
					</template>
					<keyboad-resolution-trinome
						:polynom="factorPolynom"
						@validate="applyFactorization"
					/>
				</accordion-item>
				<accordion-item :id="4">
					<template #title>
						formule du discriminant
					</template>
				</accordion-item>
			</accordion>
		</div>
	</div>
</template>

