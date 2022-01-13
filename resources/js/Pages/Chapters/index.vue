<template>
	<ArticleTitle :title="theme.title" />
	
	<div class="space-y-5 mt-10">
		<div
			v-for="chapter in chapters"
			:key="`chapter-${chapter.slug}`"
		>
			<a
				:href="route('theme.chapter', [$page.props.theme.slug, chapter.slug])"
				class="text-2xl hover:pl-3 transform transition-all"
			>
				{{ chapter.title }}
			</a>
			<p>{{ chapter.body }}</p>
		</div>
	</div>
</template>

<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain,
}
</script>

<script setup>
import ArticleTitle from '@/Components/Ui/ArticleTitle'

defineProps({
	theme: { type: Object, default: () => {} },
	chapters: {type: Array, default: () => []}
})
</script>

<style scoped>

</style>
