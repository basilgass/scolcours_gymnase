<script setup lang="ts">
import {ref, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import {Fraction} from "pimath"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"

defineOptions({
	inheritAttrs: false
})

const value = defineModel<string>()
const input = useTemplateRef('input')
const errors = ref<string[]>([])

const props = defineProps<FormMakerPropsNewType>()

defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate
})

const emits = defineEmits<FormElementEmits>()

function validate(): string[] {
	if (value.value === '') {
		return []
	}

	try {
		// seul les caractèrs +-/[0-9] sont autorisé.
		const F = new Fraction(value.value)
		if (F.isNaN()) {
			return ["la fraction n'est pas reconnue"]
		}
	} catch {
		return ["la fraction n'est pas reconnue"]
	}

	return []
}

function onChange() {
	errors.value = []

	const [, den] = value.value.split('/')
	if (den && Number(den) === 0) {
		errors.value = ['Division par zéro!']
	} else {
		const validation = validate()
		errors.value = validation.length > 0 ? validation : []
	}
	emits('errors', errors.value)
	emits('update', value.value)
}
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
		:errors
		:icon="'bi bi-pencil'"
		:prepend="'\\(a/b=\\)'"
	>
		<input
			ref="input"
			type="text"
			v-model="value"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="onChange"
		>
	</form-maker-wrapper>
</template>
