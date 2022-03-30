<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<input
			:id="name"
			ref="inp"
			:name="name"
			class="p-2 w-full rounded focus:outline-none"
			:value="modelValue"
			:class="{'form-active': active, 'border border-gray-200': !active}"
			v-bind="$attrs"
			@focus="$emit('inputFocus')"
			@input="$emit('update:modelValue', $event.target.value)"
		>
		<form-error
			:name="name"
			:message="error"
		/>
		<slot />
	</form-field>
</template>
<script>
export default {
	inheritAttrs: false
}
</script>
<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import FormError from "@/Components/Form/FormError"
import {onMounted, ref} from "vue"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {type: String, default: null},
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false}
})

let inp = ref(null)

onMounted(() => {
	if (props.focus) {
		inp.value.focus()
		inp.value.select()
	}

})

</script>
