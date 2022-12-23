<template>
	<button
		v-admin
		class="absolute -right-1 -top-1 z-10 border bg-white rounded-full w-8 h-8"
		:class="edit?'bg-green-100 text-green-600':'bg-red-100 text-red-600'"
		@click="btnClick"
	>
		<i class="bi bi-pencil" />
	</button>
</template>
<script setup>

import {ref} from "vue"

let props = defineProps({
		modelValue: {type: Boolean, required:true}
	}),
	edit = ref(props.modelValue),
	btnClick = function() {
		edit.value = !edit.value
		emits("update:modelValue", edit.value)
	}

let emits = defineEmits(["update:modelValue"])


</script>
