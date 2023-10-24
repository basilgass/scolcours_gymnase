<script lang="ts" setup>
	import { computed } from "vue"

	const props = defineProps({
		type: {
			type: String,
			default: "text",
			validator(value: string) {
				return ["text", "number", "checkbox", "radio", "code"].includes(
					value,
				)
			},
		},
		modelValue: {
			type: [String, Number, Boolean],
			default: "",
		},
		label: { type: String, default: "" },
		placeholder: { type: String, default: "" },
		inputClass: { type: String, default: "" },
		labelClass: { type: String, default: "" },
		helper: { type: Boolean, default: false },
		color: { type: String, default: "red" },
		min: { type: [Number, String], default: null },
		max: { type: [Number, String], default: null },
		step: { type: [Number, String], default: null },
		withIcon: { type: Boolean, default: false },
		inlineLabel: { type: Boolean, default: false },
		labelAsPlaceholder: { type: Boolean, default: false },
		fontCode: { type: Boolean, default: false },
	})

	const iconPadding = computed(() => {
		return props.withIcon ? "2.5rem" : ""
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
		<div
			class="inputWrapper relative"
			:class="props.fontCode ? 'font-code' : ''"
		>
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
				@input="updateInput($event)"
				:placeholder="placeholderValue"
			/>
			<input
				v-if="type === 'number'"
				:value="modelValue"
				type="number"
				@input="updateInput($event)"
				:placeholder="placeholderValue"
				:min="props.min"
				:max="props.max"
				:step="props.step"
			/>
			<input
				v-if="type === 'checkbox'"
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
		@apply py-2 border-[1px] border-slate-200 rounded appearance-none focus:border-slate-400 focus:outline-none focus:ring-0 focus:shadow transition;
		padding-left: v-bind(iconPadding);
	}

	.helper {
		border: 1px solid red;
	}
</style>
