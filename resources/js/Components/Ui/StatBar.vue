<script lang="ts" setup>

import {computed} from "vue"

const props = withDefaults(
	defineProps<{
		label?: string,
		value: number,
		max: number,
		labelClass?: string,
		barLabel?: string,
		barClass?: string,
		barLabelClass?: string,
		bgClass?: string,
		inverted?: boolean,
		smooth?: boolean
	}>(), {
		label: "",
		labelClass: "",
		barLabel: "",
		barClass: "h-[2em]",
		barLabelClass: "",
		bgClass: "bg-white",
		inverted: false,
		smooth: true
	}
)

const percent = computed(() => {
	return props.value / props.max
})

const statLabelComputed = computed(() => {
	return props.barLabel || `${props.value} / ${props.max}`
})

const bgClassComputed = computed(() => {
	const barClass = [props.barClass]

	if (props.smooth) barClass.push(
		"transition-all duration-300 ease-in-out"
	)

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

const boxClassComputed = computed(() => {
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
				class="flex bar ease-in-out"
			/>
		</div>
	</div>
</template>

