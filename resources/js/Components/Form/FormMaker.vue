<script lang="ts" setup>

import {defineAsyncComponent, h, shallowRef, useTemplateRef, watch} from "vue"
import FormMakeLoader from "@/Components/Form/FormMakeLoader.vue"
import FormMakerError from "@/Components/Form/FormMakerError.vue"
import {FormElementComponents} from "@/scolcours.ts"
import {
	FormElementEmits,
	FormElementExpose,
	FormElementType,
	FormMakerPropsNewType
} from "@/Components/Form/FormMakerInterface.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"

// REFACTOR: rework FormMaker -> use provide / inject
// REFACTOR: defineExpose must be explicitly defined everywher -> use provide / inject instead ?

// TODO: Créer un FormMaker pour les models: Theme, Chapter, Posts, Challenges, Generators, Decks, etc... uniforme.
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<FormMakerPropsNewType>(),
	{
		type: 'text',
		icon: false,
		prepend: false
	})

const value = defineModel<unknown>()

const compRef = useTemplateRef<InstanceType<typeof FormMaker>>('element')

defineExpose<FormElementExpose>({
	focus: () => {
		console.log('focus')
		compRef.value?.focus?.()
	},
	validate: () => {
		console.log('validate')
		return []
	}
})

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

defineSlots<{ button: unknown }>()

</script>

<template>
	<component
		:is="currentComponent"
		ref="element"
		v-model="value"
		v-bind="{...$attrs,...props}"
		@blur="emits('blur')"
		@button="emits('button')"
		@enter="emits('enter', $event)"
		@errors="emits('errors', $event)"
		@focus="emits('focus')"
		@update="emits('update', $event)"
	>
		<template #button>
			<slot name="button" />
		</template>
	</component>
</template>

<style scoped>

</style>
