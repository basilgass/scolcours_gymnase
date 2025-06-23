<script setup lang="ts">
import {computed, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"

defineOptions({
	inheritAttrs: false
})

const value = defineModel<string | number>()
const input = useTemplateRef('input')

const props = defineProps<FormMakerPropsNewType>()

defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate: () => []
})

const emits = defineEmits<FormElementEmits>()

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
		:icon="iconValue"
	>
		<input
			ref="input"
			:type
			v-model="value"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
			@keyup="emits('update',value)"
			@keyup.enter="emits('enter', value)"
			@focus="emits('focus')"
			@blur="emits('blur')"
		>
	</form-maker-wrapper>
</template>
