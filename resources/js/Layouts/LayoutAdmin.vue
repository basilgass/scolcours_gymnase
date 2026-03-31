<script lang="ts" setup>
import MainFooter from "@/Components/MainFooter.vue"
import MainHeader from "@/Components/MainHeader.vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import {Head} from "@inertiajs/vue3"
import {ref, watch} from "vue"
import {usePageTitle} from "@/Composables/usePageTitle"
import FlashContainer from "@/Components/Ui/FlashContainer.vue"
import AdminDashboardAside from "@/Components/Admin/AdminDashboardAside.vue"

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
		<MainHeader
			hide-admin
			:theme="theme"
		/>

		<!-- Container for the "column design" -->
		<main class="min-h-[75vh] flex flex-col md:flex-row w-full">
			<admin-dashboard-aside class="order-2 md:order-1" />
			<section class="flex-1 p-10 order-1 md:order-2">
				<!-- Main content -->
				<slot />
			</section>
		</main>
		<!-- Footer of the page -->
		<main-footer />

		<!-- Flash message handler -->
		<flash-container />
	</div>
</template>

