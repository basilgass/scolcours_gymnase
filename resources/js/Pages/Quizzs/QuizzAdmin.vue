<script
	setup
	lang="ts"
>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { router } from "@inertiajs/vue3"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import axios from "axios"
import { PropType } from "vue"
import type { QuizzInterface } from "@/types/modelInterfaces"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({ layout: LayoutMain })

defineProps({
	quizzs: { type: Object as PropType<QuizzInterface[]>, required: true },
})

function createQuizz() {
	axios.post(route("api.quizzs.store"))
		.then(res => {
			// ROUTE : make it more restfull
			router.visit(route("admin.quizzs.quizz", [res.data]))
		})
}
</script>


<template>
	<main class="scolcours-container">
		<section>
			<h1 class="text-2xl pt-10">
				Quizz
			</h1>
			<div class="flex justify-between pb-10">
				<h2 class="text-xl">
					Administration
				</h2>

				<sc-button
					type="add"
					@click="createQuizz"
				>
					Nouveau quizz
				</sc-button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
				<InertiaLink
					v-for="quizz of quizzs"
					:key="quizz.id"
					:href="route('admin.quizzs.quizz', [quizz.id])"
					class="flex flex-col gap-5
				cursor-pointer
				bg-content
				border rounded
				px-5 py-5
				hover:scale-105 transition-transform"
				>
					<h3
						v-katex.auto="quizz.title"
						class="text-lg font-semibold"
					/>
					<markdown-it :text="quizz.body" />
				</InertiaLink>
			</div>
		</section>
	</main>
</template>
