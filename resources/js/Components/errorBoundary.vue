<script setup lang="ts">

import {onErrorCaptured, ref, watch} from "vue"

const props = defineProps<{
	resetKey: unknown
}>()
const hasError = ref(false)
const errorMessage = ref("")

const emits = defineEmits<{
	error: [info: string]
}>()

onErrorCaptured((msg: string) => {
	hasError.value = true
	errorMessage.value = msg

	emits('error', msg)

	console.warn(msg)
	return false
})

// Watch resetKey to reset error state
watch(() => props.resetKey, () => {
	hasError.value = false
	errorMessage.value = ""
})

</script>

<template>
	<div>
		<slot
			v-if="hasError"
			name="error"
		>
			Apparemment, il y a une erreur...
		</slot>

		<slot v-else />

		<div
			v-admin
			class="font-code"
		>
			{{ errorMessage }}
		</div>
	</div>
</template>
