<script setup lang="ts">
import {computed, useTemplateRef} from "vue"
import {
	FormElementEmits,
	FormElementExpose,
	FormMakerBaseProps,
	TextInputType
} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	type?: TextInputType
}

const props = defineProps<Props>()
const value = defineModel<string | number>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLInputElement>('input')
const {errors, expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const htmlType = computed(() => props.type === 'id' ? 'text' : (props.type ?? 'text'))

const iconValue = computed(() => {
	if (typeof props.icon === "string") return props.icon
	if (props.type === "number") return "bi bi-123"
	if (props.type === "text") return "bi bi-fonts"
	if (props.type === "id") return "bi bi-key"
	return false
})
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
		v-model="value"
		:icon="iconValue"
		:errors
		@button-click="emits('button')"
	>
		<input
			ref="input"
			v-model="value"
			:type="htmlType"
			:disabled="props.disabled"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="emits('update', value)"
			@keyup.enter="emits('enter', value)"
			@focus="emits('focus')"
			@blur="emits('blur')"
		>

		<template #button>
			<slot name="button" />
		</template>
		<template #message>
			<slot name="message" />
		</template>
	</form-maker-wrapper>
</template>
