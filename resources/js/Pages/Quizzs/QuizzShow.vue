<template>
	<section
		v-if="props.quizzSession.enable"
		class="px-5"
	>
		<div
			v-if="props.quizzSession.status==='wait' || props.quizzSession.status==='question'"
			class="font-lg bg-black text-white mb-10 flex justify-between items-baseline fixed top-0 left-0 w-full px-5 py-2"
		>
			<h2
				v-katex.auto="props.quizzSession.quizz.title"
				class="text-white"
			/>
			<div class="text-xs text-gray-100">
				Question {{ props.quizzSession.index }} sur {{ props.total }}
			</div>
		</div>

		<quizz-intro
			v-if="props.quizzSession.status==='intro'"
			:quizz="props.quizzSession.quizz"
		/>
		<quizz-outro
			v-else-if="props.quizzSession.status==='outro'"
			:quizz="props.quizzSession.quizz"
		/>
		<quizz-wait
			v-else-if="props.quizzSession.status==='wait'"
			:quizz="props.quizzSession.quizz"
		/>
		<quizz-question
			v-else-if="props.quizzSession.status==='question'"
			:key="props.question.data.id"
			:question="props.question.data"
			:quizz="props.quizzSession.quizz"
			@validate="updateQuizz"
		/>
		<div v-else>
			Apparemment, il y a un problème avec {{ props.quizzSession.status }}
		</div>
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
import {Inertia} from "@inertiajs/inertia"
import QuizzWait from "@/Components/Quizzs/QuizzWait.vue"

let props = defineProps({
		quizzSession: {type: Object, required: true},
		question: {type: [Object, null], required: true},
		total: {type: Number, required: true}
	}),
	interval = null,
	updateCounter = ref(0),
	updateQuizz = function () {
		Inertia.reload({
			preserveScroll: true,
			preserveState: true
		})
		updateCounter.value++
	}

onMounted(() => {
	interval = setInterval(() => updateQuizz(), 2000)
})
onBeforeUnmount(() => {
	clearInterval(interval)
})

</script>
