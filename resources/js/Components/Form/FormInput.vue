<template>
	<form-field>
		<form-label
			v-if="!props.inline"
			:label="label"
			:name="name"
		/>
		<div class="flex items-stretch">
			<input
				:id="name"
				ref="inp"
				:name="name"
				class="p-2 w-full focus:outline-none focus:bg-blue-50 focus:border focus:border-blue-500 transition;"
				:value="modelValue"
				:class="{
					'form-active': active,
					'border border-gray-200': !active,
					'rounded': !$slots.button,
					'rounded-l': $slots.button
				}"
				v-bind="$attrs"
				:autocomplete="autocomplete===true?'on':autocomplete"
				:placeholder="inline?label:''"
				@focus="$emit('inputFocus')"
				@input="$emit('update:modelValue', $event.target.value)"
				@keyup.esc.exact="doCancel"
				@keyup.enter.exact="doValidate"
				@keydown="handleCtrlKey"
			>
			<button
				v-if="$slots.button"
				class="rounded-l-none"
				:class="btnClass"
				@click="emits('buttonClick')"
			>
				<slot name="button" />
			</button>
		</div>
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

const emits = defineEmits(["update:modelValue", "inputFocus", "enter", "cancel", "save", "buttonClick"])
let props = defineProps({
	inline: {type: Boolean, default: false},
	modelValue: {type: String, default: null},
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false},
	autocomplete: {type: [String,Boolean], default: "off"},
	btnClass:{type: String, default: "btn"}
})

let inp = ref(null),
	originalValue = ref(props.modelValue)

function doCancel(){
	emits("update:modelValue", originalValue.value)
	emits("cancel")
}
function doValidate(){
	emits("enter")
}
function handleCtrlKey(ev){
	if(ev.ctrlKey && ev.key === "s"){
		ev.preventDefault()
		emits("save", ev)
	}
}
function focus(select){
	inp.value.focus()
	if(select===true){
		inp.value.select()
	}
}
onMounted(() => {
	if (props.focus) {
		inp.value.focus()
		inp.value.select()
	}

})


defineExpose({focus})

</script>
