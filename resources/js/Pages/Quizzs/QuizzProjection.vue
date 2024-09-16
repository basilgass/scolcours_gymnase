<script
	lang="ts"
	setup
>

import { computed, onBeforeUnmount, onMounted, PropType, ref } from "vue"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import { router } from "@inertiajs/vue3"
import QuizzQuestionProjection from "@/Components/Quizzs/QuizzQuestionProjection.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import { resultInterface } from "@/types"

defineOptions({ layout: LayoutProjection })
let props = defineProps({
	quizzSession: { type: Object, required: true },
	results: { type: Object as PropType<resultInterface[]>, default: () => [] },
	usersCount: { type: Number, required: true }
}),
	interval = null,
	updateCounter = ref(0),
	updateQuizz = function () {
		router.reload()
		updateCounter.value++
	},
	liveQuizz = computed(() => props.quizzSession.data)

onMounted(() => {
	interval = setInterval(() => updateQuizz(), 2000)
})
onBeforeUnmount(() => {
	clearInterval(interval)
})

</script>

<template>
	<section
		v-if="liveQuizz.enable"
		class="px-5"
	>
		<div
			v-if="liveQuizz.status === 'wait' || liveQuizz.status === 'question'"
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
			v-if="liveQuizz.status === 'intro'"
			:quizz="liveQuizz.quizz"
		/>
		<quizz-outro
			v-else-if="liveQuizz.status === 'outro'"
			:quizz="liveQuizz.quizz"
		/>
		<quizz-question-projection
			v-else
			:quizz-session="liveQuizz"
			:results="props.results"
			:users-count="props.usersCount"
		/>
	</section>
	<section
		v-else
		class="w-full min-h-[100vh] grid place-items-center"
	>
		<div class="flex flex-col gap-4">
			<div>Le quizz n'est pas activé.</div>

			<InertiaLink
				as="button"
				class="inline-block hover:font-semibold"
				href="/"
			>
				Retour à l'accueil
			</InertiaLink>
		</div>
	</section>
</template>
