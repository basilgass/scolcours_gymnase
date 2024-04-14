<script lang="ts" setup>
import { ref } from "vue"

/**
 * This component is used to generate a form input
 */

// Define the model value.
const theValue = defineModel<string | number | boolean | null>({
	set(value) {
		if (value === null) return ""

		if (value === true) return ""

		// Make sure it's a string
		return `${value}`
	}
})


// Define the list of inputs that are text based

// Default props

// Define the emits

// Get the root element
const inputWrapper = ref(null)

// Display the error message if any
</script>

<template>
	<div
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
