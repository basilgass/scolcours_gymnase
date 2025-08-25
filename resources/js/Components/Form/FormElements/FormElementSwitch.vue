<script lang="ts" setup>
import {computed, useAttrs, useTemplateRef} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"

const value = defineModel<boolean | number>()
const input = useTemplateRef('input')

const props = defineProps<FormMakerPropsNewType>()


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

function updateSwitch() {
	value.value = !value.value
	emits("update", value.value)
}

</script>
<template>
	<div class="inline-block">
		<div
			:class="`flex gap-3 cursor-pointer
			${sm?'text-xs':xl?'text-lg':''}`"
			@click="updateSwitch"
			ref="input"
		>
			<div
				v-katex.auto="enabledLabel"
				:class="`${value?'opacity-100':'opacity-60'}`"
				class="transition-colors"
			/>
			<div
				class="border rounded-full relative transition-colors"
				:class="[{
					'w-[25px] h-[16px]': sm,
					'w-[36px] h-[23px]': !xl && !sm,
					'w-[45px] h-[25px]': xl,
				}, value? enabledClass: disabledClass]"
			>
				<div
					class="absolute rounded-full transition-all"
					:class="{
						'top-[2px] w-[10px] h-[10px]': sm,
						'top-[2px] w-[17px] h-[17px]': !xl && !sm,
						'top-[3px] w-[17px] h-[17px]': xl,
						'left-[1px]': sm && value,
						'left-[2px]': (!sm && !xl) && value,
						'left-[3px]': xl && value,
						'left-[11px]': sm && !value,
						'left-[16px]': (!sm && !xl) && !value,
						'left-[22px]': xl && !value,
					}"
				>
					<div class="bg-white border h-full w-full rounded-full" />
				</div>
			</div>
			<div
				v-katex.auto="disabledLabel"
				:class="`${value?'opacity-60':'opacity-100'}`"
				class="transition-colors"
			/>
		</div>
	</div>
</template>
