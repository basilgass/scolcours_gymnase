<template>
	<div
		v-if="props.modelValue"
		class="fixed inset-0 bg-gray-800/60 grid place-items-center"
		@click.self="doCancel"
	>
		<div
			ref="root"
			class="grid items-center bg-white rounded-lg px-5 py-3 max-w-[800px] w-[80%]"
			@close="emits('update:modelValue', false)"
		>
			<div>
				<div v-if="$slots.header">
					<slot name="header" />
				</div>
				<div>
					<slot />
				</div>
				<div v-if="$slots.footer">
					<slot name="footer" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

import {ref} from "vue"

const emits = defineEmits([
	"update:modelValue", "cancel"
])

const  props = defineProps({
	modelValue: Boolean
})

// Detect the change of the modelValue.
// watch(()=>props.modelValue, (val)=>{
// 	if(val){root.value.showModal()}else{root.value.close()}
// })

let root = ref(null)

function doCancel(){
	emits("cancel")
	emits("update:modelValue", false)
}
</script>
