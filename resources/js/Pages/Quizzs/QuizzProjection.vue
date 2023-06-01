<template>
	<section
		v-if="liveQuizz.enable"
		class="px-5"
	>
		<div
			v-if="liveQuizz.status==='wait' || liveQuizz.status==='question'"
			class="font-lg bg-black text-white mb-10 flex justify-between items-baseline fixed top-0 left-0 w-full px-5 py-2"
		>
			<h2
				v-katex.auto="liveQuizz.quizz.title"
				class="text-white"
			/>
			<div class="text-xs text-gray-100">
				Question {{ liveQuizz.current }} sur {{ liveQuizz.total }}
			</div>
		</div>

		<quizz-intro
			v-if="liveQuizz.status==='intro'"
			:quizz="liveQuizz.quizz"
		/>
		<quizz-outro
			v-else-if="liveQuizz.status==='outro'"
			:quizz="liveQuizz.quizz"
		/>
		<quizz-question-projection
			v-else
			:quizz-session="liveQuizz"
			:users-count="props.usersCount"
			:results="props.results"
		/>
	</section>
	<section
		v-else
		class="w-full min-h-[100vh] grid place-items-center"
	>
		<div class="flex flex-col gap-4">
			<div>Le quizz n'est pas activé.</div>

			<Link
				as="button"
				class="inline-block hover:font-semibold"
				href="/"
			>
				Retour à l'accueil
			</Link>
		</div>
	</section>
</template>

<script>

import LayoutProjection from "@/Layouts/LayoutProjection.vue"

export default {
	layout: LayoutProjection
}
</script>
<script setup>

import {computed, onBeforeUnmount, onMounted, ref} from "vue"
import QuizzQuestion from "@/Components/Quizzs/QuizzQuestion.vue"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import {router} from "@inertiajs/vue3"
import QuizzWait from "@/Components/Quizzs/QuizzWait.vue"
import QuizzQuestionProjection from "@/Components/Quizzs/QuizzQuestionProjection.vue"

let props = defineProps({
		quizzSession: {type: Object, required: true},
		results: {type: Array},
		usersCount: {type: Number, required: true},
	}),
	interval = null,
	updateCounter = ref(0),
	updateQuizz = function () {
		router.reload({
			preserveScroll: true,
			preserveState: true
		})
		updateCounter.value++
	},
	liveQuizz = computed(()=>props.quizzSession.data)

onMounted(() => {
	interval = setInterval(() => updateQuizz(), 2000)
})
onBeforeUnmount(() => {
	clearInterval(interval)
})

</script>
