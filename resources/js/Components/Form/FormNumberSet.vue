<script setup lang="ts">
import {computed, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"
import {formatNumberSetKatex, parseNumberSet} from "@/Composables/useNumberSet.ts"

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

const parsed = computed(() => parseNumberSet(value.value ?? ''))

function validate(): string[] {
	return parsed.value.errors
}

function onChange() {
	errors.value = validate()
	emits('errors', errors.value)
	emits('update', parsed.value.values)
}

const tex = computed(() => formatNumberSetKatex(parsed.value.values))
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs, ...props}"
		:errors
		:icon="'bi bi-list-ol'"
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
