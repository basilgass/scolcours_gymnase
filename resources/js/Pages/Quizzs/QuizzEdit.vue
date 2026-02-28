<script
	setup
	lang="ts"
>
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {QuestionInterface, QuizzInterface, QuizzSessionInterface, TeamInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {ref} from "vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const flash = useStoreFlashMessage()

const props = defineProps<{
	quizz: QuizzInterface,
	questions: QuestionInterface[],
	sessions: QuizzSessionInterface[],
	teams: TeamInterface[],
}>()

const theQuestions = props.questions
const theQuizz = ref(props.quizz)

function quizzUpdate() {
	axios
		.patch(
			route("api.admin.quizzs.update", [theQuizz.value.id]),
			{
				title: theQuizz.value.title,
				chapter_id: theQuizz.value.chapter.id,
			})
		.then(() => {
			flash.success("le quizz a bien été mis à jour")
		})
		.catch((err) => {
			console.warn(err)
		})
}

// function quizzDestroy() {
// 	axios
// 		.post(route("api.admin.quizzs.destroy", [theQuizz.value.id]), {
// 			_method: "DELETE",
// 		})
// 		.then(() => {
// 			router.visit(route("admin.quizzs.index"))
// 		})
// }

</script>
<template>
	<section class="my-5 scolcours-container space-y-5">
		<header>
			<article-title
				title="éditer un quizz"
				:return-link="{
					url: route('admin.quizzs.index'),
					label: 'tous les quizz'
				}"
			/>

			<div class="mt-5 min-h-[1.5em]">
				<h2
					v-theme.text
					class="text-xl font-semibold"
					v-katex.auto="theQuizz.title"
				/>
				<div class="font-code text-xs">
					{{ theQuizz.chapter?.title }}
				</div>
			</div>
		</header>

		<!--		<quizz-session-admin-->
		<!--			:quizz-id="theQuizz.id"-->
		<!--			:sessions-->
		<!--			:teams-->
		<!--		/>-->

		<card
			class="mt-10"
		>
			<div class="flex flex-col gap-3">
				<form-maker
					v-model="theQuizz.title"
					name="quizz-title"
					label="title"
				/>
				<form-maker
					type="chapter"
					v-model="theQuizz.chapter"
					label="chapitre"
				/>
			</div>
			<template #footer>
				<div class="flex justify-end">
					<sc-button
						type="save"
						icon
						xs
						@click="quizzUpdate"
					/>
				</div>
			</template>
		</card>

		<div class="grid grid-cols-2 gap-3">
			<block-show :block="quizz.intro" />
			<block-show :block="quizz.outro" />
		</div>

		<!-- list of questions - make it draggable, like in a post -->
		<questions-index
			:container="{
				id: theQuizz.id,
				type: 'Quizz'
			}"
			v-model:questions="theQuestions"
			minimal
		/>
	</section>
</template>
