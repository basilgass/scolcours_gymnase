<template>
	<section class="py-10">
		<div class="bg-white rounded border border-slate-200 p-4">
			<h2
				v-katex.auto="liveQuizz.quizz.title"
				class="font-semibold text-lg mb-3"
			/>
			<markdown-it :text="liveQuizz.quizz.body" />
		</div>

		<div class="max-w-xl mx-auto h-32 my-20">
			<button
				v-if="liveQuizz.enable"
				class="btn is-active w-full h-full"
				@click="updateEnable(false)"
			>
				En cours...
			</button>
			<button
				v-else
				class="btn btn-success w-full h-full"
				@click="updateEnable(true)"
			>
				Démarrer
			</button>
		</div>

		<table class="max-w-xl mx-auto mt-10">
			<tr
				class="border-y border-slate-200"
				:class="liveQuizz.current === 0 ? 'is-active' : ''"
			>
				<td class="h-16 px-4 w-full">
					Introduction
				</td>
				<td class="w-64">
					<button
						v-show="liveQuizz.current !== 0"
						class="btn h-full w-64 bg-white"
						@click="updateCurrent(0)"
					>
						set
					</button>
				</td>
			</tr>
			<tr
				v-for="(question, index) in liveQuizz.questions"
				:key="`q-${question.id}`"
				class="border-y border-slate-200"
				:class="liveQuizz.current === index + 1 ? 'is-active' : ''"
			>
				<td class="h-16 px-4">
					{{ question.block.title || "sans titre" }}
				</td>
				<td class="w-64">
					<div class="flex gap-3">
						<button
							v-show="liveQuizz.current !== (index+1)"
							class="btn h-full w-64 bg-white"
							@click="updateCurrent(index + 1)"
						>
							set
						</button>
						<button
							class="btn h-full w-64 bg-white"
						>
							réponses
						</button>
						<button
							class="btn h-full w-64 bg-white"
						>
							solution
						</button>
					</div>
				</td>
			</tr>
			<tr
				class="border-y border-slate-200"
				:class="
					liveQuizz.current > liveQuizz.questions.length
						? 'is-active'
						: ''
				"
			>
				<td class="h-16 px-4">
					Récapitulatif
				</td>
				<td class="w-64">
					<button
						v-show="liveQuizz.current !== (liveQuizz.questions.length + 1)"
						class="btn h-full w-64 bg-white"
						@click="updateCurrent(liveQuizz.questions.length + 1)"
					>
						set
					</button>
				</td>
			</tr>
		</table>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import { computed } from "vue"
import QuizzQuestion from "@/Components/Quizzs/QuizzQuestion.vue"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import { router } from "@inertiajs/vue3"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
		quizzSession: { type: Object, required: true },
	}),
	liveQuizz = computed(() => props.quizzSession.data)

const updateCurrent = function (index) {
	router.post(
		route("quizzs.sessions.updateCurrent", [liveQuizz.value.shortcode]),
		{ index },
		{
			preserveState: true,
			preserveScroll: true,
		}
	)
}
const updateEnable = function (enable) {
	router.post(
		route("quizzs.sessions.updateEnable", [liveQuizz.value.shortcode]),
		{ enable },
		{
			preserveState: true,
			preserveScroll: true,
		}
	)
}
</script>
