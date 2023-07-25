<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>

		<div class="h-[80vh] w-full grid place-items-center">
			<div
				v-if="props.quizzSessions.length>0"
				class="flex justify-center max-w-xl gap-5 container"
			>
				<div
					v-for="quizzSession in props.quizzSessions"
					:key="quizzSession.shortcode"
					class="bg-white border transition-all rounded grid place-items-center p-5 w-full md:w-1/2"
					:class="`border-scolcours-${quizzSession.quizz.theme?.slug}`"
				>
					<div class="text-center flex flex-col gap-4">
						<h3
							v-katex.auto="quizzSession.quizz.title"
							class="font-semibold"
						/>
						<Link
							as="button"
							:class="`btn-scolcours-${quizzSession.quizz.theme?.slug}`"
							:href="route('quizzs.sessions.show', [quizzSession.shortcode])"
						>
							participer
						</Link>
					</div>
				</div>
			</div>
			<div v-else>
				Dommage, vous n'êtes pour l'instant pas invité à un quizz.
			</div>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import {onMounted} from "vue"
import {router} from "@inertiajs/vue3"

let props = defineProps({
	quizzSessions: { type: Array, required: true },
})

let interval = null,
	updateQuizz = ()=> {
		router.reload({
			preserveScroll: true,
			preserveState: true
		})
	}
onMounted(()=>{
	interval = setInterval(() => updateQuizz(), 2000)
})
</script>
