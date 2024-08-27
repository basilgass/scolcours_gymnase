<script lang="ts" setup>
import FormElementCodearea from "@/Components/Form/FormElement/FormElementCodearea.vue"
import FormElementKeyboard from "@/Components/Form/FormElement/FormElementKeyboard.vue"
import FormElementSwitch from "@/Components/Form/FormElement/FormElementSwitch.vue"
import type { FormMakerPropsType } from "@/Components/Form/FormMakerInterface"
import { FormValidationFraction } from "@/Components/Form/FormValidation/FormValidationFraction"
import { FormValidationNumber } from "@/Components/Form/FormValidation/FormValidationNumber"
import { FormValidationVector } from "@/Components/Form/FormValidation/FormValidationVector"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { flashInterface } from "@/types"
import { useUrlSearchParams } from "@vueuse/core"
import axios from "axios"
import { computed, inject, onMounted, ref, useAttrs } from "vue"

/**
 * This component is used to generate a form input
 */

// Define the model value.
const theValue = defineModel({
	set(value) {
		if (props.type === "switch" || props.type === "checkbox") return !!(+value)

		if (props.type === "id" || props.type === "number") return +value

		if (value === null) return ""

		if (value === true) return ""

		// Make sure it's a string
		return `${value}`
	}
})


// Define the list of inputs that are text based
const inputAsText = ["text", "email", "password", "id", "fraction", "vector"]
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
	message: "",
	messageClass: "",
	placeholder: "",
	sm: false,
	step: null,
	type: "text",
	withIcon: false,
	prepend: "",
	focus: false,
	language: "latex",
	resizable: false,
	autoSize: false,
	axios: null,
	fromUrl: null,
	clearable: true
})

// Define the emits
const emits = defineEmits(["enter", "currentLine"])

const flash = inject<flashInterface>("flash", null)

// Get the root element
const inputWrapper = ref(null)

// Display the error message if any
const errors = computed(() => {
	return validate()
})

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
function updateInput(e: Event) {
	// TODO: updateInput ?
}

const TEXTAREA = ref(null)

function onKeyup() {
	let pos = TEXTAREA.value.selectionStart,
		lines = (theValue.value as string).split("\n"),
		lineIndex = (theValue.value as string).substring(0, pos).split("\n").length - 1

	emits("currentLine", lines[lineIndex])
}

// validation function
function validate() {
	if (props.type === "number") {
		return FormValidationNumber(+theValue.value as number, {
			min: isNaN(+useAttrs().min) ? 0 : +useAttrs().min,
			max: isNaN(+useAttrs().max) ? 10 : +useAttrs().max
		})
	}

	if (props.type === "fraction") {
		return FormValidationFraction(theValue.value as string)
	}

	if (props.type === "vector") {
		return FormValidationVector(theValue.value as string)
	}

	return ""
}

// Provide a function to focus the input
function setFocus() {
	let input = inputWrapper.value.getElementsByTagName("input")[0]

	// Maybe the input is a textarea
	if (!input) {
		input = inputWrapper.value.getElementsByTagName("textarea")[0]
	}

	// Maybe the input is a select
	if (!input) {
		input = inputWrapper.value.getElementsByTagName("select")[0]
	}

	if (input) input.focus()
}

function onEnter(ev) {
	if (props.axios === null) {
		emits("enter", ev)
		return
	}

	// There is a problem with axios values.
	if (!props.axios.model || !props.axios.id || !props.axios.column) return

	// Apply the axios
	axios.patch(
		route("api.update.a.value"),
		{
			_method: "PATCH",
			...props.axios,
			value: theValue.value
		})
		.then(() => {
			flash?.success("Valeur enregistrée avec succès.")
		})
		.catch((err) => {
			console.warn(err.response.data.message)
			flash?.error("Une erreur est survenue lors de l'enregistrement.")
		})
}

onMounted(() => {
	const params = useUrlSearchParams()

	if (props.fromUrl && params[props.fromUrl]) {
		theValue.value = params[props.fromUrl]
	}
})
defineExpose({ focus: setFocus })
</script>

