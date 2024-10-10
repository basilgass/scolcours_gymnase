<script lang="ts" setup>
import { computed } from "vue"

const emits = defineEmits(["update"])
const theValue = defineModel<boolean>()

defineOptions({
	inheritAttrs: false
})

const props = defineProps({
	focus: { type: Boolean, default: false },
	label: { type: String, default: "" },
	enabledClass: { type: String, default: "bg-blue-700" },
	disabledClass: { type: String, default: "bg-red-700" },
	sm: { type: Boolean, default: false }
})

const enabledLabel = computed(() => {
	return props.label.split(",")[0]
})

const disabledLabel = computed(() => {
	return props.label.split(",")[1] || ""
})

function updateSwitch() {
	theValue.value = !theValue.value
	emits("update", theValue)
}

const switchContainerClass = computed(() => {
	return `${theValue.value ? props.enabledClass : props.disabledClass}${props.sm ? " sm" : ""}`
})
</script>
<template>
	<div
		:class="props.sm?' text-xs':''"
		class="flex gap-3 cursor-pointer"
		@click="updateSwitch"
	>
		<div
			v-katex.auto="enabledLabel"
			:class="`${theValue?'text-black':'text-gray-400'}`"
			class="transition-colors"
		/>
		<div
			:class="switchContainerClass"
			class="switch"
		>
			<div
				:class="{
					'enabled': theValue,
					'sm': props.sm
				}"
				class="switch-button"
			>
				<div class="bg-white border h-full w-full rounded-full" />
			</div>
		</div>
		<div
			v-katex.auto="disabledLabel"
			:class="!theValue?'text-black':'text-gray-400'"
			class="transition-colors"
		/>
	</div>
</template>

<style scoped>
.switch {
	@apply border rounded-full relative transition-colors
	w-[36px] h-[23px];
}
.switch-button {
	@apply absolute rounded-full transition-all
	left-[2px] top-[2px] w-[17px] h-[17px];
}
.switch-button.enabled {
	@apply left-[16px];
}

.switch.xl {
	@apply w-[45px] h-[25px];
}
.switch-button.xl {
	@apply left-[3px] top-[3px] w-[17px] h-[17px];
}
.switch-button.xl.enabled {
	@apply left-[22px];
}

.switch.sm {
	@apply w-[25px] h-[16px];
}
.switch-button.sm {
	@apply top-[2px] w-[10px] h-[10px];
}

.switch-button.sm.enabled {
	@apply left-[11px];
}
</style>