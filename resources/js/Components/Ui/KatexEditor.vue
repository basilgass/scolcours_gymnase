<template>
	<div class="katex-editor w-full">
		<div class="flex justify-between">
			<label
					class="block uppercase font-bold text-xs text-gray-700"
					:for="name"
				>
				{{ name }}
			</label>
			<span
					class="text-xs"
					@click="asciiMode=!asciiMode"
					v-text="asciiMode?'ASCII':'LaTeX'"
				/>
		</div>
		<input
				:name="name"
				class="border border-gray-200 w-full p-2 rounded"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value);tex = $event.target.value"
			>
		<div class="min-h-[40px]">
			<div
					v-if="asciiMode"
					v-katex.ascii.left="tex"
				/>
			<div
					v-else
					v-katex.left="tex"
				/>
		</div>
	</div>
</template>
<script>

	export default {
		name: "KatexEditor",
		props: {
			name: {type: String, default: "math"},
			modelValue: {type: String, default: ""},
			latex: {type: Boolean, default: false}
		},
		emits: ["update:modelValue"],
		data() {
			return {
				tex: "",
				asciiMode: false
			}
		},
		mounted() {
			this.tex = ""+this.modelValue
			this.asciiMode = !this.latex
		},
	}
</script>

<style scoped>

</style>
