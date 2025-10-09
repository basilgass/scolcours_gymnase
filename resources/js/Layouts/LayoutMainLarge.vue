<script lang="ts" setup>
import MainFooter from "@/Components/MainFooter.vue"
import MainHeader from "@/Components/MainHeader.vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import {Head, usePage} from "@inertiajs/vue3"
import {computed, ref, watch} from "vue"
import FlashContainer from "@/Components/Ui/FlashContainer.vue"

const props = withDefaults(defineProps<{
	theme?: Partial<ThemeInterface>
}>(), {
	theme: () => {
		return {
			title: 'Scolcours',
			slug: 'main'
		}
	}
})

const currentTheme = ref(props.theme ? props.theme : {title: "Scolcours", slug: "main"})
watch(() => props.theme, () => {
	currentTheme.value = props.theme ? props.theme : {title: "Scolcours", slug: "main"}
})

// REFACTOR: Change the pageTitle function to be more global (chapter, post, challenge, ...)
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
		<main class="min-h-[75vh] px-3">
			<!-- Main content -->
			<slot />
		</main>
		<!-- Footer of the page -->
		<main-footer />

		<!-- Flash message handler -->
		<flash-container />
	</div>
</template>

