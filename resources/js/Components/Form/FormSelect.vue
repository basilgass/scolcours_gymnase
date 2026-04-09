<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, useTemplateRef} from "vue"
import type {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	choices: string[] | Record<string, string>
	labelMap?: (element: unknown) => string
}

const props = withDefaults(defineProps<Props>(), {
	labelMap: (element: unknown) => element as string
})
const value = defineModel<string | Record<string, string>>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {errors, expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const open = ref(false)

function onSelect(choice: string) {
	value.value = choice
	open.value = false
	errors.value = []
	emits('errors', errors.value)
	emits('update', value.value)
}

const currentValue = computed(() => {
	if (value.value === undefined) return 'choisir...'
	return props.choices[value.value as string] ?? value.value
})

function clickOutsideEvent(event: MouseEvent) {
	if (open.value && !(inputRef.value === event.target || inputRef.value?.contains(event.target as Node))) {
		open.value = false
	}
}

onMounted(() => document.body.addEventListener('click', clickOutsideEvent))
onUnmounted(() => document.body.removeEventListener('click', clickOutsideEvent))
</script>

<template>
	<form-maker-wrapper
		v-bind="{...$attrs, ...props}"
		btn="bi bi-caret-down-fill"
		@button-click.stop="open = !open"
	>
		<div
			ref="input"
			tabindex="0"
			class="relative"
		>
			<div
				v-katex.auto="labelMap(currentValue)"
				class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
				@click="open = !open"
				@blur="open = false"
			/>
			<div
				v-show="open"
				class="select-menu absolute right-0 left-0 top-full mt-1 max-h-75 overflow-y-scroll shadow bg-content border rounded z-10"
			>
				<div
					v-for="(choice, key) in choices"
					:key="`choice-${key}`"
					v-katex.auto="labelMap(choice)"
					class="hover:bg-slate-100 px-2 py-3 cursor-pointer transition-all"
					@click="onSelect(choice as string)"
				/>
			</div>
		</div>
	</form-maker-wrapper>
</template>
