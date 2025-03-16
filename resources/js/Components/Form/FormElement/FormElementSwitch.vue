<script lang="ts" setup>
import {computed} from "vue"

const emits = defineEmits<{
	'update': [value: boolean]
}>()

const switchValue = defineModel<boolean>()

defineOptions({
	inheritAttrs: false
})

const props = defineProps({
	focus: {type: Boolean, default: false},
	label: {type: String, default: ""},
	enabledClass: {type: String, default: "bg-blue-700"},
	disabledClass: {type: String, default: "bg-red-700"},
	sm: {type: Boolean, default: false},
	xl: {type: Boolean, default: false},
})

const enabledLabel = computed(() => {
	return props.label.split(",")[0]
})

const disabledLabel = computed(() => {
	return props.label.split(",")[1] || ""
})

function updateSwitch() {
	switchValue.value = !switchValue.value
	emits("update", switchValue.value)
}

// TODO: Add the color and more smart computed classes: ${switchValue? enabledClass:disabledClass}
</script>
<template>
	<div
		:class="`flex gap-3 cursor-pointer
		${sm?'text-xs':xl?'text-lg':''}`"
		@click="updateSwitch"
	>
		<div
			v-katex.auto="enabledLabel"
			:class="`${switchValue?'opacity-100':'opacity-60'}`"
			class="transition-colors"
		/>
		<div
			class="border rounded-full relative transition-colors"
			:class="[{
				'w-[25px] h-[16px]': sm,
				'w-[36px] h-[23px]': !xl && !sm,
				'w-[45px] h-[25px]': xl,
			}, switchValue? enabledClass: disabledClass]"
		>
			<div
				class="absolute rounded-full transition-all"
				:class="{
					'top-[2px] w-[10px] h-[10px]': sm,
					'top-[2px] w-[17px] h-[17px]': !xl && !sm,
					'top-[3px] w-[17px] h-[17px]': xl,
					'left-[1px]': sm && switchValue,
					'left-[2px]': (!sm && !xl) && switchValue,
					'left-[3px]': xl && switchValue,
					'left-[11px]': sm && !switchValue,
					'left-[16px]': (!sm && !xl) && !switchValue,
					'left-[22px]': xl && !switchValue,
				}"
			>
				<div class="bg-white border h-full w-full rounded-full" />
			</div>
		</div>
		<div
			v-katex.auto="disabledLabel"
			:class="`${switchValue?'opacity-60':'opacity-100'}`"
			class="transition-colors"
		/>
	</div>
</template>
