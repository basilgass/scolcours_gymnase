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

		<!-- Aside element -->
		<transition name="slide-right">
			<aside
				v-show="showFloatingFooter"
				class="
					w-10 h-10 z-30
					fixed
					bottom-8 right-1
					md:bottom-5 md:right-5
					flex justify-center items-center
					bg-gray-100
					border border-gray-400
					rounded-full
					hover:text-white hover:bg-blue-500 hover:border-blue-800
					hover:rotate-90
					transition-all duration-500
					cursor-pointer"
				@click="useMenuScrollTo()"
			>
				<i class="bi bi-chevron-left" />
			</aside>
		</transition>

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
import {computed, onMounted, onUnmounted, provide, ref} from "vue"
import {useMenuScrollTo} from "@/Composables/useHelpers"
import FlashMessage from "@/Components/Ui/FlashMessage.vue"

defineProps({
	theme: {
		type: Object, default: () => {
			return {title: "Scolcours", slug: "main"}
		}
	}
})

let showScrollToTop = ref(400),
	scrollY = ref(0),
	showFloatingFooter = computed(()=>{
		return scrollY.value > showScrollToTop.value
	})


let	flashMessages = ref([]),
	addFlashMessage = function(message, type="success", timeout=2000){
		flashMessages.value.push({message, type, timeout})
	}
provide("flash", {add: addFlashMessage})

provide("showfloatingfooter", showFloatingFooter)


onMounted(()=>{
	window.addEventListener("scroll", handleScroll)

	// flashMessages.value = [
	// 	{type: "success", message: "a success message", timeout: 5000},
	// 	{type: "error", message: "an error message", timeout: 5000},
	// 	{type: "info", message: "an information message", timeout: 5000}
	// ]
})

onUnmounted(()=>{
	window.removeEventListener("scroll", handleScroll)
})

function handleScroll(event){
	scrollY.value = window.scrollY
}

</script>
<style scoped>

</style>
