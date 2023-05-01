<template>
	<section>
		<h1 class="text-2xl">
			Quizz
		</h1>
		<h2 class="text-xl">
			gestion du quizz
		</h2>

		<div>
			<h3 class="font-lg font-semibold">
				nouvelle session
			</h3>
			<div class="flex flex-wrap gap-3">
				<button
					v-for="team in props.teams"
					:key="team.name"
					class="btn"
					:class="sessionTeam === team.id ? 'is-active' : ''"
					@click="sessionTeam = team.id"
					v-text="team.name"
				/>
			</div>
			<form-input
				v-model="sessionName"
				name="id session"
				label="id session"
			/>
			<button
				v-show="sessionTeam !== '' && sessionName !== ''"
				class="btn btn-primary"
				@click="sessionCreate"
			>
				créer
			</button>
		</div>

		<div>
			<form-input
				v-model="theQuizz.title"
				name="quizz-title"
				label="title"
			/>
			<form-textarea
				v-model="theQuizz.body"
				name="quizz-body"
				label="body"
				:rows="10"
			/>

			<!-- list of questions - make it draggable, like in a post -->
			<draggable
				v-model="theQuestions"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !$page.props.auth.can.admin,
				}"
				@end="updateQuestionsOrder"
			>
				<template #item="{ element }">
					<question-show
						class="bg-white"
						:question="element"
						show-title
						@destroy="destroyQuestion"
					/>
				</template>
				<template #footer>
					<button
						class="btn-new"
						@click="addQuestion"
					>
						ajouter une question
					</button>
				</template>
			</draggable>
		</div>

		<h2 class="text-lg my-10">
			sessions précédantes
		</h2>
		<table
			v-if="props.sessions.data.length > 0"
			class="table table-auto w-full"
		>
			<thead>
				<tr>
					<th>Shortcode</th>
					<th>Is alive</th>
					<th>Enabled</th>
					<th>Current slide</th>
					<th>Current status</th>
					<th>Total slides</th>
					<th>Users</th>
					<th>Admin</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(session, index) in props.sessions.data"
					:key="`session-${session.id}`"
				>
					<td>{{ session.shortcode }}</td>
					<td>{{ ongoing(session) }}</td>
					<td>{{ session.enable }}</td>
					<td>{{ session.current }}</td>
					<td>{{ session.status }}</td>
					<td>{{ session.total }}</td>
					<td class="relative">
						<button
							@click="
								showUsersIndex =
									showUsersIndex === index ? -1 : index
							"
						>
							{{ session.users.length }} étudiants
						</button>
						<div
							v-show="index === showUsersIndex"
							class="absolute right-0 w-[250px] max-h-[30em] overflow-y-auto bg-white shadow p-3 flex flex-col gap-3 z-10"
						>
							<button
								class="text-right text-slate-300"
								@click="showUsersIndex = -1"
							>
								fermer <i class="bi bi-x-lg" />
							</button>
							<div
								v-for="user in session.users"
								:key="`session-${session.id}-user-${user.id}`"
							>
								{{ user.name }}
							</div>
						</div>
					</td>
					<td>
						<Link
							:href="
								route('quizzs.sessions.dashboard', [
									session.shortcode,
								])
							"
						>
							dashboard
						</Link>
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>
<script setup>
import { computed, inject, onMounted, ref } from "vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"
import Button from "@/Components/Auth/Button.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"

const flash = inject("flash")
let props = defineProps({
		quizz: { type: Object, required: true },
		questions: { type: Object, required: true },
		sessions: { type: Object, required: true },
		teams: { type: Array, required: true },
	}),
	ongoing = function (session) {
		return session.current <= session.total && session.enable
	},
	theQuizz = ref(props.quizz)

let showUsersIndex = ref(-1),
	sessionTeam = ref(""),
	sessionName = ref(""),
	sessionCreate = function () {
		axios
			.post(route("quizzs.sessions.create", [theQuizz.value.id]), {
				name: sessionName.value,
				team: sessionTeam.value,
			})
			.then((res) => {
				console.log("success")
			})
			.catch((err) => {
				console.log(err)
			})
	}

let theQuestions = ref(props.questions.data),
	addQuestion = function () {
		axios
			.post(route("questions.storeTo", ["Quizz", theQuizz.value.id]), {
				math: false,
				mathAppend: "",
				body: "nouvelle question",
				answer: "-",
			})
			.then((res) => {
				// Add the question.
				theQuestions.value.push({
					...res.data.data,
					isNew: true,
				})
			})
	},
	destroyQuestion = function (destroyId) {
		theQuestions.value = theQuestions.value.filter(
			(x) => x.id !== destroyId
		)
	},
	updateQuestionsOrder = function () {
		axios
			.post(route("questions.updateOrder"), {
				order: theQuestions.value.map((x, index) => {
					return { id: x.id, order: index + 1 }
				}),
			})
			.then((res) => {
				// TODO : flash message !
				flash.add("les questions ont bien été mis à jour !")
			})
			.catch((res) => console.log("update questions order failed", res))
	}

onMounted(() => {
	console.table(props.quizz)
	console.table(props.sessions.data)
	console.table(props.teams)
})
</script>
