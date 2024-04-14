<script lang="ts" setup>
import { ref } from "vue"
import type { FormMakerPropsType } from "@/Components/Form/FormMakerInterface"

/**
 * This component is used to generate a form input
 */

// Define the model value.
const theValue = defineModel<string | number | boolean | null>({
	set(value) {
		if (props.type === "switch" || props.type === "checkbox") return !!value

		if (props.type === "id" || props.type === "number") return +value

		if (value === null) return ""

		if (value === true) return ""

		// Make sure it's a string
		return `${value}`
	}
})


// Define the list of inputs that are text based

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
	axios: null
})

// Define the emits

// Get the root element
const inputWrapper = ref(null)

// Display the error message if any
</script>

<template>
	<div
		:class="{
			helper: props.helper,
			inlineLabel: props.inlineLabel,
		}"
		class="relative"
	>
		<!-- Display the input -->
		<div
			ref="inputWrapper"
			class="w-full"
		>
			<div class="flex items-stretch">
				<input
					v-model="theValue"
				>
			</div>
		</div>

		<!-- Display the error message -->
	</div>
</template>

<style scoped>


</style>
