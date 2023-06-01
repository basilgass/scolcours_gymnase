<!--suppress ALL -->
<template>
	<!-- Title -->
	<ArticleTitle title="Développement" />

	<div class="flex flex-col divide-y">
		<Link
			v-for="(page, index) in props.pages"
			:key="index"
			:href="route('dev', [page])"
			class="hover:pl-3 transition-animation duration-300 py-3"
		>
			{{ page }}
		</Link>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import FormInput from "@/Components/Form/FormInput.vue"
import {computed, defineAsyncComponent, onMounted, ref} from "vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {router} from "@inertiajs/vue3"

let toolSlug = ref(null),
	toolSearch = ref("")

const props = defineProps({
	pages: {
		type: Array, default: () => []
	},
})

</script>

