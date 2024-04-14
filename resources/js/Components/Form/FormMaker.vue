<script lang="ts" setup>

/**
 * This component is used to generate a form input
 */

// Define the model value.
const theValue = defineModel<string | number | boolean | null>()


// Define the list of inputs that are text based

// Default props

// Define the emits

// Get the root element

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
