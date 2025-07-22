<script setup lang="ts">

import {defineAsyncComponent, h, shallowRef, watch} from "vue"
import FormMakeLoader from "@/Components/Form/FormMakeLoader.vue"
import FormMakerError from "@/Components/Form/FormMakerError.vue"
import {FormElementComponents} from "@/scolcours.ts"
import {
	FormElementEmits,
	FormElementExpose,
	FormElementType,
	FormMakerPropsNewType
} from "@/Components/Form/FormMakerInterface.ts"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FormMakerPropsNewType>(),
	{
		type: 'text',
		icon: false,
		prepend: false
	})

const value = defineModel<unknown>()
defineExpose<FormElementExpose>()

const emits = defineEmits<FormElementEmits>()

function loadComponent(type: FormElementType) {
	// Default inputs, without configuration.
	const textInputs = [
		'text',
		"id",
		'email',
		'password',
		'number',
		'color',
		'range',
		'date',
		'datetime-local'
	]

	if (Object.hasOwn(FormElementComponents, type)) {
		return defineAsyncComponent({
			loader: FormElementComponents[type],
			loadingComponent: FormMakeLoader,
			delay: 200,
		})
	} else if (textInputs.includes(type)) {
		return defineAsyncComponent({
			loader: FormElementComponents['default'],
			loadingComponent: FormMakeLoader,
			delay: 200,
		})
	}

	return {
		render() {
			return h(FormMakerError, {type})
		}
	}
}

const currentComponent = shallowRef(null)
currentComponent.value = loadComponent(props.type ?? 'text')

watch(() => props.type, (newType) => {
	currentComponent.value = loadComponent(newType)
})

defineSlots<{button: unknown}>()

</script>

<template>
	<component
		:is="currentComponent"
		v-model="value"
		v-bind="{...$attrs,...props}"
		@update="emits('update', $event)"
		@enter="emits('enter', $event)"
		@focus="emits('focus')"
		@blur="emits('blur')"
		@errors="emits('errors', $event)"
	>
		<template #button>
			<slot name="button" />
		</template>
	</component>
</template>

<style scoped>

</style>
