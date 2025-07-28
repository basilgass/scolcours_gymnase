<script
	setup
	lang="ts"
>
import {onMounted, onUnmounted, PropType} from "vue"
import {router, usePage} from "@inertiajs/vue3"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { QuizzSessionInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	quizzSessions: { type: Object as PropType<QuizzSessionInterface[]>, required: true },
})

const updateQuizz = () => {
	router.reload()
}

let checkForUpdate = null
onMounted(() => {
	checkForUpdate = setInterval(() => updateQuizz(), 2000)
})
onUnmounted(()=>{
	if(checkForUpdate){
		clearInterval(checkForUpdate)
	}
})
</script>

<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>

		<div class="h-[80vh] w-full grid place-items-center">
			<div
				v-if="props.quizzSessions.length > 0"
				class="flex justify-center max-w-xl gap-5 container"
			>
				<div
					v-for="quizzSession in props.quizzSessions"
					:key="quizzSession.shortcode"
					class="bg-white border transition-all rounded-sm grid place-items-center p-5 w-full md:w-1/2"
					:class="`border-scolcours-${usePage().props.themes[quizzSession.quizz.theme_id]?.slug}`"
				>
					<div class="text-center flex flex-col gap-4">
						<h3
							v-katex.auto="quizzSession.quizz.title"
							class="font-semibold"
						/>
						<InertiaLink
							as="button"
							:class="`btn-scolcours-${usePage().props.themes[quizzSession.quizz.theme_id]?.slug}`"
							:href="route('quizzs.sessions.show', [quizzSession.shortcode])"
						>
							participer
						</InertiaLink>
					</div>
				</div>
			</div>
			<div v-else>
				Dommage, vous n'êtes pour l'instant pas invité à un quizz.
			</div>
		</div>
	</section>
</template>
