<script
	setup
	lang="ts"
>
import {router} from "@inertiajs/vue3"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import axios from "axios"
import type {QuizzInterface, QuizzSessionInterface, TeamInterface} from "@/types/modelInterfaces"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {computed, onMounted, reactive, ref} from "vue"
import QuizzSessionItem from "@/Components/Quizzs/QuizzSessionItem.vue"
import Card from "@/Components/Ui/Card.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

type QuizzSessionsType = Record<number, QuizzSessionInterface[]>
defineOptions({layout: LayoutMain})

const props = defineProps<{
	quizzs: QuizzInterface[]
}>()

function createQuizz() {
	axios.post(route("api.admin.quizzes.store"))
		.then(res => {
			router.visit(route("admin.quizzes.edit", {quizz: res.data}))
		})
}

const sessions = reactive<QuizzSessionsType>({})

const activeSessions = computed<QuizzSessionsType>(() => {
	const active: QuizzSessionsType = {}

	Object.keys(sessions).forEach(key => {
		active[key] = sessions[key]
			.filter(session => session.status !== 'outro')
	})

	return active
})

const pastSessions = computed<QuizzSessionsType>(() => {
	const past: QuizzSessionsType = {}

	Object.keys(sessions).forEach(key => {
		past[key] = sessions[key]
			.filter(session => session.status === 'outro')
	})

	return past
})

function loadSessions(id: number) {

	axios
		.get(route('api.admin.quizzes.sessions.index', {quizz: id}))
		.then((res: AxiosResponseModel<QuizzSessionInterface[]>) => {
			sessions[id] = res.data.filter(session => session.current !== 0)
		})
		.catch((err: AxiosErrorMessage) => {
			console.log(err.response.data.message)
		})
}

function createSession(id: number) {
	axios.post(
		route('api.admin.quizzes.sessions.store', {quizz: id}),
		{
			team: team.value.id
		}
	).then((res: AxiosResponseModel<QuizzSessionInterface>) => {
		if (!Object.hasOwn(sessions, id)) {
			sessions[id] = []
		}

		sessions[id].push(res.data)

	}).catch((res: AxiosErrorMessage) => {
		console.log(res)
	})
}

function destroySession(quizzId: number, sessionId: number) {
	axios.delete(
		route('api.admin.sessions.destroy', {session: sessionId})
	).then((res: AxiosResponseModel<[number, boolean]>) => {
		sessions[quizzId] = sessions[quizzId]
			.filter(session => session.id !== sessionId)
	})
}

const team = ref<TeamInterface>(null)

onMounted(() => {
	props.quizzs.forEach(quizz => {
		sessions[quizz.id] = quizz.sessions
	})
})
</script>


<template>
	<section>
		<article-title
			title="quizz"
			:return-link="{
				url: route('admin.index'),
				label: 'administration'
			}"
		/>

		<div class="flex">
			<div />
			<div class="flex-1" />
			<div>
				<sc-button
					type="add"
					xs
					@click="createQuizz"
				>
					Nouveau quizz
				</sc-button>
			</div>
		</div>

		<div class="mt-10">
			<card
				v-for="quizz of quizzs"
				:key="quizz.id"
			>
				<template #header>
					<div class="flex justify-between">
						<h2
							v-katex.auto="quizz.title"
							class="font-xl"
						/>
						<div class="flex gap-3">
							<sc-button
								type="edit"
								xs
								:href="route('admin.quizzes.edit', {quizz: quizz.id})"
								icon
							>
								éditer
							</sc-button>
						</div>
					</div>
				</template>


				<div class="flex justify-between">
					<form-maker
						type="team"
						label="classes"
						v-model="team"
					/>

					<sc-button
						type="add"
						xs
						@click="createSession(quizz.id)"
						v-if="quizz.questions_count && team!==null"
					>
						créer une session
					</sc-button>
				</div>

				<div>
					<div
						class="space-y-3"
					>
						<quizz-session-item
							v-for="session in activeSessions[quizz.id]"
							:key="`session-${session.id}`"
							:session
							@destroy="destroySession(quizz.id, session.id)"
						/>
					</div>
				</div>

				<template #footer>
					<details>
						<summary
							class="cursor-pointer"
							@click="loadSessions(quizz.id)"
						>
							charger les anciennes sessions
						</summary>
						<div
							v-if="pastSessions[quizz.id]?.length>0"
							class="space-y-3"
						>
							<quizz-session-item
								:session
								v-for="session in pastSessions[quizz.id]"
								:key="`session-${session.id}`"
								@destroy="destroySession(quizz.id, session.id)"
							/>
						</div>
						<div
							v-else
							class="text-center min-h-[3em]"
						>
							Aucune session
						</div>
					</details>
				</template>
			</card>
		</div>
	</section>
</template>
