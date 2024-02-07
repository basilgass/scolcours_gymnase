<script lang="ts" setup>
import { computed, ref } from "vue"

defineOptions({
	inheritAttrs: false
})

const emits = defineEmits(["update:modelValue", "update"])
const props = defineProps({
		modelValue: { type: [Boolean, String, Number], default: false },
		focus: { type: Boolean, default: false },
		label: { type: String, default: "" },
		enabledClass: { type: String, default: "bg-blue-700" },
		disabledClass: { type: String, default: "bg-red-700" },
		sm: {type: Boolean, default: false},
	}),
	theValue = ref(props.modelValue),
	enabledLabel = computed(() => {
		return props.label.split(",")[0]
	}),
	disabledLabel = computed(() => {
		return props.label.split(",")[1] || ""
	}),
	update = (value) => {
		theValue.value = value
		emits("update:modelValue", theValue.value)
		emits("update", theValue.value)
	}

</script>
<template>
	<div
		class="flex gap-3 cursor-pointer"
		:class="props.sm?' text-xs':''"
	>
		<div
			v-katex.auto="enabledLabel"
			:class="`${theValue?'text-black':'text-gray-400'}`"
			class="transition-colors"
			@click="update(true)"
		/>
		<div
			:class="`${theValue?props.enabledClass:props.disabledClass}
			${props.sm?'w-[25px] h-[16px]':'w-[45px] h-[25px]'}`"
			class="border rounded-full relative transition-colors"
			@click="update(!theValue)"
		>
			<div
				:class="{
					'left-[3px]':theValue,
					'left-[22px]':!theValue && !props.sm,
					'left-[11px]':!theValue && props.sm,
					'top-[3px] w-[17px] h-[17px]':!props.sm,
					'top-[2px] w-[10px] h-[10px]':props.sm,
				}"
				class="absolute rounded-full transition-all"
			>
				<div class="bg-white border h-full w-full rounded-full" />
			</div>
		</div>
		<div
			v-katex.auto="disabledLabel"
			:class="!theValue?'text-black':'text-gray-400'"
			class="transition-colors"
			@click="update(false)"
		/>
	</div>
</template>
