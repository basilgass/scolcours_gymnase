<script setup lang="ts">
import {Fraction, Monom, PolyFactor, Polynom} from "pimath"
import {computed, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardResolutionFactorisationEmits
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import KeyboardResolutionFactorisationWrapper
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionFactorisationWrapper.vue"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const props = defineProps<{
	polynom: Polynom
}>()

const isSuccess = ref<boolean>(false)
const errorMessage = computed(() => {
	if (props.polynom.degree().value <= 1) {
		return `Il n'est pas possible d'utiliser cette méthode avec \\(${props.polynom.tex}\\).`
	}

	if (props.polynom.monoms.length !== 3) {
		return `Trinôme \\(\\implies \\) trois monômes ! \\(${props.polynom.tex}\\) a \\(${props.polynom.monoms.length}\\) monôme(s).`
	}

	if (!props.polynom.monomByDegree().coefficient.isOne()) {
		return `Unitaire \\(\\implies\\) \\(${props.polynom.monomByDegree().tex}\\) n'est pas unitaire !`
	}

	const m2 = props.polynom.monomByDegree()
	const m1 = props.polynom.monomByDegree(m2.degree().value / 2)
	const m0 = props.polynom.monomByDegree(0)

	if (m1.isZero() || m0.isZero()) {
		return `Il n'est pas possible d'utiliser cette avec \\(${props.polynom.tex}\\).`
	}
	return ""
})

const selector = ref<'a' | 'b'>('a')
const a = ref<string>('?')
const b = ref<string>('?')

const tex = computed<string>(() => {
	const data = makePolynom()

	if (!data) return '?'
	const {p, pa, pb} = data

	return `\\def\\arraystretch{1.5em}\\begin{aligned} &${props.polynom.tex} = \\\\ &(${pa.tex})(${pb.tex}) = \\\\ & ${isSuccess.value ? '\\color{#6c6}' : ''}${p.tex}\\end{aligned}`
})

function update(ev: KeyboardInputInterface) {
	if (selector.value === 'a') {
		if (ev.input === '') return a.value = '?'
		a.value = ev.input
	} else {
		if (ev.input === '') return b.value = '?'
		b.value = ev.input
	}

	isSuccess.value = checkResult()

	const data = makePolynom()
	if (!data) return

	const {pa, pb} = data

	emits('update', {
		polyfactor: new PolyFactor(pa, pb),
		success: isSuccess.value
	})
}

function makePolynom(): { pa: Polynom, pb: Polynom, p: Polynom } | null {
	// Détermination de la variable 'x'
	const m2 = props.polynom.monomByDegree()
	if (m2.degree().value % 2 !== 0) {
		return null
	}
	m2.sqrt()

	const ma = new Monom(isNaN(+a.value) ? 'a' : a.value)
	const mb = new Monom(isNaN(+b.value) ? 'b' : b.value)

	const pa = new Polynom(m2).add(ma)
	const pb = new Polynom(m2).add(mb)

	const p = pa.clone().multiply(pb).reduce()

	return {pa, pb, p}

}

function checkResult(): boolean {
	if (
		a.value === 'a' ||
		!Fraction.isFraction(a.value) ||
		b.value === 'b' ||
		!Fraction.isFraction(b.value)
	) {
		return false
	}

	const data = makePolynom()

	return data
		? data.p.isEqual(props.polynom)
		: false
}

const emits = defineEmits<KeyboardResolutionFactorisationEmits>()

</script>

<template>
	<keyboard-resolution-factorisation-wrapper
		:tex
		:error-message="errorMessage"
	>
		<div class="grid grid-cols-2 gap-3 mb-2">
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
		</div>

		<keyboard-display
			v-show="selector==='a'"
			keyboard="number"
			reset
			back
			@change="update"
		/>
		<keyboard-display
			v-show="selector==='b'"
			keyboard="number"
			reset
			back
			@change="update"
		/>
	</keyboard-resolution-factorisation-wrapper>
</template>
