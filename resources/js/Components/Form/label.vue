<template>
	<label
			class="block mb-2 uppercase font-bold text-xs text-gray-700"
			:for="name"
		>
		{{ ucLabel }}
	</label>
</template>

<script>
	export default {
		name :"FormLabel",
		props: {
			name: {type: String, required: true},
			label: {type: String, default: ""},
		},
		computed: {
			ucLabel() {
				if (this.label !== "") {
					return this.label
				} else {
					return this.name
				}
			}
		}
	}
</script>
