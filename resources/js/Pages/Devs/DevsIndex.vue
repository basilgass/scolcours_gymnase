<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	pages: {
		type: Array, default: () => []
	},
})

</script>
<template>
	<!-- Title -->
	<ArticleTitle title="Développement" />

	<div class="flex flex-col divide-y">
		<InertiaLink
			v-for="(page, index) in props.pages"
			:key="index"
			:href="route('dev', [page])"
			class="hover:pl-3 transition-animation duration-300 py-3"
		>
			{{ page }}
		</InertiaLink>
	</div>
</template>
