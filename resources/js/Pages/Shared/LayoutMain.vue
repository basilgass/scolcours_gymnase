<template>
	<MainHeader :theme="theme" />
	<div class="min-h-screen bg-gray-100 relative">
		<main class="scolcours-container  min-h-screen">
			<slot />
		</main>

		<main-footer />

		<transition name="slide-right">
			<div
				v-show="scrollY > showScrollToTop"
				class="fixed w-10 h-10 bottom-3 right-5 bg-gray-100 rounded-full border border-gray-400 hover:text-white hover:bg-blue-500 hover:border-blue-800 flex justify-center items-center hover:rotate-90 transition-all duration-500 cursor-pointer"
				@click="menuScrollTo()"
			>
				<i class="bi bi-chevron-left" />
			</div>
		</transition>
	</div>
</template>

<script setup>
import MainHeader from "@/Components/MainHeader"
import MainFooter from "@/Components/MainFooter"
import {onMounted, onUnmounted, ref} from "vue"

defineProps({
	theme: {
		type: Object, default: () => {
			return {title: "Scolcours", slug: "main"}
		}
	}
})

let showScrollToTop = ref(400),
	scrollY = ref(0)

onMounted(()=>{
	window.addEventListener("scroll", handleScroll)
})

onUnmounted(()=>{
	window.removeEventListener("scroll", handleScroll)
})

function handleScroll(event){
	scrollY.value = window.scrollY
}

function menuScrollTo(id) {
	let el = id === undefined ? document.body : tableocontents.value.querySelector(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}
</script>
<style scoped>

</style>
