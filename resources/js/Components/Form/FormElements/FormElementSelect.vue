<script setup lang="ts">
import {onMounted, onUnmounted, ref, useTemplateRef} from "vue"
import type {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"

defineOptions({
	inheritAttrs: false
})

const value = defineModel<string>()
const input = useTemplateRef<HTMLDivElement>('input')
const errors = ref<string[]>([])

const props = defineProps<FormMakerPropsNewType & {
	choices: string[] | Record<string, string>
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
	emits('errors', errors.value)
	emits('update', value.value)
}

const open = ref<boolean>(false)

function onSelect(key: number | string, choice: string) {
	value.value = Array.isArray(
		props.choices
	) ? choice : key as string

	open.value = false
}

function clickOutsideEvent(event: MouseEvent) {
	if (open.value && !(input.value === event.target || input.value.contains(event.target as Node))) {
		open.value = false
	}
}

onMounted(() => {
	document.body.addEventListener('click', clickOutsideEvent)
})
onUnmounted(() => {
	document.body.removeEventListener('click', clickOutsideEvent)
})
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
				class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
				@click="open = !open"
				@blur="open = false"
			>
				value
			</div>
			<div
				v-show="open"
				class="select-menu absolute right-0 left-0 bottom-0 translate-y-[105%] shadow bg-content border rounded"
			>
				<div
					v-for="(choice, key) in choices"
					:key="`choice-${key}`"
					class="hover:bg-slate-100 px-2 py-3"
					@click="onSelect(key, choice as string)"
					v-katex.auto="choice"
				/>
			</div>
		</div>
	</form-maker-wrapper>
</template>
