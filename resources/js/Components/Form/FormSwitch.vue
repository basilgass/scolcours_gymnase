<template>
	<form-field>
		<ui-switch
			v-model="value"
			:true-text="labelSwitch.pre"
			:false-text="labelSwitch.post"
			:sm="props.sm"
		/>
		<form-error
			:message="error"
			:name="name"
		/>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField.vue"
import FormError from "@/Components/Form/FormError.vue"
import UiSwitch from "@/Components/Ui/UiSwitch.vue"
import {computed, ref, watch} from "vue"


const emit = defineEmits(["update:modelValue", "input"])
const props = defineProps({
	modelValue: {type: [Number,Boolean], default: null},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	sm: {type: Boolean, default: false},
	labelRight: {type: Boolean, default: false}
})

// Make sure it's a boolean
let value = ref(Boolean(props.modelValue)===true)

let labelSwitch = computed(()=>{
	let [pre,post] = props.label.split(",")
	return {
		pre: pre??"",
		post: post??""
	}
})

watch(()=> value.value, (newValue) =>{
	emit("update:modelValue", newValue?true:false)
	emit("input")
})

watch(()=> props.modelValue, (newValue) =>{
	value.value = newValue
})
</script>
