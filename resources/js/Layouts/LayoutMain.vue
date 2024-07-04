<script
	lang="ts"
	setup
>
import MainHeader from "@/Components/MainHeader.vue"
import MainFooter from "@/Components/MainFooter.vue"
import { computed, PropType, provide, ref } from "vue"
import FlashMessage from "@/Components/Ui/FlashMessage.vue"
import { Head, usePage } from "@inertiajs/vue3"
import { flashConfig, flashMessageInterface, ThemeInterface } from "@/types"

defineProps({
	theme: {
		type: Object as PropType<ThemeInterface>,
		default: () => {
			return { title: "Scolcours", slug: "main" }
		}
	}
})

const flashMessages = ref<flashMessageInterface[]>([])

function addFlashMessage(
	message,
	type: "success" | "info" | "error",
	config: flashConfig
) {
	flashMessages.value.push({
		id: null,
		message,
		type,
		config: {
			timeout: 1000 * 2,
			...config
		}
	}
	)
}

provide("flash", {
	add: addFlashMessage,
	success: (message, config: flashConfig) =>
		addFlashMessage(message, "success", config),
	info: (message, config: flashConfig) =>
		addFlashMessage(message, "info", config),
	error: (message, config: flashConfig) =>
		addFlashMessage(message, "error", config)
})


const pageTitle = computed(() => {
	if (usePage()?.props?.chapter) {
		return usePage().props.chapter.meta_title
			? usePage().props.chapter.meta_title
			: usePage().props.chapter.title
	}

	return usePage().props.theme ? usePage().props.theme.title : null
})

</script>

<template>
	<div>

		<Head :title="pageTitle" />

		<!-- Header of the page -->
		<MainHeader :theme="theme" />

		<div class="my-10 max-w-2xl mx-auto p-5 bg-red-100 border border-red-600 shadow text-red-700">
			Attention - le site web est en cours de développement. Certaines fonctionnalités peuvent ne pas être
			disponibles.
		</div>

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
		<div v-if="flashMessages.length" class="fixed bottom-2 right-2 grid grid-cols-1 gap-3 max-w-[20em]">
			<flash-message v-for="(message, idx) in flashMessages" :key="`flash-${idx}`" :class="{
				'bg-red-600/80 text-white': message.type === 'error',
				'bg-green-600/80 text-white': message.type === 'success',
				'bg-amber-400/80 text-black': message.type === 'info',
				'bg-white text-black': message.type === undefined,
			}" :link="message.config?.link" :timeout="message.config.timeout"
				@close=" flashMessages = flashMessages.filter((x) => x.id !== $event)" @open="message.id = $event"
				:message="message.message" />
		</div>
	</div>
</template>
<style scoped></style>
