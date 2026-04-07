<script lang="ts" setup>
import {computed, useAttrs, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"

const value = defineModel<boolean | number>()
const input = useTemplateRef('input')

const props = withDefaults(
	defineProps<FormMakerPropsNewType & {
		invert?: boolean
	}>(),
	{
		invert: false
	}
)


defineExpose<FormElementExpose>({
	focus: () => input.value?.focus(),
	validate: () => []
})

const emits = defineEmits<FormElementEmits>()

defineOptions({
	inheritAttrs: false
})

const enabledLabel = computed(() => {
	return props.label.split(",")[0]
})

const disabledLabel = computed(() => {
	return props.label.split(",")[1] || ""
})

const enabledClass = computed(() => {
	return useAttrs()['enabled-class'] ?? 'bg-blue-700'
})

const disabledClass = computed(() => {
	return useAttrs()['disabled-class'] ?? 'bg-red-700'
})

const resolveValue = computed(() => {
	return props.invert
		? !value.value
		: value.value
})

function updateSwitch() {
	value.value = !value.value
	emits("update", value.value)
}

</script>
<template>
	<div class="inline-block">
		<div
			ref="input"
			:class="`flex gap-3 cursor-pointer
			${sm?'text-xs':xl?'text-lg':''}`"
			@click="updateSwitch"
		>
			<div
				v-katex.auto="enabledLabel"
				:class="`${resolveValue?'opacity-100':'opacity-60'}`"
				class="transition-colors"
			/>
			<div
				:class="[{
					'w-6.25 h-4': sm,
					'w-9 h-5.75': !xl && !sm,
					'w-11.25 h-6.25': xl,
				}, resolveValue? enabledClass: disabledClass]"
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
				:class="`${resolveValue?'opacity-60':'opacity-100'}`"
				class="transition-colors"
			/>
		</div>
	</div>
</template>
