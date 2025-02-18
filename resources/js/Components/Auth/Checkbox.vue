<script>
export default {

	props: {
		checked: {
			type: [Array, Boolean],
			default: false,
		},
		value: {
			default: null,
		},
	},
	emits: ["update:checked"],

	computed: {
		proxyChecked: {
			get() {
				return this.checked
			},

			set(val) {
				this.$emit("update:checked", val)
			},
		},
	},
}
</script>

<template>
	<input
		v-model="proxyChecked"
		:value="value"
		class="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200 focus:ring-opacity-50"
		type="checkbox"
	>
</template>
