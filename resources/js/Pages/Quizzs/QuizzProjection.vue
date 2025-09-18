<script
	lang="ts"
	setup
>

import {computed, onBeforeUnmount, onMounted, ref} from "vue"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import {router} from "@inertiajs/vue3"
import QuizzQuestionProjection from "@/Components/Quizzs/QuizzQuestionProjection.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import {QuizzInterface, QuizzSessionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

defineOptions({layout: LayoutProjection})

let props = defineProps<{
	quizz: QuizzInterface,
	quizzSession: QuizzSessionInterface,
	scores: ScoreInterface<ScoreQuestionDataInterface>[],
	usersCount: number
}>()

let interval = null
const updateCounter = ref(0)

function updateQuizz() {
	router.reload()
	updateCounter.value++
}

const liveQuizz = computed(() => props.quizzSession)

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
		class="pt-10"
	>
		<header
			class="font-lg bg-black text-white
			flex justify-between items-baseline
			fixed top-0 left-0 w-full px-5 py-2"
		>
			<h2
				v-katex.auto="liveQuizz.quizz.title"
				class="text-white"
			/>
			<div class="text-xs text-gray-100">
				Question {{ liveQuizz.current }} sur {{ liveQuizz.total }}
			</div>
		</header>

		<quizz-intro
			v-if="liveQuizz.status === 'intro'"
			:quizz
		/>
		<quizz-outro
			v-else-if="liveQuizz.status === 'outro'"
			:quizz
		/>

		<quizz-question-projection
			v-else
			:quizz-session="liveQuizz"
			:scores="props.scores"
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
				class="inline-block hover:font-semibold"
				href="/"
			>
				Retour à l'accueil
			</InertiaLink>
		</div>
	</section>
</template>
