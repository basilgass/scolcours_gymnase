<script setup lang="ts">
import {computed, ref} from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import Card from "@/Components/Ui/Card.vue"
import {AxiosResponseModel} from "@/types"
import ScButton from "@/Components/Ui/Button/scButton.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	quizzSession: QuizzSessionInterface
}>()
const liveQuizz = ref<QuizzSessionInterface>(props.quizzSession)

function updateCurrent(index: number) {
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

function updateShowAnswer() {
	axios.patch(
		route('api.admin.quizzs.sessions.updateShowAnswer', {quizzSession: liveQuizz.value.id})
	).then((res: AxiosResponseModel<QuizzSessionInterface>) => {
		liveQuizz.value = res.data
	})
}

const toc = computed(() => {
	return [
		"introduction",
		...liveQuizz.value.questions.map(question => question.block.title || "sans titre"),
		"récapitulatif"
	]
})

</script>

<template>
	<section class="py-10 relative">
		<div class="fixed w-full bottom-0 h-[8rem] bg-content grid grid-cols-3 items-center">
			<div
				v-if="liveQuizz.current>0"
				class="p-3 cursor-pointer"
				@click="updateCurrent(liveQuizz.current-1)"
			>
				<i class="bi bi-chevron-left" /> précédant
			</div>
			<div v-else />
			<sc-button
				type="primary"
				:outline="!liveQuizz.showAnswer"
				@click="updateShowAnswer"
			>
				<i
					class="cursor-pointer bi bi-eye mr-3"
				/> réponse
			</sc-button>
			<div
				v-if="liveQuizz.current<liveQuizz.questions.length+1"
				class="text-right p-3 cursor-pointer"
				@click="updateCurrent(liveQuizz.current+1)"
			>
				suivant <i class="bi bi-chevron-right" />
			</div>
			<div v-else />
		</div>
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
					<div class="pl-3 w-[80px] flex justify-around items-center">
						templates
					</div>
				</div>
			</div>
		</card>
	</section>
</template>
