<script lang="ts" setup>
import { computed, ref } from "vue"
import FormElementCodearea from "@/Components/Form/FormElement/FormElementCodearea.vue"
import FormElementKeyboard from "@/Components/Form/FormElement/FormElementKeyboard.vue"
import FormElementSwitch from "@/Components/Form/FormElement/FormElementSwitch.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { FormValidationFraction } from "@/Components/Form/FormValidation/FormValidationFraction"
import { FormValidationNumber } from "@/Components/Form/FormValidation/FormValidationNumber"
import type { FormMakerPropsType } from "@/Components/Form/FormMakerInterface"

/**
 * This component is used to generate a form input
 */

// Define the list of inputs that are text based
const inputAsText = ["text", "email", "password", "id", "fraction"]
// Define the list of inputs that don't have a label
const noLabelForms = ["switch"]

// Default props
const props = withDefaults(defineProps<FormMakerPropsType>(), {
	// Set the type of the input
	fontCode: false,
	helper: false,
	inlineLabel: false,
	inputClass: "",
	label: "",
	labelAsPlaceholder: false,
	labelClass: "",
	max: null,
	message: "",
	min: null,
	modelValue: "",
	placeholder: "",
	sm: false,
	step: null,
	type: "text",
	withIcon: false,
	prepend: "",
	focus: false,
	language: "latex",
	rows: 4,
	resizable: false,
	autoSize: false
})

// Define the emits
const $emit = defineEmits(["update:modelValue", "enter", "currentLine"])

// Get the root element
const inputWrapper = ref(null)

// Display the error message if any
const errors = computed(() => {
	return validate()
})

// Get the value of the input
// used for custom inputs
const theValue = ref(props.modelValue as string)

// Determine if the label should be displayed
const showLabel = computed(() => {
	return !noLabelForms.includes(props.type)
})

// calculate the input combined class
const combinedInputClass = computed(() => {
	return `${props.inputClass} ${props.sm ? "text-xs p-1" : "p-2"}  ${
		props.fontCode ? "font-code" : ""
	} ${
		(props.withIcon || props.prepend) ? "border-r-[1px] border-y-[1px] rounded-r" : "border-[1px] rounded"
	} w-full border-slate-200 appearance-none focus:border-slate-400 focus:outline-none focus:ring-0 focus:shadow transition`
})

// calculate the label combined class
const combinedLabelClass = computed(() => {
	return `${props.labelClass} ${
		props.sm || !props.inlineLabel ? "text-xs" : "text-base"
	}`
})

// calculate the icon padding
const iconPadding = computed(() => {
	return props.withIcon ? "0.5rem" : "0.5rem"
})

// calculate the icon class
const iconClass = computed(() => {
	if (typeof props.withIcon === "string") return props.withIcon
	if (props.type === "number") return "bi bi-123"
	if (props.type === "text") return "bi bi-fonts"
	if (props.type === "id") return "bi bi-key"

	return ""
})

// calculate the placeholder value
const placeholderValue = computed(() => {
	if (props.placeholder !== "") {
		return props.placeholder
	}

	return props.labelAsPlaceholder ? props.label : ""
})


// On input update, emit the new value in correct format
function updateInput(e) {
	if (
		props.type === "text" ||
		props.type === "email" ||
		props.type === "password" ||
		props.type === "id" ||
		props.type === "textarea" ||
		props.type === "fraction"
	) {
		$emit("update:modelValue", e.target.value)

		return
	} else if (props.type === "number") {
		$emit(
			"update:modelValue",
			e.target.value === "" ? "" : parseFloat(e.target.value)
		)
		return
	} else if (props.type === "checkbox") {
		$emit("update:modelValue", e.target.checked)
		return
	} else {
		$emit("update:modelValue", e)
		return
	}
}

const TEXTAREA = ref(null)
function onKeyup(){
	let pos = TEXTAREA.value.selectionStart,
		lines = theValue.value.split("\n"),
		lineIndex = theValue.value.substring(0, pos).split("\n").length - 1

	$emit("currentLine", lines[lineIndex])
}

