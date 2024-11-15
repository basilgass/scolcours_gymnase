<script lang="ts" setup>
import { computed, ref } from "vue"

const props = defineProps({
	btnClass: { type: String, default: "btn-success" },
	confirmClass: { type: String, default: "btn-warning" },
	confirmText: { type: String, default: "vraiment ?" },
	xs: { type: Boolean, default: false }
})
const emits = defineEmits(["confirm"])

const confirmClick = ref(false),
	buttonClass = computed(() => {
		const cl = props.xs ? "btn-xs " : ""
		return cl + (confirmClick.value ? props.confirmClass : props.btnClass)
	}),
	btnClick = function() {
		if (!confirmClick.value) {
			confirmClick.value = true
			setTimeout(() => {
				confirmClick.value = false
			}, 2000)
		} else {
			emits("confirm")
		}
	}
</script>

<template>
	<button
		:class="buttonClass"
		class="btn"
		@click="btnClick"
	>
		<span v-show="!confirmClick"><slot /></span>

		<span
			v-show="confirmClick"
		>
			<slot name="confirm">
				{{ props.confirmText }}
			</slot>
		</span>
	</button>
</template>
