<script setup lang="ts">
import { ref } from "vue"

// props
const props = defineProps({
	modelValue: {
		type: Number
	},
	min: {
		type: Number,
		required: true
	},
	max: {
		type: Number,
		required: true
	}
})

const value = ref(props.min)

const emits = defineEmits(["update:modelValue"])

</script>

<template>
	<div class="w-full">
		<input
			v-model="value"
			type="range"
			:min="min"
			:max="max"
			class="slider"
			@input="emits('update:modelValue', +value)"
		>
		<div class="output">
			{{ value }}
		</div>
	</div>
</template>

<style scoped>
.slider {
	-webkit-appearance: none;
	width: 100%;
	height: 15px;
	border-radius: 5px;
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	-webkit-transition: .2s;
	transition: opacity .2s;
}

.output {
	font-size: 18px;
}

</style>
