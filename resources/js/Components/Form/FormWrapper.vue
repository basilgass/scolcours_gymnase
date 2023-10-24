<script lang="ts" setup>
	import { computed } from "vue"

	const props = defineProps({
		// Set the type of the input
		fontCode: { type: Boolean, default: false },
		helper: { type: Boolean, default: false },
		inlineLabel: { type: Boolean, default: false },
		inputClass: { type: String, default: "" },
		label: { type: String, default: "" },
		labelAsPlaceholder: { type: Boolean, default: false },
		labelClass: { type: String, default: "" },
		max: { type: [Number, String], default: null },
		min: { type: [Number, String], default: null },
		modelValue: {
			type: [String, Number, Boolean],
			default: "",
		},
		placeholder: { type: String, default: "" },
		sm: { type: Boolean, default: false },
		step: { type: [Number, String], default: null },
		type: {
			type: String,
			default: "text",
			validator(value: string) {
				return ["text", "number", "checkbox", "radio", "code"].includes(
					value,
				)
			},
		},
		withIcon: { type: Boolean, default: false },
	})

	const combinedInputClass = computed(() => {
		return `${props.inputClass} ${props.sm ? "text-xs p-1" : "p-2"} ${
			props.withIcon ? "!pl-10" : ""
		} ${
			props.fontCode ? "font-code" : ""
		} w-full border-[1px] border-slate-200 rounded appearance-none focus:border-slate-400 focus:outline-none focus:ring-0 focus:shadow transition`
	})

	const iconPadding = computed(() => {
		return props.withIcon ? "2.5rem" : "0.5rem"
	})

	const placeholderValue = computed(() => {
		if (props.placeholder !== "") {
			return props.placeholder
		}

		return props.labelAsPlaceholder ? props.label : ""
	})

	const $emit = defineEmits(["update:modelValue"])

	let updateInput = function (e) {
		if (props.type === "text") {
			$emit("update:modelValue", e.target.value)
			return
		} else if (props.type === "number") {
			$emit(
				"update:modelValue",
				e.target.value === "" ? "" : parseFloat(e.target.value),
			)
			return
		} else if (props.type === "checkbox") {
			$emit("update:modelValue", e.target.checked)
			return
		} else if (props.type === "radio") {
			$emit("update:modelValue", e.target.value)
			return
		}
	}
</script>

<template>
	<div
		:class="{
			helper: props.helper,
			inlineLabel: props.inlineLabel,
		}"
	>
		<label
			v-show="!props.labelAsPlaceholder"
			v-katex.auto="props.label"
			:class="labelClass"
		>
		</label>
		<div class="inputWrapper relative">
			<div
				v-show="props.withIcon"
				class="absolute w-8 grid place-items-center h-full border-r top-1/2 transform -translate-y-1/2 text-gray-400"
			>
				<i
					:class="{
						'bi bi-123': props.type === 'number',
						'bi bi-fonts': props.type === 'text',
					}"
				/>
			</div>
			<input
				v-if="type === 'text'"
				:value="modelValue"
				:class="combinedInputClass"
				@input="updateInput($event)"
				:placeholder="placeholderValue"
			/>
			<input
				v-if="type === 'number'"
				:value="modelValue"
				type="number"
				:class="combinedInputClass"
				@input="updateInput($event)"
				:placeholder="placeholderValue"
				:min="props.min"
				:max="props.max"
				:step="props.step"
			/>
			<input
				v-if="type === 'checkbox'"
				:class="combinedInputClass"
				:value="modelValue"
				type="checkbox"
				@input="updateInput($event)"
			/>
		</div>
	</div>
</template>

<style scoped>
	label {
		@apply font-semibold text-xs;
	}
	div.inlineLabel {
		@apply flex items-center gap-3;
	}
	div.inlineLabel > label {
		@apply text-base;
	}
	input {
		padding-left: v-bind(iconPadding);
	}

	.helper {
		border: 1px solid red;
	}
</style>
