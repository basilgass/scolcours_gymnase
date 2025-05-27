<script setup lang="ts">

import {defineAsyncComponent, h, shallowRef, watch} from "vue"
import FormMakeLoader from "@/Components/Form/FormMakeLoader.vue"
import FormMakerError from "@/Components/Form/FormMakerError.vue"
import {FormElementComponents} from "@/scolcours.ts"
import {FormElementExpose, FormElementType, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"

const props = withDefaults(defineProps<FormMakerPropsNewType>(),
	{
		type: 'text',
		icon: false,
		prepend: ""
	})

defineExpose<FormElementExpose>()

function loadComponent(type: FormElementType) {
	// Default inputs, without configuration.
	const textInputs = [
		'text',
		"id",
		'email',
		'password',
		'number',
		'color',
		'date',
		'range'
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

</script>

<template>
	<component
		:is="currentComponent"
		v-bind="{...$attrs,...props}"
	/>
</template>

<style scoped>

</style>
