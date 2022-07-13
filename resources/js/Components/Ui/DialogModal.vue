<template>
	<dialog
		ref="root"
		class="rounded-lg"
		@click.self="doCancel"
		@close="emits('update:modelValue', false)"
	>
		<div v-if="$slots.header">
			<slot name="header" />
		</div>
		<div>
			<slot />
		</div>
		<div v-if="$slots.footer">
			<slot name="footer" />
		</div>
	</dialog>
</template>

<script setup>

import {ref, watch} from "vue"

const emits = defineEmits([
	"update:modelValue", "cancel"
])

const  props = defineProps({
	modelValue: Boolean
})

// Detect the change of the modelValue.
watch(()=>props.modelValue, (val)=>{
	if(val){root.value.showModal()}else{root.value.close()}
})

let root = ref(null)

function doCancel(){
	emits("cancel")
	emits("update:modelValue", false)
}
</script>
