<script setup>
import UiSlider from "@/Components/Ui/UiSlider.vue"
import {ref} from "vue"
import FormNumber from "@/Components/Form/FormNumber.vue"


let value = ref(15),
	vmin = ref(10),
	vmax = ref(40)
</script>

<template>
	<form-number
		v-model="vmin"
		name="vmin"
	/>
	<form-number
		v-model="vmax"
		name="vmin"
	/>
	<div>
		<ui-slider
			v-model="value"
			:max="vmax"
			:min="vmin"
		/>
	</div>

	<div>FROM UI COMPONENT: {{ value }}</div>
</template>
