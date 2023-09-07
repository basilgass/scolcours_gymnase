<template>
	<form-field>
		<button
			class="btn-form"
			:class="type==='submit'?'btn-primary':''"
			v-bind="$attrs"
			:type="type"
		>
			<slot />
		</button>
	</form-field>
</template>

<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false
}
</script>

<script setup>
import FormField from "@/Components/Form/FormField.vue"

let props = defineProps({
	type: {type: String, default: "submit"}
})
</script>
