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
				@click="menuScrollTo()"
			>
				<i class="bi bi-chevron-left" />
			</aside>
		</transition>
	</div>
</template>

<script setup>
import MainHeader from "@/Components/MainHeader"
import MainFooter from "@/Components/MainFooter"
import {computed, onMounted, onUnmounted, provide, ref} from "vue"
import {menuScrollTo} from "@/Composables/useHelpers"

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

provide("showfloatingfooter", showFloatingFooter)

onMounted(()=>{
	window.addEventListener("scroll", handleScroll)
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
