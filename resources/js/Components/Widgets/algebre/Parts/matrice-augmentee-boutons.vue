<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, nextTick, ref} from "vue"
import {Fraction} from "pimath"

const props = defineProps<{
	currentLine: number,
	numberOfLines: number
}>()

export interface matriceAugmenteeInterface {
	target: number,
	operation: `+` | '*' | 'x',
	value: string, // can be a number or a fraction
	reference: number | null
}

const emits = defineEmits<{
	validate: [value: matriceAugmenteeInterface | boolean]
}>()

const operation = ref<'+' | '*' | 'x' | ''>("")
const available_operation = {
	'+': 'bi bi-plus-lg',
	'*': 'bi bi-x-lg',
	'x': 'bi bi-shuffle'
}

function selectOperation(key: '+' | '*' | 'x') {
	operation.value = key

	nextTick(() => {
		opInput.value.focus()
	})
}

const opValue = ref("")
const opInput = ref(null)

function checkValue(value: string) {
	try {
		const F = new Fraction(value)
		return !F.isNaN()
	} catch {
		return false
	}
}

function checkLineReference(lineNumber: number) {
	const zeroIndexedLine = lineNumber - 1
	if (zeroIndexedLine === props.currentLine) {
		return false
	}

	if (zeroIndexedLine < 0) {
		return false
	}

	if (zeroIndexedLine > props.numberOfLines) {
		return false
	}

	return true
}

const showValidateButton = computed(() => {
	if (operation.value === "" || opValue.value === "") {
		return false
	}

	if (operation.value === '*') {
		return checkValue(opValue.value)
	}

	if (operation.value === 'x') {
		const line = +opValue.value
		return checkLineReference(line)
	}

	if (operation.value === '+') {
		const [value, reference] = opValue.value.split(/[lL]/)

		if (!reference) {
			return false
		}
		return checkValue(value) && checkLineReference(+reference)
	}
})

function validate() {
	if (showValidateButton.value === false) {
		return
	}

	let [value, reference] = opValue.value.split(/[lL]/)

	if (operation.value === 'x') {
		value = (+value - 1).toString()
	}

	// Controls
	emits('validate', {
		target: props.currentLine,
		operation: operation.value,
		value,
		reference: (reference && !isNaN(+reference)) ? +reference - 1 : null
	})

	// Reset the elements.
	operation.value = ""
	opValue.value = ""
}
</script>

<template>
	<div class="flex items-baseline">
		<div class="w-[30px] ">
			L{{ currentLine + 1 }}
		</div>
		<button
			v-for="(op, key) in available_operation"
			:key="`operation-${key}`"
			class="btn btn-xs w-[30px] rounded-r-none"
			:class="{
				'bg-blue-300': key===operation,
				'bg-blue-100': key!==operation,
				'rounded-l-none': key!=='+',
			}"
			@click="selectOperation(key)"
		>
			<i :class="op" />
		</button>
		<form-maker
			ref="opInput"
			sm
			:disabled="operation===''"
			input-class="max-w-[70px]"
			v-model="opValue"
			@enter="validate"
		/>
		<button
			@click="validate"
			class="btn btn-xs w-[40px]  rounded-l-none"
			:class="showValidateButton? 'bg-green-400': 'bg-gray-100'"
		>
			OK
		</button>
	</div>
</template>

<style scoped>

</style>
