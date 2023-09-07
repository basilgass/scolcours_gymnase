<template>
	<section class="py-5">
		<Head :title="`${theChapter.title} - ${$page.props.theme.title}`" />

		<post-show
			:chapter="theChapter"
			:post="thePost"
		/>

		<div class="grid grid-cols-3 mt-3 px-5 md:px-0">
			<div class="justify-self-start">
				<Link
					v-if="nav.previous"
					:href="nav.previous"
					:class="`btn-scolcours-${$page.props.theme.slug}`"
				>
					<i class="bi bi-box-arrow-in-left mr-0 md:mr-2" />
					<div class="hidden md:inline">
						précédant
					</div>
				</Link>
			</div>
			<div class="justify-self-center flex">
				<Link
					:class="`btn-scolcours-${$page.props.theme.slug}`"
					:href="route('theme.chapter.intro', [$page.props.theme.slug, theChapter.slug])"
				>
					<i class="bi bi-house mr-2 hidden md:inline" /><span v-katex.auto="theChapter.title" />
				</Link>
			</div>
			<div class="justify-self-end">
				<Link
					v-if="nav.next"
					:href="nav.next"
					:class="`btn-scolcours-${$page.props.theme.slug}`"
				>
					<div class="hidden md:inline">
						suivant
					</div><i class="bi bi-box-arrow-in-right ml-0 md:ml-2" />
				</Link>
			</div>
		</div>

		<chapter-toc
			:active="thePost.order"
			:chapter="theChapter"
			class="mt-10"
		/>

		<chapter-formulas-slider :chapter="theChapter" />
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import PostShow from "@/Components/Posts/PostShow.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import {Head, usePage} from "@inertiajs/vue3"

let props = defineProps({
		chapter: {type: Object, required: true},
		post: {type: Object, required: true},
		nav: {type: Object, required: true}
	}),
	theChapter = ref(props.chapter.data),
	thePost = ref(props.post.data)

const storeCurrentPost = function () {
	// Update last post checked only if user is signed in
	if(usePage().props.auth.user) {
		axios.post(route("chapters.currentPost", [theChapter.value.id]), {
			post_id: thePost.value.id,
			open: true
		})
	}
}

onMounted(() => {
	storeCurrentPost()
})
</script>
