<template>
	<form-field>
		<form-label
			:label="labelSwitch"
			:name="name"
			class="inline-block mr-5"
		/>
		<ui-switch
			v-model="value"
		/>
		<form-error
			:message="error"
			:name="name"
		/>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import FormError from "@/Components/Form/FormError"
import UiSwitch from "@/Components/Ui/UiSwitch"
import {computed, ref, watch} from "vue"


const emit = defineEmits(["update:modelValue"])
const props = defineProps({
	modelValue: {type: [Number,Boolean], default: null},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""}
})

// Make sure it's a boolean
let value = ref(Boolean(props.modelValue)===true)

let labelSwitch = computed(()=>{
	if(props.label.includes(",")){
		return props.label.split(",")[value.value?0:1]
	}else{
		return props.label
	}
})
watch(()=> value.value, (value) =>{
	emit("update:modelValue", value?1:0)
})
</script>
