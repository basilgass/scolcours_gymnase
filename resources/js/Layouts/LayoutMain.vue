<script lang="ts" setup>
import MainFooter from "@/Components/MainFooter.vue"
import MainHeader from "@/Components/MainHeader.vue"
import FlashMessage from "@/Components/Ui/FlashMessage.vue"
import {flashConfig, flashMessageInterface} from "@/types"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import {Head, usePage} from "@inertiajs/vue3"
import {computed, provide, ref} from "vue"

withDefaults(defineProps<{
	theme: Partial<ThemeInterface>
}>(), {
	theme: () => {
		return {
			title: 'Scolcours',
			slug: 'main'
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


// TODO: Change the pageTitle funciton to be more glabal (chapter, post, challenge, ...)
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

		<!-- Container for the "column design" -->
		<main class="scolcours-container min-h-[75vh]">
			<!-- Main content -->
			<slot />
		</main>
		<!-- Footer of the page -->
		<main-footer />

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
				:link="message.config?.link"
				:timeout="message.config.timeout"
				@close=" flashMessages = flashMessages.filter((x) => x.id !== $event)"
				@open="message.id = $event"
				:message="message.message"
			/>
		</div>
	</div>
</template>

