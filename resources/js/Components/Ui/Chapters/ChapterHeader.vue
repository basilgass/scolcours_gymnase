<template>
	<section ref="root">
		<!-- title -->
		<div class="flex justify-between items-center">
			<ArticleTitle
				:chapter="theme.title"
				:title="title"
			/>

			<button
				v-if="editChapter===false && $page.props.auth.can.admin && editMode"
				class="btn-edit btn-xs"
				@click="editChapter=true"
			>
				éditer <i class="bi bi-pencil" />
			</button>
		</div>

		<div v-if="editChapter===false">
			<illustration-show
				v-if="chapter.block.illustrations.length>0"
				:illustration="chapter.block.illustrations[0]"
			/>
			<markdown-it
				:text="chapter.block.body"
				class="mb-5"
			/>
		</div>
		<div
			v-else
			class="border border-gray-400 rounded-xl px-4 py-2 bg-white"
		>
			<chapter-edit
				:chapter="chapter"
				@close="chapterEdited"
			/>
		</div>
	</section>
</template>

<script setup>
import {inject, ref} from "vue"
import ChapterEdit from "@/Components/Ui/Chapters/ChapterEdit"
import ArticleTitle from "@/Components/Ui/ArticleTitle"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import IllustrationShow from "@/Components/Posts/IllustrationShow"

let props = defineProps({
	theme: {type: Object, required: true},
	chapter: {type: Object, required: true}
})

let editMode = inject("editmode")

let root = ref(null),
	editChapter = ref(false),
	title = ref(props.chapter.title),
	body = ref(props.chapter.body)

function chapterEdited(item){
	editChapter.value=false

	if(item!==false) {
		title.value = item.title
		body.value = item.body
	}
}

</script>
