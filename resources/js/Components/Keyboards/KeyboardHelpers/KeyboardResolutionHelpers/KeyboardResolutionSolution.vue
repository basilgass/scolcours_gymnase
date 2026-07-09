<script setup lang="ts">
import {Fraction, PolyFactor, Random, Solution} from "pimath"
import {computed, ref, watch} from "vue"
import {
	equationLineType,
	KeyboardResolutionEmits
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import KeyboardQcm from "@/Components/Keyboards/KeyboardQcm.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {PiMathExt} from "@/PiMathExtended/PiMathExt.ts"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const props = defineProps<{
	equationLine: equationLineType
}>()

const factorId = ref<number | null>(null)
const factors = computed(() => {
	if (props.equationLine.polyfactor) {
		return props.equationLine.polyfactor.factors
	}
	return new PolyFactor().fromPolynom(props.equationLine.equation.left).factors
})
const selectedPolynom = computed(() => factors.value[factorId.value ?? -1]?.polynom ?? null)

const useDelta = computed(() => selectedPolynom.value?.degree().value === 2)

const solutionPossibles = computed<string[]>(() => {
	if (factorId.value === null) return []

	const polynom = factors.value[factorId.value].polynom

	const degree = polynom.degree().value

	if (degree === 0) return []

	if (degree === 1) {
		const k1 = polynom.monomByDegree().coefficient
		const k2 = polynom.monomByDegree(0).coefficient

		if (k1.isOne()) {
			return Random.shuffle([k2, k2.clone().opposite()].map(x => x.display))
		}

		return Random.shuffle([
			k2.clone().divide(k1),
			k2.clone().divide(k1).opposite(),
			k1.clone().divide(k2),
			k1.clone().divide(k2).opposite(),
		].map(x => x.display))
	}

	if (degree === 2) {
		// Delta
		return []
	}

	// gestion des cas de type x^n - 5 = 0

	return []
})
const qcmValues = computed(() => {
	return solutionPossibles.value.map(x => `${x}|${x}`)
})

const solutions = ref<Record<number, KeyboardInputInterface[]>>({})

function updateQcm(ev: KeyboardInputInterface) {
	if (factorId.value === null) return

	solutions.value[factorId.value] = [ev]

	update()

}

function parseSolutions(items: KeyboardInputInterface[]): KeyboardInputInterface {
	if (items.length === 0) {
		return {input: "", tex: "\\ldots", raw: ""}
	}

	if (items[0].input === 'RR') return items[0]
	if (items[0].input === '!!') return items[0]

	const input = `{${items.map(x => x.input).join(';')}}`
	const tex = `\\left\\{${items.map(x => x.tex).join(';')}\\right\\}`

	return {input, tex, raw: ""}
}

function updateDelta(ev: KeyboardInputInterface) {
	if (factorId.value === null) return

	if (selector.value === 'a') {
		if (ev.input === '') return a.value = '?'
		a.value = ev.input
	} else if (selector.value === 'b') {
		if (ev.input === '') return b.value = '?'
		b.value = ev.input
	} else if (selector.value === 'c') {
		if (ev.input === '') return c.value = '?'
		c.value = ev.input
	}

	// Toutes les valeurs ne sont pas données -> on ne pollue pas les réponses.
	if (a.value === '?' || b.value === '?' || c.value === '?') return

	// On ajoute les solutions.
	if (!parseDelta.value) return
	const {x1, x2} = parseDelta.value

	solutions.value[factorId.value] = [x1, x2]

	update()
}

function update() {
	emits('updateSolution', parseSolutions(Object.values(solutions.value).flat()))
}

const selector = ref<'a' | 'b' | 'c'>('a')
const a = ref<string>('?')
const b = ref<string>('?')
const c = ref<string>('?')

