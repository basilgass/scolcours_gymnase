<script lang="ts" setup>
import MainFooter from "@/Components/MainFooter.vue"
import MainHeader from "@/Components/MainHeader.vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import {Head} from "@inertiajs/vue3"
import {ref, watch} from "vue"
import FlashContainer from "@/Components/Ui/FlashContainer.vue"
import {usePageTitle} from "@/Composables/usePageTitle"

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

const {title: pageTitle} = usePageTitle()

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
		<flash-container />
	</div>
</template>

