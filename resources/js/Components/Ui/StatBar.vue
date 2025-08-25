<script lang="ts" setup>

import { computed } from "vue"

const props = defineProps({
	label: { type: String, default: "" },
	value: { type: Number, required: true },
	max: { type: Number, required: true },
	labelClass: { type: String, default: "" },
	barLabel: { type: String, default: "" },
	barClass: { type: String, default: "h-[2em]" },
	barLabelClass: { type: String, default: "" },
	bgClass: {type: String, default: "bg-white"},
	inverted: { type: Boolean, default: false }
})

const percent = computed(() => {
	return props.value / props.max
})

const statLabelComputed = computed(() => {
	return props.barLabel || `${props.value} / ${props.max}`
})
const barClassComputed = computed(() => {
	const barClass = [props.barClass]

	if (props.inverted) {
		if (percent.value > 0.75) {
			barClass.push("bg-red-300/30", "border", "border-red-200")
		} else if (percent.value < 0.30) {
			barClass.push("bg-green-400/30", "border", "border-green-400")
		} else {
			barClass.push("bg-amber-300/30", "border", "border-amber-400")
		}
	} else {
		if (percent.value > 0.75) {
			barClass.push("bg-green-400/30", "border", "border-green-400")
		} else if (percent.value < 0.30) {
			barClass.push("bg-red-300/30", "border", "border-red-200")
		} else {
			barClass.push("bg-amber-300/30", "border", "border-amber-400")
		}
	}

	return barClass.join(" ")
})

const bgClassComputed = computed(() => {
	const barClass = [props.barClass]

	if (props.inverted) {
		if (percent.value > 0.75) {
			barClass.push("bg-red-300/30")
		} else if (percent.value < 0.30) {
			barClass.push("bg-green-400/30")
		} else {
			barClass.push("bg-amber-300/30")
		}
	} else {
		if (percent.value > 0.75) {
			barClass.push("bg-green-400/30")
		} else if (percent.value < 0.30) {
			barClass.push("bg-red-300/30")
		} else {
			barClass.push("bg-amber-300/30")
		}
	}

	return barClass.join(" ")
})

const boxClassComputed = computed(()=>{
	const barClass = [props.bgClass]

	if (props.inverted) {
		if (percent.value > 0.75) {
			barClass.push("border", "border-red-200")
		} else if (percent.value < 0.30) {
			barClass.push("border", "border-green-400")
		} else {
			barClass.push("border", "border-amber-400")
		}
	} else {
		if (percent.value > 0.75) {
			barClass.push("border", "border-green-400")
		} else if (percent.value < 0.30) {
			barClass.push("border", "border-red-200")
		} else {
			barClass.push("border", "border-amber-400")
		}
	}

	return barClass.join(" ")
})
</script>

<template>
	<div
		class="flex flex-row gap-5 w-full items-center"
		:class="boxClassComputed"
	>
		<slot name="label">
			<h2
				v-if="label!==''"
				v-katex.auto="label"
				:class="labelClass"
			/>
		</slot>
		<div class="relative w-full">
			<div class="absolute inset-0 grid place-items-center">
				<slot name="bar">
					<span
						v-katex.auto="statLabelComputed"
						:class="barLabelClass"
					/>
				</slot>
			</div>
			<div
				:class="bgClassComputed"
				:style="`width:${percent*100}%`"
				class="flex bar transition-all duration-500 ease-in-out"
			/>
		</div>
	</div>
</template>

