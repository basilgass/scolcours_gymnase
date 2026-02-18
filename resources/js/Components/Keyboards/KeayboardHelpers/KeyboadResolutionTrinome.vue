<script setup lang="ts">
import {Monom, Polynom} from "pimath"
import {computed, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {KbrdEvent} from "@/types"

const props = defineProps<{
	polynom: Polynom
}>()

const selector = ref<'a' | 'b'>('a')
const a = ref<string>('a')
const b = ref<string>('b')
const isSuccess = ref<boolean>(false)
const tex = computed<string>(() => {
	if (a.value === '?' || b.value === '?') return ' ? '

	const {p, pa, pb, tex} = makePolynom()

	return p
		? `\\def\\arraystretch{1.5em}\\begin{aligned}&(${pa.tex})(${pb.tex}) = \\\\ & \\scriptsize ${tex} = \\\\ &${p.tex}\\end{aligned}`
		: '?'
})

function update(ev: KbrdEvent) {
	if (selector.value === 'a') {
		if (ev.input === '') return a.value = 'a'
		a.value = ev.input
	} else {
		if (ev.input === '') return b.value = 'b'
		b.value = ev.input
	}

	checkResult()
}

function wrap(value: string) {
	if (isNaN(+value)) return value

	return +value < 0 ? `(${value})` : value
}

function makePolynom(): { pa: Polynom, pb: Polynom, p: Polynom, tex: string } {

	const ma = new Monom(isNaN(+a.value) ? 'a' : a.value)
	const mb = new Monom(isNaN(+b.value) ? 'b' : b.value)

	let a_plus_b = 'a+b'
	let a_mult_b = 'a \\cdot b'

	if (ma.display !== 'a') {
		a_plus_b = a_plus_b.replace('a', wrap(a.value))
		a_mult_b = a_mult_b.replace('a', wrap(a.value))
	}
	if (mb.display !== 'b') {
		a_plus_b = a_plus_b.replace('b', wrap(b.value))
		a_mult_b = a_mult_b.replace('b', wrap(b.value))
	}


	const pa = new Polynom('x').add(ma)
	const pb = new Polynom('x').add(mb)

	const p = pa.clone().multiply(pb).reduce()

	const tex = `x^2+(${a_plus_b})x+${a_mult_b}`

	return {
		pa, pb, p, tex
	}

}

function checkResult() {
	const {p} = makePolynom()

	isSuccess.value = p
		? p.isEqual(props.polynom)
		: false
}

function onValidate() {
	const {pa, pb} = makePolynom()

	emits('validate', [pa, pb])
}

const emits = defineEmits<{
	validate: [ev: [Polynom, Polynom]]
}>()

</script>

<template>
	<div v-katex.boxed="polynom.tex" />

	<div class="flex justify-around">
		<button
			v-katex.nomargin="`a=${a}`"
			:class="[
				'keyboard-key px-5',
				selector==='a' ? 'text-blue-400' : ''
			]"
			@click="selector = 'a'"
		/>
		<div
			v-katex.nomargin="`b=${b}`"
			:class="[
				'keyboard-key px-5',
				selector==='b' ? 'text-blue-400' : ''
			]"
			@click="selector = 'b'"
		/>
	</div>
	<div v-katex.boxed="tex" />

	<button
		v-show="isSuccess"
		class="keyboard-key w-full my-3"
		@click="onValidate"
	>
		appliquer
	</button>

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
</template>