// validation function
function validate() {
	if (props.type === "number") return FormValidationNumber(props.modelValue as number, props)

	if (props.type === "fraction") return FormValidationFraction(props.modelValue as string)

	return ""
}

// Provide a function to focus the input
function setFocus() {
	let input = inputWrapper.value.getElementsByTagName("input")[0]

	// Maybe the input is a textarea
	if(!input){
		input = inputWrapper.value.getElementsByTagName("textarea")[0]
	}

	// Maybe the input is a select
	if (!input) {
		input = inputWrapper.value.getElementsByTagName("select")[0]
	}

	if(input)input.focus()
}
defineExpose({ focus: setFocus })
</script>

<template>
	<div
		:class="{
			helper: props.helper,
			inlineLabel: props.inlineLabel,
		}"
	>
		<label
			v-if="showLabel"
			v-show="!props.labelAsPlaceholder"
			v-katex.auto="props.label"
			:class="combinedLabelClass"
		/>

		<!-- Display the input -->
		<div
			ref="inputWrapper"
			class="w-full"
		>
			<div class="flex items-stretch">
				<div
					v-if="props.withIcon"
					class="py-2 w-8 grid place-items-center border rounded-l text-gray-400"
				>
					<i :class="iconClass" />
				</div>
				<div
					v-else-if="props.prepend"
					v-katex.auto="props.prepend"
					class="px-2 grid place-items-center border rounded-l text-gray-400 whitespace-nowrap"
				/>
				<input
					v-if="inputAsText.includes(type)"
					:autofocus="props.focus"
					:class="combinedInputClass"
					:placeholder="placeholderValue"
					:type="type"
					:value="modelValue"
					@input="updateInput($event)"
					@keyup="validate()"
					@keyup.enter="$emit('enter')"
				>
				<textarea
					ref="TEXTAREA"
					v-if="type === 'textarea'"
					:class="combinedInputClass"
					:rows="props.rows"
					:value="modelValue as string"
					@input="updateInput($event)"
					@keyup="onKeyup"
					@mouseup="onKeyup"
				/>
				<input
					v-else-if="type === 'number'"
					:class="combinedInputClass"
					:max="props.max"
					:min="props.min"
					:placeholder="placeholderValue"
					:step="props.step"
					:value="modelValue"
					type="number"
					@input="updateInput($event)"
					@keyup.enter="$emit('enter')"
				>
				<input
					v-else-if="type === 'checkbox'"
					:class="combinedInputClass"
					:value="modelValue"
					type="checkbox"
					@input="updateInput($event)"
					@keyup.enter="$emit('enter')"
				>
				<!-- select type input -->
				<select
					v-else-if="type === 'select'"
					:class="combinedInputClass"
					:value="modelValue"
					@input="updateInput($event)"
				>
					<slot />
				</select>

				<!-- custom element form inputs -->
				<form-element-codearea
					v-else-if="type === 'code'"
					v-model="theValue"
					:auto-size="props.autoSize"
					:class="combinedInputClass"
					:focus="props.focus"
					:language="props.language"
					:resizeable="props.resizable"
					:rows="props.rows"
					@update="updateInput($event)"
				/>
				<form-element-keyboard
					v-else-if="type === 'keyboard'"
					v-model="theValue"
					:class="combinedInputClass"
					:focus="props.focus"
					@update="updateInput($event)"
				/>
				<form-element-switch
					v-else-if="type === 'switch'"
					v-model="theValue"
					:class="combinedInputClass"
					:focus="props.focus"
					:label="props.label"
					:sm="props.sm"
					@update="updateInput($event)"
				/>
			</div>
		</div>

		<!-- Display the error message -->
		<div
			ref="inputError"
			class="text-xs text-red-600"
			v-if="errors"
		>
			{{ errors }}
		</div>

		<!-- Display a helper message, via default slot -->
		<markdown-it
			v-if="props.message"
			:text="props.message"
		/>
	</div>
</template>

<style scoped>
div.inlineLabel {
	@apply flex items-center gap-3;
}

input {
	@apply text-black;
	padding-left: v-bind(iconPadding);
}

</style>
