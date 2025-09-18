<script setup lang="ts">
import {computed, ref} from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import Card from "@/Components/Ui/Card.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {AxiosResponseModel} from "@/types"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	quizzSession: QuizzSessionInterface
}>()
const liveQuizz = ref<QuizzSessionInterface>(props.quizzSession)

const updateCurrent = function (index: number) {
	if (index === liveQuizz.value.current) {
		return
	}

	axios.patch(
		route("api.admin.quizzs.sessions.updateCurrent", {quizzSession: liveQuizz.value.id}),
		{index},
	).then((res: AxiosResponseModel<QuizzSessionInterface>) => {
		liveQuizz.value = res.data
	})
}

const outroIndex = computed(() => liveQuizz.value.questions.length + 1)

const toc = computed(() => {
	return [
		"introduction",
		...liveQuizz.value.questions.map(question => question.block.title || "sans titre"),
		"récapitulatif"
	]
})

// REFACTOR: changer le QuizzDashboard pour être plus efficient et facile à utiliser.
</script>

<template>
	<section class="py-10 space-y-3">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<card>
				<template #header>
					<h2
						v-katex.auto="liveQuizz.quizz.title"
						class="font-semibold text-lg"
					/>
					<h3 class="font-code">
						{{ liveQuizz.current }} - {{ liveQuizz.status }}
					</h3>
				</template>

				<div class="grid grid-cols-1 gap-2">
					<div
						v-for="(title, index) in toc"
						:key="`toc-${index}`"
						class="flex items-center"
					>
						<div
							class="grid grid-cols-2 py-1 cursor-pointer rounded flex-1"
							:class="{
								'bg-blue-100 border border-blue-400  px-3 font-semibold': liveQuizz.current === index
							}"
							@click="updateCurrent(index)"
							v-katex.auto="title"
						/>
						<div class="pl-3 w-[80px] flex justify-around items-center opacity-20">
							<i class="cursor-pointer bi bi-123" />
							<i class="cursor-pointer bi bi-bar-chart" />
							<i class="cursor-pointer bi bi-cloud" />
						</div>
					</div>
				</div>
			</card>

			<div v-if="liveQuizz.status==='question'">
				<question-show
					:question="liveQuizz.questions[liveQuizz.current-1]"
					editor-mode
					class="max-w-lg mx-auto"
					block-only
					auto-answer
				/>
			</div>
		</div>
	</section>
</template>