<template>
	<div
		:class="{
			helper: props.helper,
			inlineLabel: props.inlineLabel,
		}"
		class="relative"
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
			<div class="flex items-stretch relative">
				<div
					v-if="props.withIcon"
					:class="props.sm? 'py-1' : 'py-2' "
					class="w-8 grid place-items-center border rounded-l text-gray-400"
				>
					<i :class="iconClass" />
				</div>
				<div
					v-else-if="props.prepend"
					v-katex.auto="props.prepend"
					class="grid place-items-center
					border rounded-l
					px-2
					text-gray-400
					whitespace-nowrap relative"
				/>
				<input
					v-if="inputAsText.includes(type)"
					v-model="theValue"
					:autofocus="props.focus"
					:class="combinedInputClass"
					:placeholder="placeholderValue"
					:type="type"
					v-bind="$attrs"
					@input="updateInput($event)"
					@keyup="validate()"
					@keyup.enter="onEnter"
				>
				<textarea
					v-if="type === 'textarea'"
					ref="TEXTAREA"
					v-model="theValue as string"
					:class="combinedInputClass"
					v-bind="$attrs"
					@input="updateInput($event)"
					@keyup="onKeyup"
					@mouseup="onKeyup"
				/>
				<input
					v-else-if="type === 'number'"
					v-model="theValue as number"
					:class="combinedInputClass"
					:placeholder="placeholderValue"
					:step="props.step"
					type="number"
					v-bind="$attrs"
					@input="updateInput($event)"
					@keyup.enter="onEnter"
				>
				<input
					v-else-if="type === 'checkbox'"
					v-model="theValue as boolean"
					:class="combinedInputClass"
					type="checkbox"
					v-bind="$attrs"
					@input="updateInput($event)"
					@keyup.enter="onEnter"
				>
				<!-- select type input -->
				<select
					v-else-if="type === 'select'"
					v-model="theValue"
					:class="combinedInputClass"
					v-bind="$attrs"
					@input="updateInput($event)"
				>
					<slot />
				</select>

				<!-- custom element form inputs -->
				<form-element-codearea
					v-else-if="type === 'code'"
					v-model="theValue as string"
					:auto-size="props.autoSize"
					:class="combinedInputClass"
					:focus="props.focus"
					:language="props.language"
					:resizeable="props.resizable"
					v-bind="$attrs"
					@update="updateInput($event)"
				/>
				<form-element-keyboard
					v-else-if="type === 'keyboard'"
					v-model="theValue as string"
					:class="combinedInputClass"
					:focus="props.focus"
					v-bind="$attrs"
					@update="updateInput($event)"
				/>
				<form-element-switch
					v-else-if="type === 'switch'"
					v-model="theValue as boolean"
					:class="combinedInputClass"
					:label="props.label"
					:sm="props.sm"
					v-bind="$attrs"
					@update="updateInput($event)"
				/>

				<!-- clearable button -->
				<div
					v-if="clearable && inputAsText.includes(type)"
					class="absolute right-2 top-[50%] -translate-y-1/2 text-gray-400"
				>
					<i
						:class="sm?'bi bi-x':'bi bi-x-lg'"
						class="cursor-pointer"
						@click="theValue = ''"
					/>
				</div>
			</div>
		</div>

		<!-- Display the error message -->
		<div
			v-if="errors"
			ref="inputError"
			class="text-xs text-red-600"
		>
			{{ errors }}
		</div>

		<!-- Display a helper message, via message slot or message prop -->
		<slot name="message" />
		<markdown-it
			v-if="props.message"
			:class="props.messageClass"
			:text="props.message"
		/>

		<button
			v-if="props.axios?.button"
			class="absolute -top-2 right-0 z-10 px-1 border bg-green-500"
			@click="onEnter"
		>
			<i
				v-if="props.axios.button === true"
				class="bi bi-save"
			/>
			<span
				v-else
				v-katex.auto="props.axios.button"
			/>
		</button>
	</div>
</template>

<style scoped>
div.inlineLabel {
	@apply flex items-center gap-3;
}

input {
	/* @apply text-black; */
	padding-left: v-bind(iconPadding);
}

</style>
