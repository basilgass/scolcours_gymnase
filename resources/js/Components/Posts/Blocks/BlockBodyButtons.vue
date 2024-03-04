<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
		buttons: { type: [Object, Boolean], required: true },
		modelValue: { type: Number, required: true },
	})
	const emits = defineEmits(["update:modelValue"])

	interface Button {
		show: boolean
		icon: string
		text: string
	}

	interface buttonsInterface {
		reset?: Button
		random?: Button
	}

	const availableButtons = computed<buttonsInterface>(() => {
		if (typeof props.buttons === "boolean") {
			return {}
		}
		return props.buttons as buttonsInterface
	})

	const refresh = function (value) {
		emits("update:modelValue", value)
	}
</script>
<template>
	<div
		v-if="props.buttons"
		class="flex gap-3"
	>
		<div v-if="availableButtons.reset.show">
			<button
				:class="`btn-scolcours-${$page.props.theme.slug} btn-xs tracking-wider d-block`"
				@click="refresh(1)"
			>
				<i
					v-show="availableButtons.reset.icon"
					:class="availableButtons.reset.icon"
					class="mr-2"
				/>
				<span v-katex.auto="availableButtons.reset.text" />
			</button>
		</div>

		<button
			v-if="props.buttons && availableButtons.random.show"
			:class="`btn-scolcours-${$page.props.theme.slug} btn-xs tracking-wider d-block`"
			@click="refresh(props.modelValue + 1)"
		>
			<i
				v-show="availableButtons.random.icon"
				:class="availableButtons.random.icon"
				class="mr-2"
			/>
			<span v-katex.auto="availableButtons.random.text" />
		</button>
	</div>
</template>
