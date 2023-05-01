<template>
	<section>
		<h2
			v-katex.auto="liveQuizz.quizz.title"
			class="font-semibold text-lg"
		/>
		<markdown-it :text="liveQuizz.quizz.body" />

		<div class="text-center">
			<button
				v-if="liveQuizz.enable"
				class="btn is-active"
				@click="updateEnable(false)"
			>
				En cours...
			</button>
			<button
				v-else
				class="btn"
				@click="updateEnable(true)"
			>
				Démarrer
			</button>
		</div>

		<table class="w-full mt-10">
			<tr :class="liveQuizz.current === 0 ? 'is-active' : ''">
				<td>Introduction</td>
				<td>
					<button
						class="btn btn-xs"
						@click="updateCurrent(0)"
					>
						set
					</button>
				</td>
			</tr>
			<tr
				v-for="(question, index) in liveQuizz.questions"
				:key="`q-${question.id}`"
				:class="liveQuizz.current === index + 1 ? 'is-active' : ''"
			>
				<td>{{ question.block.title || "sans titre" }}</td>
				<td>
					<button
						class="btn btn-xs"
						@click="updateCurrent(index + 1)"
					>
						set
					</button>
				</td>
			</tr>
			<tr
				:class="
					liveQuizz.current > liveQuizz.questions.length
						? 'is-active'
						: ''
				"
			>
				<td>Récapitulatif</td>
				<td>
					<button
						class="btn btn-xs"
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
import { Inertia } from "@inertiajs/inertia"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
		quizzSession: { type: Object, required: true },
	}),
	liveQuizz = computed(() => props.quizzSession.data)

const updateCurrent = function (index) {
	Inertia.post(
		route("quizzs.sessions.updateCurrent", [liveQuizz.value.shortcode]),
		{ index },
		{
			preserveState: true,
			preserveScroll: true,
		}
	)
}
const updateEnable = function (enable) {
	Inertia.post(
		route("quizzs.sessions.updateEnable", [liveQuizz.value.shortcode]),
		{ enable },
		{
			preserveState: true,
			preserveScroll: true,
		}
	)
}
</script>
