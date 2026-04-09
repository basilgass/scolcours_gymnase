<script lang="ts" setup>
import {computed, useAttrs, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	invert?: boolean
}

const props = withDefaults(defineProps<Props>(), {invert: false})
const value = defineModel<boolean | number>()
const emits = defineEmits<FormElementEmits>()

const inputRef = useTemplateRef<HTMLDivElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const enabledLabel = computed(() => props.label?.split(",")[0] ?? '')
const disabledLabel = computed(() => props.label?.split(",")[1] ?? '')

const enabledClass = computed(() => useAttrs()['enabled-class'] as string ?? 'bg-blue-700')
const disabledClass = computed(() => useAttrs()['disabled-class'] as string ?? 'bg-red-700')

const resolveValue = computed(() => props.invert ? !value.value : value.value)

function updateSwitch() {
	value.value = !value.value
	emits("update", value.value)
}
</script>

<template>
	<div class="inline-block">
		<div
			ref="input"
			:class="[
				'flex gap-3',
				sm ? 'text-xs' : xl ? 'text-lg' : '',
				disabled ? 'opacity-50 pointer-events-none select-none' : 'cursor-pointer',
			]"
			@click="updateSwitch"
		>
			<div
				v-katex.auto="enabledLabel"
				:class="`${resolveValue ? 'opacity-100' : 'opacity-60'}`"
				class="transition-colors"
			/>
			<div
				:class="[{
					'w-6.25 h-4': sm,
					'w-9 h-5.75': !xl && !sm,
					'w-11.25 h-6.25': xl,
				}, resolveValue ? enabledClass : disabledClass]"
				class="border rounded-full relative transition-colors"
			>
				<div
					class="absolute rounded-full transition-all"
					:class="{
						'top-0.5 w-2.5 h-2.5': sm,
						'top-0.5 w-4.25 h-4.25': !xl && !sm,
						'top-0.75 w-4.25 h-4.25': xl,
						'left-px': sm && resolveValue,
						'left-0.5': (!sm && !xl) && resolveValue,
						'left-0.75': xl && resolveValue,
						'left-2.75': sm && !resolveValue,
						'left-4': (!sm && !xl) && !resolveValue,
						'left-5.5': xl && !resolveValue,
					}"
				>
					<div class="bg-white border h-full w-full rounded-full" />
				</div>
			</div>
			<div
				v-katex.auto="disabledLabel"
				:class="`${resolveValue ? 'opacity-60' : 'opacity-100'}`"
				class="transition-colors"
			/>
		</div>
	</div>
</template>
