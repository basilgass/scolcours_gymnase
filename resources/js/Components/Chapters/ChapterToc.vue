<template>
	<div
		v-if="props.chapter.posts"
		class="my-5"
	>
		<h3 class="uppercase font-extralight mb-2">
			table des matières
		</h3>

		<div class="columns-1 md:columns-2 lg:columns-3 column-toc gap-8 space-y-4">
			<Link
				v-for="post in props.chapter.posts"
				:key="`toc-${post.id}`"
				class="block hover:pl-5 transition-all duration text-left"
				:class="active===post.order?`font-semibold text-scolcours-${$page.props.theme.slug}`:''"
				:href="route('theme.chapter.slide', [$page.props.theme.slug, props.chapter.slug, post.order])"
			>
				<i
					:class="{
						'bi bi-calculator': post.type==='exercise',
						'bi bi-text-paragraph': !post.type
					}"
				/>
				<span
					v-katex.auto="post.title"
					class="ml-2"
				/>
			</Link>
		</div>
	</div>
</template>
<script setup>

let props = defineProps({
	chapter: {type: Object, required: true},
	scroll: {type: Boolean, default: false},
	active: {type: Number, default: null}
})

</script>
