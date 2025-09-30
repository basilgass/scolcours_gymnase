<script
	setup
	lang="ts"
	generic="T extends Record<string,FormElementType>"
>

import {computed, nextTick, Ref, ref, useTemplateRef, watch} from "vue"
import {
	FormElementEmits,
	FormElementExpose,
	FormElementType,
	FormMakerPropsNewType
} from "@/Components/Form/FormMakerInterface.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"

defineOptions({
	inheritAttrs: false
})

const theValue = defineModel<T>()

const input = useTemplateRef<HTMLDivElement>('input')
const errors = ref<string[]>([])

const props = defineProps<FormMakerPropsNewType & {
	map: Record<string, FormElementType>
}>()

defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate
})

const emits = defineEmits<FormElementEmits>()

function validate(): string[] {
	return []
}

function onChange() {
	errors.value = validate()

	theValue.value = json.value

	emits('errors', errors.value)
	emits('update', json.value)
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

const rValue: Record<string, Ref<string | number>> = {}

function buildValues() {
	Object.keys(props.map).forEach(key => {
		rValue[key] = ref(theValue.value[key] ?? '')
	})
}

const rRefs = useTemplateRef('elements')

function focusNext(key: string) {
	const keys = Object.keys(props.map)
	const index = keys.indexOf(key)
	const newIndex = index === keys.length - 1 ? 0 : index + 1

	nextTick(() => {
		rRefs.value[newIndex]?.focus?.()
	})
}

buildValues()
watch(() => props.map, () => buildValues())
</script>

<template>
	<div>
		<div class="flex flex-col gap-3">
			<form-maker
				v-for="(typeMap, element) in map"
				ref="elements"
				:key="element"
				:type="typeMap"
				:label="element"
				v-model="rValue[element].value"
				@update="onChange"
				@enter="focusNext(element)"
			/>
		</div>
		<code>{{ JSON.stringify(json) }}</code>
	</div>
</template>
