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
				class="text-xs cursor-pointer"
				@click="asciiMode=!asciiMode"
				v-text="asciiMode?'ASCII':'LaTeX'"
			/>
		</div>
		<input
			:class="{
				'border-gray-200 focus:border-gray-600': !correct,
				'border-2 border-green-600': correct
			}"
			:name="name"
			:value="modelValue"
			class="w-full p-2 rounded bg-transparent
				border
        		focus:outline-none"
			@input="$emit('update:modelValue', $event.target.value)"
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
		<div class="flex justify-end">
			<button
				:class="correct?'btn-success':'btn-primary'"
				class="btn"
				@click="$emit('validate', modelValue)"
				v-text="correct?'Nouveau':'Valider'"
			/>
		</div>
	</div>
</template>
<script setup>
import {onMounted, ref} from "vue"

const emits = defineEmits(["update:modelValue", "validate"])
const props = defineProps(
	{
		modelValue: {type: String, default: ""},
		name: {type: String, default: "math"},
		latex: {type: Boolean, default: false},
		correct: {type: Boolean, default: false}
	}
)

let asciiMode = ref(false)
onMounted(() => {
	asciiMode.value = !props.latex
})

</script>
