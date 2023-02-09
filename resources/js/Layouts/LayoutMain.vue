<template>
	<div>
		<!-- Header of the page -->
		<MainHeader :theme="theme" />

		<!-- Container for the "column design" -->
		<div class="min-h-screen bg-gray-100">
			<!-- Main content -->
			<main class="scolcours-container min-h-screen">
				<slot />
			</main>

			<!-- Footer of the page -->
			<main-footer />
		</div>

		<!-- Flash message handler -->
		<div
			v-if="flashMessages.length"
			class="fixed bottom-2 right-2 grid grid-cols-1 gap-3 max-w-[20em]"
		>
			<flash-message
				v-for="(message, idx) in flashMessages"
				:key="`flash-${idx}`"
				:class="{
					'bg-red-600/80 text-white':message.type==='error',
					'bg-green-600/80 text-white':message.type==='success',
					'bg-amber-400/80 text-black':message.type==='info',
					'bg-white text-black': message.type===undefined
				}"
				:timeout="message.timeout"
				@open="message.id=$event"
				@close="flashMessages = flashMessages.filter(x=>x.id!==$event)"
			>
				{{ message.message }}
			</flash-message>
		</div>
	</div>
</template>

<script setup>
import MainHeader from "@/Components/MainHeader"
import MainFooter from "@/Components/MainFooter"
import {computed, onMounted, provide, ref} from "vue"
import FlashMessage from "@/Components/Ui/FlashMessage.vue"

defineProps({
	theme: {
		type: Object, default: () => {
			return {title: "Scolcours", slug: "main"}
		}
	}
})

let	flashMessages = ref([]),
	addFlashMessage = function(message, type="success", timeout=2000){
		flashMessages.value.push({message, type, timeout})
	}
provide("flash", {add: addFlashMessage})

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

onMounted(()=>{
	globalEditMode.value = (localStorage.getItem("scolcours_editMode")==="true") || false
	globalCorrectionMode.value = (localStorage.getItem("scolcours_correctionMode") === "true") || false
})

</script>
<style scoped>

</style>
