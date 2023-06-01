<template>
	<section
		v-if="props.quizzSession.enable"
	>
		<!-- En tête lorsque les questions sont en cours -->
		<quizz-header
			v-if="props.quizzSession.status==='wait' || props.quizzSession.status==='question'"
			:quizz-session="props.quizzSession"
		/>

		<section class="mt-12 px-5">
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
import QuizzHeader from "@/Components/Quizzs/QuizzHeader.vue"

let props = defineProps({
		quizzSession: {type: Object, required: true},
		question: {type: [Object, null], required: true},
		total: {type: Number, required: true}
	}),
	interval = null,
	updateCounter = ref(0),
	updateQuizz = function () {
		router.reload({
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
