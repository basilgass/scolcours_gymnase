<script setup lang="ts">
import {Monom, PolyFactor, Polynom} from "pimath"
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

const result = computed(buildResult)
const isSuccess = computed(() => result.value.success)
const errorMessage = computed(() => result.value.error)

const selector = ref<'a' | 'b'>('a')
const a = ref<string>('?')
const b = ref<string>('?')

const tex = computed<string>(() => {
	const data: FactorResult = result.value

	if (!data.ok) {
		return `\\def\\arraystretch{1.5em}
		\\begin{aligned}
		&${props.polynom.tex} = \\\\
		& a\\left(\\ldots \\right) +b \\left(\\ldots\\right) = \\\\
		& (a+b)(\\ldots) \\\\
		\\end{aligned}`
	}

	const {ma, aPolynom, mb, bPolynom, pf} = data
	return `\\def\\arraystretch{1.5em}
		\\begin{aligned}
		&${props.polynom.tex} = \\\\
		& ${ma.tex}\\left(${aPolynom.tex}\\right) ${mb.coefficient.isPositive() ? '+' : ''}${mb.tex}\\left(${bPolynom.tex}\\right) = \\\\
		& ${isSuccess.value ? '\\color{#6c6}' : ''}${pf.tex} = \\\\
		& \\scriptsize ${pf.clone().develop().tex}
		\\end{aligned}`
})


function update(ev: KeyboardInputInterface) {
	if (selector.value === 'a') {
		if (ev.input === '') return a.value = '?'
		a.value = ev.input
	} else {
		if (ev.input === '') return b.value = '?'
		b.value = ev.input
	}

	emits('update', {
		polyfactor: result.value?.pf,
		success: isSuccess.value
	})
}

type FactorResult =
	{ ok: false; pf: null; error: string; success: false } |
	{
		ok: true;
		ma: Monom;
		aPolynom: Polynom;
		mb: Monom;
		bPolynom: Polynom;
		pf: PolyFactor;
		error: string;
		success: boolean
	}

function errorReturn(message: string): FactorResult {
	return {
		ok: false,
		pf: null,
		error: message,
		success: false
	}
}

function buildResult(): FactorResult {
	if (a.value === '?' && b.value === '?') return errorReturn('')

	const aPolynom = props.polynom.clone()
	aPolynom.monoms.splice(2)
	const bPolynom = props.polynom.clone()
	bPolynom.monoms.splice(0, 2)

	let ma: Monom
	let mb: Monom
	try {
		ma = new Monom(a.value === '?' ? 'a' : a.value)
		mb = new Monom(b.value === '?' ? 'b' : b.value)
	} catch {
		return errorReturn("Les valeurs données ne sont pas reconnues.")
	}

	if (a.value !== '?') {
		try {
			aPolynom.divide(ma)
		} catch {
			return errorReturn(`\\( ${ma.tex} \\) ne divise pas \\( ${aPolynom.tex} \\)`)
		}
	}

	if (b.value !== '?') {
		try {
			bPolynom.divide(mb)
		} catch {
			return errorReturn(`\\( ${mb.tex} \\) ne divise pas \\( ${bPolynom.tex} \\)`)
		}
	}

	const pf = new PolyFactor(ma)
		.multiply(new PolyFactor(bPolynom))
		.add(
			new PolyFactor(mb)
				.multiply(new PolyFactor(bPolynom))
		)
	const success = pf.develop().isEqual(new PolyFactor(props.polynom))

	return {
		ok: true,
		ma, aPolynom, mb, bPolynom,
		pf,
		success,
		error: ''
	}
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
			keyboard="polynom"
			reset
			back
			@change="update"
		/>
		<keyboard-display
			v-show="selector==='b'"
			keyboard="polynom"
			reset
			back
			@change="update"
		/>
	</keyboard-resolution-factorisation-wrapper>
</template>
