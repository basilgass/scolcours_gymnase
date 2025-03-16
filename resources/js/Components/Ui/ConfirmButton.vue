<script lang="ts" setup>
import { computed, ref } from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps({
	btnClass: { type: String, default: "btn btn-success" },
	confirmClass: { type: String, default: "btn btn-warning" },
	confirmText: { type: String, default: "vraiment ?" },
	xs: { type: Boolean, default: false }
})
const emits = defineEmits(["confirm"])

const confirmClick = ref(false),
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
	<sc-button
		:type="confirmClick?'confirm':'delete'"
		:xs
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
	</sc-button>
</template>
