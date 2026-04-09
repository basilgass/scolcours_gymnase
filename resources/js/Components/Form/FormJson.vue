<script
	setup
	lang="ts"
	generic="T extends Record<string, unknown>"
>
import {type Component, computed, nextTick, type Ref, ref, useTemplateRef, watch} from "vue"
import {
	FormElementEmits,
	FormElementExpose,
	FormJsonFieldType,
	FormMakerBaseProps
} from "@/Components/Form/FormMakerInterface.ts"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import FormCodearea from "@/Components/Form/FormCodearea.vue"
import FormFraction from "@/Components/Form/FormFraction.vue"
import FormVector from "@/Components/Form/FormVector.vue"
import FormKeyboard from "@/Components/Form/FormKeyboard.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

const componentMap: Record<FormJsonFieldType, Component> = {
	text: FormInput,
	id: FormInput,
	email: FormInput,
	password: FormInput,
	number: FormInput,
	color: FormInput,
	range: FormInput,
	date: FormInput,
	'datetime-local': FormInput,
	textarea: FormTextarea,
	select: FormSelect,
	switch: FormSwitch,
	codearea: FormCodearea,
	fraction: FormFraction,
	vector: FormVector,
	keyboard: FormKeyboard,
}

interface Props extends FormMakerBaseProps {
	map: Record<string, FormJsonFieldType>
}

const props = defineProps<Props>()
const theValue = defineModel<T>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {errors, expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const rValue: Record<string, Ref<string | number>> = {}

function buildValues() {
	Object.keys(props.map).forEach(key => {
		rValue[key] = ref((theValue.value?.[key] ?? '') as string | number)
	})
}

const json = computed(() => {
	const arr = {}
	Object.keys(props.map).forEach(key => {
		if (rValue[key].value !== '') {
			arr[key] = rValue[key].value
		}
	})
	return arr as T
})

function onChange() {
	theValue.value = json.value
	emits('errors', errors.value)
	emits('update', json.value)
}

const rRefs = useTemplateRef('elements')

function focusNext(key: string) {
	const keys = Object.keys(props.map)
	const index = keys.indexOf(key)
	const newIndex = index === keys.length - 1 ? 0 : index + 1
	nextTick(() => {
		(rRefs.value[newIndex] as { focus?: () => void })?.focus?.()
	})
}

buildValues()
watch(() => props.map, () => buildValues())
</script>

<template>
	<div ref="input">
		<div class="flex flex-col gap-3">
			<component
				:is="componentMap[fieldType]"
				v-for="(fieldType, element) in map"
				ref="elements"
				:key="element"
				v-model="rValue[element].value"
				:type="fieldType"
				:label="element"
				:disabled="props.disabled"
				:clearable
				@update="onChange"
				@enter="focusNext(element)"
			/>
		</div>
		<code>{{ JSON.stringify(json) }}</code>
	</div>
</template>