const parseDelta = computed(() => {
	let delta: Fraction | undefined
	let delta2: Fraction | undefined

	if (Fraction.isFraction(a.value) && Fraction.isFraction(b.value) && Fraction.isFraction(c.value)) {

		const aF = new Fraction(a.value)
		const bF = new Fraction(b.value)
		const cF = new Fraction(c.value)

		delta = new Fraction(bF.clone().pow(2)).subtract(aF.clone().multiply(4).multiply(cF))
		if (delta.isSquare()) {
			delta2 = delta.clone().sqrt()
		}

		const sol: Solution[] = Solution.fromQuadratic(aF, bF, cF)
		const [x1, x2] = sol.map(s => {
			return {input: s.display, tex: s.tex, raw: ""}
		})

		return {
			aF, bF, cF, delta, delta2,
			x1,
			x2
		}
	}

	return null
})
const w = (value: string | number) => PiMathExt.wrap(value)
const tex = computed(() => {
	if (!useDelta.value) return ""

	let delta: Fraction
	let delta2: Fraction
	if (parseDelta.value) {
		delta = parseDelta.value.delta
		delta2 = parseDelta.value.delta2
	}

	return `\\begin{aligned}
	\\Delta &= b^2-4ac \\\\
	&= ${w(b.value)}^2 - 4 \\cdot ${w(a.value)} \\cdot ${w(c.value)}\\\\
	&= ${delta ? delta.tex : '?'} ${delta2 ? `= ${delta2.tex}^2` : ''}
	\\end{aligned}`
})
const tex2 = computed(() => {
	// TODO: a améliorer
	if (!useDelta.value) return " ? "
	if (!parseDelta.value) return " ? "
	if (parseDelta.value.delta.isNegative()) return "\\text{Aucune solutions}"

	const {aF, bF, delta, delta2} = parseDelta.value

	if (delta.isZero()) {
		const x1 = bF.clone().opposite().divide(aF.clone().multiply(2))
		return `\\begin{aligned}
			x &= \\frac{-b}{2a} = \\frac{ ${w(-b.value)} }{ 2 \\cdot{ ${w(a.value)} } }\\\\
			x &=  ${x1.tex}\\\\
			\\end{aligned}`
	}
	const sq = delta2 ? delta2.tex : `\\sqrt{ ${delta.tex} }`

	const x1 = delta2
		? bF.clone().opposite().subtract(delta2).divide(aF.clone().multiply(2))
		: null
	const x2 = delta2
		? bF.clone().opposite().add(delta2).divide(aF.clone().multiply(2))
		: null

	return `\\begin{aligned}
	x_{1,2} &= \\frac{-b\\pm\\sqrt{\\Delta}}{2a}\\\\
	&= \\frac{ ${w(-b.value)} \\pm ${sq} }{ 2 \\cdot{ ${w(a.value)} } }\\\\
	x_1 &= \\frac{ ${w(-b.value)} - ${sq} }{ ${+a.value * 2} } ${x1 ? ('=' + x1.tex) : ''}\\\\
	x_2 &= \\frac{ ${w(-b.value)} + ${sq} }{ ${+a.value * 2} } ${x2 ? ('=' + x2.tex) : ''}\\\\
	\\end{aligned}`
})

const emits = defineEmits<KeyboardResolutionEmits>()

// Réinitialisation en cas de changement...
watch(factorId, () => {
	a.value = b.value = c.value = "?"
	selector.value = "a"
})

</script>

<template>
	<div>
		<div>Donner la solutions pour</div>

		<div class="flex flex-wrap gap-3">
			<template
				v-for="(factor, index) in factors"
				:key="`factor-${index}`"
			>
				<sc-button
					v-katex.nomargin="factor.tex"
					:outline="index !== factorId"
					type="action"
					sm
					@click="factorId=index"
				/>
			</template>
		</div>
		<div v-if="useDelta">
			<div v-katex.boxed="tex" />
			<div v-katex.boxed="tex2" />

			<div class="grid grid-cols-3 gap-3 mb-2">
				<sc-button
					v-katex.nomargin="`a=${a}`"
					type="action"
					:outline="selector!=='a'"
					sm
					@click="selector = 'a'"
				/>
				<sc-button
					v-katex.nomargin="`b=${b}`"
					type="action"
					:outline="selector!=='b'"
					sm
					@click="selector = 'b'"
				/>
				<sc-button
					v-katex.nomargin="`c=${c}`"
					type="action"
					:outline="selector!=='c'"
					sm
					@click="selector = 'c'"
				/>
			</div>

			<keyboard-display
				v-show="selector==='a'"
				keyboard="number"
				reset
				back
				@change="updateDelta"
			/>
			<keyboard-display
				v-show="selector==='b'"
				keyboard="number"
				reset
				back
				@change="updateDelta"
			/>
			<keyboard-display
				v-show="selector==='c'"
				keyboard="number"
				reset
				back
				@change="updateDelta"
			/>
		</div>
		<keyboard-qcm
			v-else
			:key="factorId"
			:keyboard="{
				values: qcmValues,
				parameters: ['flex','tex'],
			}"
			@change="updateQcm"
		/>
	</div>
</template>
