<script setup lang="ts">
import {Fraction, Polynom} from "pimath"
import {ref} from "vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	equationLineType,
	KeyboardResolutionEmits
} from "@/Components/Keyboards/KeyboardHelpers/KeyboardResolutionHelpers/KeyboardResolutionHelpers.ts"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const props = defineProps<{
	equationLine: equationLineType
}>()

const value = ref<string>("")
const isSuccess = ref<boolean>(false)
const errorMessage = ref<string>('')

function update(ev: KeyboardInputInterface) {
	value.value = ev.input === '' ? '\\ldots' : ev.input

	// Validation de l'opération
	checkResult()

	const operation = value.value.substring(0, 1)
	const equ = props.equationLine.equation.clone()
	if (operation === '+' || operation === '-') {
		const m = new Polynom(value.value)
		equ.add(m)
	}
	if (operation === '*') {
		const f = new Fraction(value.value.substring(1).replaceAll(/[()]/g, ''))
		equ.multiply(f)
	}
	if (operation === '/') {
		const f = new Fraction(value.value.substring(1).replaceAll(/[()]/g, ''))
		equ.divide(f)
	}

	emits('update', {
		method: 'equivalence',
		equation: equ,
		value: value.value,
		success: isSuccess.value
	})
}

function checkResult() {
	errorMessage.value = ""
	isSuccess.value = false

	const operation = value.value.substring(0, 1)

	if (!['*', '/', '+', '-'].includes(operation)) {
		errorMessage.value = "une opération d'équivalence commence par \\(\\times, \\div, + \\) ou \\(-\\)"
		return
	}
	if (value.value.length === 1) {
		// errorMessage.value = "il faut ajouter une valeur après l'opération !"
		return
	}

	isSuccess.value = true
}

const emits = defineEmits<KeyboardResolutionEmits>()

</script>

<template>
	<div
		v-show="errorMessage"
		v-katex.auto="errorMessage"
		class="border border-red-600 bg-red-50 text-red-600
		 px-3 py-1 mb-2
		 text-sm"
	/>

	<keyboard-display
		keyboard="polynom"
		reset
		back
		@change="update"
	/>
</template>
