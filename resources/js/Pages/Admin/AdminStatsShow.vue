<template>
	<h1 class="text-3xl pt-5 mb-10">
		Statistiques de {{ chapter.title }}
	</h1>

	<section>
		<div
			v-for="(post, id) of stats"
			:key="`post-${id}`"
		>
			<h3
				v-katex.auto="post.title"
				class="text-lg font-semibold"
			/>

			<div
				v-for="(question, index) of post.questions"
				:key="`question-${question.id}`"
			>
				{{ index + 1 }} (id: {{ question.id }}) - {{ question.resolved }} sur {{ users }}

				<progress-bar :percent="question.resolved/users*100" />

				{{ question.answers }} tentatives
			</div>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import ProgressBar from "@/Pages/Admin/ProgressBar"

let props = defineProps({
	chapter: {type: Object},
	users: {type: Number},
	stats: {type: Object},
	questions: {type: Array}
})

console.log(props.stats)
</script>

