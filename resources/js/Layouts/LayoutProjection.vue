<template>
	<div class="min-h-screen flex flex-col bg-gray-100">
		<main class="w-full flex-1">
			<slot />
		</main>
	</div>
</template>

<script>

export default {
	name: "LayoutProjection",
}
</script>

<script setup>
import {computed, provide, ref} from "vue"

let globalEditMode = ref(false),
	globalCorrectionMode = ref(false)
provide("editMode", {
	enabled: computed(()=>{return globalEditMode.value}),
	toggle: function(){
		globalEditMode.value = !globalEditMode.value
		localStorage.setItem("scolcours_editMode", globalEditMode.value)
	}
})
provide("correctionMode", {
	enabled: computed(()=>{return globalCorrectionMode.value}),
	toggle: function(){
		globalCorrectionMode.value = !globalCorrectionMode.value
		localStorage.setItem("scolcours_correctionMode", globalCorrectionMode.value)
	}
})
</script>

