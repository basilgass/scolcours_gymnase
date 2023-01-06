<template>
	<section class="py-5">
		<post-show
			:chapter="theChapter"
			:post="thePost"
		/>

		<div class="grid grid-cols-2 md:grid-cols-3 mt-3 px-5 md:px-0">
			<div class="justify-self-start">
				<Link
					v-if="nav.previous"
					:href="nav.previous"
					class="hover:pl-3 transition-all"
				>
					<i class="bi bi-box-arrow-in-left mr-2" />précédant
				</Link>
			</div>
			<div class="justify-self-center col-span-2 order-last pt-5 md:pt-0 md:col-span-1 md:order-none flex gap-10">
				<Link :href="route('theme.chapter.intro', [$page.props.theme.slug, theChapter.slug])">
					<i class="bi bi-house mr-2" /><span v-katex.auto="theChapter.title" />
				</Link>
			</div>
			<div class="justify-self-end">
				<Link
					v-if="nav.next"
					:href="nav.next"
					class="hover:pr-3 transition-all"
				>
					suivant<i class="bi bi-box-arrow-in-right ml-2" />
				</Link>
			</div>
		</div>

		<chapter-toc
			class="mt-10"
			:active="thePost.order"
			:chapter="theChapter"
		/>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {onMounted, ref} from "vue"
import PostShow from "@/Components/Posts/PostShow.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"

let props = defineProps({
		chapter: {type: Object, required: true},
		post: {type: Object, required: true},
		nav: {type: Object, required: true}
	}),
	theChapter = ref(props.chapter.data),
	thePost = ref(props.post.data)

const storeCurrentPost = function () {
	axios.post(route("chapters.currentPost", [theChapter.value.id]), {
		currentPost: thePost.value.order,
		open: true
	}).then(res => {
		console.log(res.data)
	})
}

onMounted(() => {
	storeCurrentPost()
})
</script>
