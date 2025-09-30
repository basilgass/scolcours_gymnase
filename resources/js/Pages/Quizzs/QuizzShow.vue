<script
	setup
	lang="ts"
>

import {onBeforeUnmount, onMounted, ref} from "vue"
import QuizzQuestion from "@/Components/Quizzs/QuizzQuestion.vue"
import QuizzIntro from "@/Components/Quizzs/QuizzIntro.vue"
import QuizzOutro from "@/Components/Quizzs/QuizzOutro.vue"
import {router} from "@inertiajs/vue3"
import QuizzHeader from "@/Components/Quizzs/QuizzHeader.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import {QuestionInterface, QuizzInterface, QuizzSessionInterface} from "@/types/modelInterfaces.ts"

defineOptions({layout: LayoutProjection})

let props = defineProps<{
	quizz: QuizzInterface,
	quizzSession: QuizzSessionInterface,
	question?: QuestionInterface
}>()
let interval = null
const updateCounter = ref(0)

function updateQuizz() {
	router.reload()
	updateCounter.value++
}

onMounted(() => {
	interval = setInterval(() => updateQuizz(), 2000)
})
onBeforeUnmount(() => {
	clearInterval(interval)
})

</script>

<template>
	<section
		v-if="quizzSession.enable"
	>
		<!-- En tête lorsque les questions sont en cours -->
		<quizz-header
			v-if="quizzSession.status === 'question'"
			:quizz-session="quizzSession"
		/>

		<section class="pt-24 pb-8">
			<quizz-intro
				v-if="quizzSession.status === 'intro'"
				:quizz
			/>
			<quizz-outro
				v-else-if="quizzSession.status === 'outro'"
				:quizz
				:quizz-session
			/>
			<quizz-question
				v-else-if="quizzSession.status === 'question'"
				:key="props.question.id"
				:question="props.question"
				@validate="updateQuizz"
			/>
			<div v-else>
				Apparemment, il y a un problème avec {{ quizzSession.status }}
			</div>
		</section>
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
