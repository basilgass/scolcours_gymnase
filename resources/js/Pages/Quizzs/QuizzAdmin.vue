<template>
	<section>
		<h1 class="text-2xl pt-10">
			Quizz
		</h1>
		<div class="flex justify-between pb-10">
			<h2 class="text-xl">
				Administration
			</h2>

			<button
				class="btn btn-add btn-xs"
				@click="createQuizz"
			>
				Nouveau quizz
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
			<Link
				v-for="quizz of quizzs"
				:key="quizz.id"
				:href="route('quizzs.admin.quizz', [quizz.id])"
				class="flex flex-col gap-5
				cursor-pointer
				bg-white
				border border-slate-100 rounded
				px-5 py-5
				hover:scale-105 transition-transform"
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
import {Inertia} from "@inertiajs/inertia"

let props = defineProps({
	quizzs: { type: Array, required: true },
})

function createQuizz(){
	axios.post(route("quizzs.store"))
		.then(res=>{
			Inertia.visit(route("quizzs.admin.quizz", [res.data]))
		})
}
</script>
