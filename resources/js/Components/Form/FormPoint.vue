<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<input
			:id="name"
			ref="inp"
			:class="{'form-active': active, 'border border-gray-200': !active}"
			:name="name"
			:value="modelValue"
			class="p-2 w-full rounded focus:outline-none"
			v-bind="$attrs"
			@focus="$emit('inputFocus')"
			@input="$emit('update:modelValue', $event.target.value)"
			@keyup="validatePoint"
		>
		<form-error
			:message="errorMessage"
			:name="name"
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
import {computed, onMounted, ref} from "vue"
import {Fraction} from "pimath/esm/maths/coefficients/fraction"
import {Point} from "pimath/esm/maths/geometry/point"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {type: [String, Number], default: null},
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false}
})

let inp = ref(null),
	internalError = ref("")

onMounted(() => {
	if (props.focus) {
		inp.value.focus()
		inp.value.select()
	}
})

function validatePoint() {
	if (props.modelValue !== "") {
		try {
			let P = new Point(props.modelValue)
			internalError.value = ""
		} catch {
			internalError.value = "La valeur entrée n'est pas une valeur valide"
		}
	}
}

let errorMessage = computed(() => {
	if (internalError.value !== "") {
		return internalError.value
	}
	if (props.error !== "") {
		return props.error
	}

	return ""
})

</script>
