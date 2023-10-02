<template>
	<form-field :hide-label="hideLabel">
		<form-label
			v-if="!hideLabel"
			:label="label"
			name="name"
		/>
		<textarea
			:id="name"
			ref="inp"
			:rows="rows"
			class="border border-gray-200 w-full rounded px-3 py-2 font-code tracking-tighter"
			:class="hideLabel?'':'p-2'"
			:value="modelValue"
			v-bind="$attrs"
			@input="$emit('update:modelValue', $event.target.value)"
			@keyup="atKeyup"
			@mouseup="atKeyup"
			@keydown.tab="tabber"
		/>

		<slot />
		<div
			v-if="helperText!==''"
			v-katex.auto="helperText"
			class="text-xs text-gray-400"
		/>
		<form-error
			:name="name"
			:message="error"
		/>
	</form-field>
</template>
<script setup>
import FormField from "@/Components/Form/FormField.vue"
import FormLabel from "@/Components/Form/FormLabel.vue"
import FormError from "@/Components/Form/FormError.vue"
import {ref} from "vue"

let inp = ref(null)
function focus(select){
	inp.value.focus()
	if(select===true){
		inp.value.select()
	}
}

function atKeyup(){
	let pos = inp.value.selectionStart,
		lines = props.modelValue.split("\n"),
		lineIndex = props.modelValue.substring(0, pos).split("\n").length-1

	emits("currentLine", lines[lineIndex])
}

defineExpose({focus})
const emits = defineEmits(["update:modelValue", "currentLine"])
const props = defineProps({
	modelValue: {type: String, default: ""},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	rows: {type: Number, default: 4},
	hideLabel: {type: Boolean, default: false},
	codeWriting: {type: Boolean, default: false},
	helperText: {type: String, default: ""},
	catchTab: {type: Boolean, default: false}
})

let tabber = function (event) {
	if(!props.catchTab){return}
	event.preventDefault()
	/* enable tab caracter */
	let text = traduction.value,
		originalSelectionStart = event.target.selectionStart,
		textStart = text.slice(0, originalSelectionStart),
		textEnd = text.slice(originalSelectionStart)

	traduction.value = `${textStart}\t${textEnd}`
	event.target.value = traduction.value // required to make the cursor stay in place.
	event.target.selectionEnd = event.target.selectionStart = originalSelectionStart + 1
}
</script>
