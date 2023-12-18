<script lang="ts" setup>
import { computed, ref } from "vue"

defineOptions({
	inheritAttrs: false
})

const emits = defineEmits(["update:modelValue", "update"])
const props = defineProps({
		modelValue: { type: [Boolean, String], default: false },
		focus: { type: Boolean, default: false },
		label: { type: String, default: "" },
		enabledClass: { type: String, default: "bg-blue-700" },
		disabledClass: { type: String, default: "bg-red-700" }
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
	<div class="flex gap-3 cursor-pointer">
		<div
			v-katex.auto="enabledLabel"
			:class="theValue?'text-black':'text-gray-400'"
			class="transition-colors"
			@click="update(true)"
		/>
		<div
			:class="theValue?props.enabledClass:props.disabledClass"
			class="border rounded-full w-[45px] relative h-[25px] transition-colors"
			@click="update(!theValue)"
		>
			<div
				:class="theValue?'left-[3px]':'left-[22px]'"
				class="w-[17px] h-[17px] absolute top-[3px] rounded-full transition-all"
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
