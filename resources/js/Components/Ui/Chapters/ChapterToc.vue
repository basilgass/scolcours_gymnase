<template>
	<div class="flex flex-col gap-3 mb-4">
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

let tocClick = function (id) {
	menuScrollTo(`post-${id}`)
	emits("menuClick")
}
</script>
