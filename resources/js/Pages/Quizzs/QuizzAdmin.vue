<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>
		<h2 class="text-xl">
			Administration
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
			<Link
				v-for="quizz of quizzs"
				:key="quizz.id"
				:href="route('quizzs.admin.quizz', [quizz.id])"
				class="cursor-pointer bg-white border border-slate-100 rounded px-5 py-5 hover:scale-105 transition-transform flex flex-col gap-5"
			>
				<h3
					v-katex.auto="quizz.title"
					class="text-lg font-semibold"
				/>
				<markdown-it :text="quizz.body" />
			</Link>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { onMounted } from "vue"

let props = defineProps({
	quizzs: { type: Array, required: true },
})
</script>
