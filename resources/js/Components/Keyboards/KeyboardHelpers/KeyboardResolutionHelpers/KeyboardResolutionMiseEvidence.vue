<script setup lang="ts">
import {Monom, PolyFactor, Polynom} from "pimath"
import {computed, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import KeyboardResolutionFactorisationWrapper
	from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionFactorisationWrapper.vue"
import {
	KeyboardResolutionFactorisationEmits
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const props = defineProps<{
	polynom: Polynom
}>()


const result = computed(buildResult)
const errorMessage = computed(() => result.value.error)
const isSuccess = computed(() => result.value.success)

const factor = ref<string>('?')
const tex = computed<string>(() => result.value.pf
	? `\\begin{aligned} & ${props.polynom.tex} = \\\\ & ${result.value.pf.tex} \\end{aligned}`
	: `\\begin{aligned} & ${props.polynom.tex} = \\\\ & ? \\end{aligned}`
)

function update(ev: KeyboardInputInterface) {
	factor.value = ev.input === '' ? '?' : ev.input

	emits('update', {
		polyfactor: result.value.pf,
		success: factor.value !== '1' && isSuccess.value
	})
}

interface FactorResult {
	pf: PolyFactor | null,
	error: string,
	success: boolean
}

function buildResult(): FactorResult {
	if (factor.value === '?') return {pf: null, error: '', success: false}

	let m: Monom
	try {
		m = new Monom(factor.value)
	} catch {
		return {
			pf: null,
			error: 'Le facteur mis en évidence n\'est pas reconnu.',
			success: false
		}
	}

	// On vérifie que le polynôme est divisible par m
	const p = new Polynom(props.polynom)

	try {
		p.divide(m)
	} catch {
		return {
			pf: null,
			error: `Le facteur \\( ${m.tex} \\) mis en évidence ne divise pas \\( ${props.polynom.tex} \\)`,
			success: false
		}
	}

	const pf = new PolyFactor(m, p)

	if (p.monoms.some(m => m.coefficient.isRational())) {
		return {
			pf,
			error: "La mise en évidence doit enlever toutes les fractions.",
			success: false
		}
	}

	return {pf, error: "", success: true}
}

const emits = defineEmits<KeyboardResolutionFactorisationEmits>()

</script>

<template>
	<keyboard-resolution-factorisation-wrapper
		:tex
		:error-message="errorMessage"
	>
		<keyboard-display
			keyboard="polynom"
			reset
			back
			@change="update"
		/>
	</keyboard-resolution-factorisation-wrapper>
</template>
