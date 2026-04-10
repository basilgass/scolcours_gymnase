<script lang="ts" setup>
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useTextEditor} from "@/Composables/useTextEditor.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	catchTab?: boolean
}

const props = defineProps<Props>()
const model = defineModel<string>()
const emits = defineEmits<FormElementEmits>()

const {textareaValue, textareaRef} = useTextEditor('input', {language: "raw", model})
// const inputRef = useTemplateRef<HTMLTextAreaElement>('input')
const {expose} = useFormMaker(textareaRef)
defineExpose<FormElementExpose>(expose)

</script>

<template>
	<form-maker-wrapper v-bind="{...$attrs,...props}">
		<textarea
			ref="input"
			v-model="textareaValue"
			:disabled="props.disabled"
			class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
			v-bind="$attrs"
		/>
	</form-maker-wrapper>
</template>
