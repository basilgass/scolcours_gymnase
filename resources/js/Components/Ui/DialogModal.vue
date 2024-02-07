<!--
Génère un modal
Utilisé principalement pour l'édition des blocks
-->
<script setup>

import { ref } from "vue"

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

<template>
	<Teleport
		v-if="props.modelValue"
		to="body"
	>
		<div
			class="fixed inset-0 bg-gray-800/60 grid place-items-center z-50"
			@mousedown.self="doCancel"
		>
			<div
				ref="root"
				v-bind="$attrs"
				class="grid bg-white rounded-lg max-w-[1600px] w-[90%] max-h-[95vh] overflow-auto"
			>
				<div class="flex flex-col">
					<div v-if="$slots.header">
						<slot name="header" />
					</div>
					<div class="flex-1 h-full">
						<slot />
					</div>
					<div v-if="$slots.footer">
						<slot name="footer" />
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
