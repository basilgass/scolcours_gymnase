<template>
	<div class="space-y-5">
		<div
				v-for="chapter in chapters"
				:key="`chapter-${chapter.slug}`"
			>
			<a
					:href="route('theme.chapter', [$page.props.theme.slug, chapter.slug])"
					class="text-3xl"
				>
				{{ chapter.title }}
			</a>
			<p>{{ chapter.body }}</p>
		</div>
	</div>
</template>

<script>

	export default {
		name: "Theme",
		props: {
			theme: {
				type: Object, default: () => {
				}
			},
			chapters: {type: Array, default: () => []}
		}
	}
</script>

<style scoped>

</style>
