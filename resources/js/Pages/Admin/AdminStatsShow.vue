<template>
	<h1 class="text-3xl pt-5">
		Statistiques de {{ team.name }}
	</h1>
	<h3 class="text-2xl mb-10">
		{{ chapter.title }}
	</h3>

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

import ProgressBar from "@/Components/Ui/ProgressBar.vue"
import {computed} from "vue"

let props = defineProps({
	team: {type: Object},
	chapter: {type: Object},
	users: {type: Number},
	stats: {type: Object}
})
</script>

