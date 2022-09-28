<template>
	<div
		:class="{
			'columns-1 md:columns-2 lg:columns-3 column-toc gap-8 space-y-4': !floating,
			'flex flex-col gap-4 p-3': floating
		}"
	>
		<div
			v-for="post in chapterPosts"
			:key="post.id"
			class="cursor-pointer flex gap-3 hover:gap-5 transition-all"
			@click="tocClick(post.id)"
		>
			<i
				:class="{
					'bi bi-calculator': post.type==='exercise',
					'bi bi-text-paragraph': !post.type
				}"
			/>
			<span v-katex.auto="post.title" />
		</div>
	</div>
</template>
<script setup>
import {menuScrollTo} from "@/Composables/useHelpers"
import {inject} from "vue"

const emits = defineEmits(["menuClick"])
let chapterPosts = inject("chapterPosts")

const props = defineProps({
	"floating": {type: Boolean, default: false}
})

let tocClick = function (id) {
	menuScrollTo(`post-${id}`)
	emits("menuClick")
}
</script>
