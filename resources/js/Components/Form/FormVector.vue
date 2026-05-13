<script setup lang="ts">
import {computed, markRaw, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {Vector} from "pimath"
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

const parseVector = computed<Vector | null>(() => {
	if (!value.value) return null

	try {
		const V = new Vector(value.value)
		if (V.display === '(())') return null
		if (V.tex.includes('NaN')) return null
		return markRaw(V)
	} catch {
		return null
	}
})

function validate(): string[] {
	return parseVector.value === null && value.value
		? ["le vecteur n'est pas reconnu"]
		: []
}

function onChange() {
	errors.value = validate()
	emits('errors', errors.value)
	emits('update', parseVector.value)
}

const tex = computed(() => parseVector.value?.tex ?? '')
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs, ...props}"
		:errors
		:icon="'bi bi-pencil'"
		:prepend="'\\((a;b)=\\)'"
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
		<template
			v-if="output"
			#message
		>
			<div
				v-if="output === true"
				v-katex.display="tex"
			/>
			<div
				v-else
				v-katex.auto="(output as string).replaceAll('$VALUE$', tex)"
			/>
		</template>
	</form-maker-wrapper>
</template>
