<script setup lang="ts">
import {Monom, Polynom} from "pimath"
import {computed, ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {KbrdEvent} from "@/types"

const props = defineProps<{
	polynom: Polynom
}>()

const factor = ref<string>('?')
const isSuccess = ref<boolean>(false)
const tex = computed<string>(() => {
	if (factor.value === '?') return ' ? '

	const {p, tex} = makePolynom()

	return p
		? tex
		: '?'
})

function update(ev: KbrdEvent) {
	factor.value = ev.input === '' ? '1' : ev.input

	checkResult()
}

function makePolynom(): { m: Monom, p: Polynom, tex: string } {
	let m: Monom
	try {
		m = new Monom(factor.value)
	} catch {
		m = new Monom().one()
	}

	try {
		const p = props.polynom.clone().divide(m)
		const tex = `${m.tex} \\left( ${p.tex} \\right)`

		return {
			m, p, tex
		}
	} catch {
		// La division ne fonctionne pas !!!!
		return {
			m, p: null, tex: `${m.tex} \\left( \\text{\\color{red} erreur } \\right)`
		}
	}

}

function checkResult() {
	const {m, p} = makePolynom()

	const gcd = Monom.gcd(...props.polynom.monoms)

	isSuccess.value = p
		? gcd.isEqual(m)
		: false
}

function onValidate() {
	const {m, p} = makePolynom()

	emits('validate', [new Polynom(m), p])
}

const emits = defineEmits<{
	validate: [ev: [Polynom, Polynom]]
}>()

</script>

<template>
	<div v-katex.boxed="polynom.tex" />

	<div v-katex.boxed="tex" />

	<button
		v-show="isSuccess"
		class="keyboard-key w-full my-3"
		@click="onValidate"
	>
		appliquer
	</button>


	<keyboard-display
		keyboard="polynom"
		reset
		back
		@change="update"
	/>
</template>
