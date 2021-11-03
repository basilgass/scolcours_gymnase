<template>
	<div class="katex-editor w-full">
		<div class="flex justify-between">
			<label
					:for="name"
					class="block uppercase font-bold text-xs text-gray-700"
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
				:value="modelValue"
				class="border border-gray-200 w-full p-2 rounded bg-transparent
        focus:outline-none focus:ring-2 focus:ring-blue-200"
				@input="tex = $event.target.value;$emit('update:modelValue', $event.target.value)"
			>
		<div class="min-h-[40px]">
			<div
					v-if="asciiMode"
					v-katex.ascii.left="modelValue"
				/>
			<div
					v-else
					v-katex.left="modelValue"
				/>
		</div>
	</div>
</template>
<script setup>
	import {onMounted} from "vue"

	const emits = defineEmits(["update:modelValue"])
	const props = defineProps(
		{
			modelValue: {type: String, default: ""},
			name: {type: String, default: "math"},
			latex: {type: Boolean, default: false},
		}
	)

	let asciiMode = false
	onMounted(() => {
		asciiMode = !props.latex
	})

</script>
