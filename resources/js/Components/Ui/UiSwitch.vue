<template>
	<Switch
		v-model="switchValue"
		:class="switchClass"
	>
		<span
			:class="circleClass"
		/>
	</Switch>
</template>
<script setup>
import {Switch} from "@headlessui/vue"
import {computed, ref, watch} from "vue"

let emit = defineEmits(["update:modelValue"])

let props = defineProps({
	modelValue: Boolean,
	sm: {type: Boolean, default: false},
	disabledColor: {type: String, default: "bg-orange-700"},
	enabledColor: {type: String, default: "bg-blue-700"},
	circleColor: {type: String, default: "bg-white"}
})

let switchValue = ref(props.modelValue)

let switchClass = computed(()=>{
	let value = "relative inline-flex items-center rounded-full "

	if(props.sm){
		value += "h-4 w-7 "
	}else{
		value += "h-6 w-11 "
	}

	return value + (switchValue.value ? props.enabledColor : props.disabledColor)
})

let circleClass = computed(()=>{
	let value = "inline-block transform rounded-full bg-white "

	if(props.sm){
		value += "h-3 w-3 " + (switchValue.value ? "translate-x-3": "translate-x-1")
	}else{
		value += "h-4 w-4 " + (switchValue.value ? "translate-x-6": "translate-x-1")
	}

	return `${value} ${props.circleColor}`
})

watch(()=> switchValue.value, (value) =>{
	emit("update:modelValue", value)
})
</script>
