<script setup lang="ts">
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useTextEditor} from "@/Composables/useTextEditor.ts"

defineOptions({
	inheritAttrs: false
})


const props = defineProps<FormMakerPropsNewType & {
	catchTab?: boolean
}>()

defineExpose<FormElementExpose>({
	focus: () => textareaRef.value?.focus(),
	validate: () => []
})

const emits = defineEmits<FormElementEmits>()

const {textareaValue, textareaRef} = useTextEditor('input')

</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
	>
		<textarea
			ref="input"
			v-model="textareaValue"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
		/>
	</form-maker-wrapper>
</template>
