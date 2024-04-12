<script lang="ts" setup>
import MainHeader from "@/Components/MainHeader.vue"
import MainFooter from "@/Components/MainFooter.vue"
import { computed, PropType, provide, ref } from "vue"
import FlashMessage from "@/Components/Ui/FlashMessage.vue"
import { Head, usePage } from "@inertiajs/vue3"
import { ThemeInterface } from "@/types"

defineProps({
		theme: {
			type: Object as PropType<ThemeInterface>,
			default: () => {
				return { title: "Scolcours", slug: "main" }
			},
		},
	})

	const flashMessages = ref([]),
		addFlashMessage = function (
			message,
			link,
			type = "success",
			timeout = 2000,
		) {
			flashMessages.value.push({ message, link, type, timeout })
		}
	// TODO: add link in flash message
	// flash.add(message, link, timeout)
	provide("flash", {
		add: addFlashMessage,
		success: (message, link, timeout) =>
			addFlashMessage(message, link, "success", timeout),
		info: (message, link, timeout) =>
			addFlashMessage(message, link, "info", timeout),
		error: (message, link, timeout) =>
			addFlashMessage(message, link, "error", timeout),
	})


const pageTitle = computed(() => {
	if(usePage()?.props?.chapter) {
		return usePage().props.chapter.meta_title
			? usePage().props.chapter.meta_title
			: usePage().props.chapter.title
	}

	return usePage().props.theme?usePage().props.theme.title:null
})

</script>

<template>
	<div>
		<Head :title="pageTitle" />

		<!-- Header of the page -->
		<MainHeader :theme="theme" />

		<!-- Container for the "column design" -->
		<div class="min-h-screen bg-gray-100">
			<!-- Main content -->
			<main class="min-h-screen">
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
					'bg-red-600/80 text-white': message.type === 'error',
					'bg-green-600/80 text-white': message.type === 'success',
					'bg-amber-400/80 text-black': message.type === 'info',
					'bg-white text-black': message.type === undefined,
				}"
				:link="message.link"
				:timeout="message.timeout"
				@close="
					flashMessages = flashMessages.filter((x) => x.id !== $event)
				"
				@open="message.id = $event"
			>
				{{ message.message }}
				<template />
			</flash-message>
		</div>
	</div>
</template>
<style scoped></style>
