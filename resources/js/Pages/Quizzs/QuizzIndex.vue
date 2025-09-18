<script
	setup
	lang="ts"
>
import {onMounted, onUnmounted} from "vue"
import {router} from "@inertiajs/vue3"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import Card from "@/Components/Ui/Card.vue"
import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	quizzSessions: QuizzSessionInterface[]
}>()

function updateQuizz() {
	router.reload()
}

let checkForUpdate = null
onMounted(() => {
	checkForUpdate = setInterval(() => updateQuizz(), 2000)
})
onUnmounted(() => {
	if (checkForUpdate) {
		clearInterval(checkForUpdate)
	}
})
</script>

<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>

		<div class="grid place-items-center">
			<div
				v-if="props.quizzSessions.length > 0"
				class="flex justify-center max-w-xl gap-5 container"
			>
				<Card
					v-for="quizzSession in props.quizzSessions"
					:key="quizzSession.shortcode"
					class="w-full md:w-1/2
					rounded-sm hover:rounded-xl hover:shadow
					transition-all
					grid place-items-center"
				>
					<InertiaLink
						:href="route('students.quizzs.sessions.show', {
							quizzSession: quizzSession.shortcode
						})"
						as="div"
						class="cursor-pointer text-center space-y-4"
					>
						<h3
							v-katex.auto="quizzSession.quizz.title"
							class="font-semibold"
						/>
						<div>participer</div>
					</InertiaLink>
				</Card>
			</div>
			<div v-else>
				Dommage, vous n'êtes pour l'instant pas invité à un quizz.
			</div>
		</div>
	</section>
</template>
