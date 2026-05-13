<script setup lang="ts">
import {computed, markRaw, useTemplateRef} from "vue"
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

const parseFraction = computed<Fraction | null>(() => {
	if (!value.value) return null

	try {
		const F = new Fraction(value.value)
		if (F.isNaN()) return null

		const [, den] = value.value.split('/')
		if (den && Number(den) === 0) return null

		return markRaw(F)
	} catch {
		return null
	}
})

function validate(): string[] {
	return parseFraction.value === null
		? ["la fraction n'est pas reconnue"]
		: parseFraction.value.isInfinity()
			? ['division par zéro !']
			: []
}

function onChange() {
	errors.value = validate()

	emits('errors', errors.value)
	emits('update', parseFraction.value)
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
			v-model="value"
			type="text"
			:disabled="props.disabled"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="onChange"
		>
	</form-maker-wrapper>
</template>
