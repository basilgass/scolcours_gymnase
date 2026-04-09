<script setup lang="ts">
import {ref, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {Fraction} from "pimath"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

const props = defineProps<FormMakerBaseProps>()
const value = defineModel<string>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLInputElement>('input')
const {errors, expose} = useFormMaker(inputRef)

defineExpose<FormElementExpose>({
	...expose,
	validate
})

function validate(): string[] {
	if (!value.value) return []
	try {
		const F = new Fraction(value.value)
		if (F.isNaN()) return ["la fraction n'est pas reconnue"]
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
		errors.value = validate()
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
			:disabled="props.disabled"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="onChange"
		>
	</form-maker-wrapper>
</template>
