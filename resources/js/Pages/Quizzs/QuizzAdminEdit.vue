<script setup lang="ts">
import { computed, inject, PropType, ref } from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import QuestionsIndex from "@/Components/Posts/Questions/QuestionsIndex_OLD.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { router } from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import axios from "axios"
import { flashInterface } from "@/types"
import { ChapterInterface, TeamInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

	const flash = inject<flashInterface>("flash")
	const props = defineProps({
			quizz: { type: Object, required: true },
			questions: { type: Object, required: true },
			sessions: { type: Object, required: true },
			teams: { type: Object as PropType<TeamInterface[]>, required: true },
			chapters: { type: Object as PropType<ChapterInterface[]>, required: true },
		}),
		ongoing = function (session) {
			return session.current <= session.total && session.enable
		},
		theQuizz = ref(props.quizz)

	const showQuizzForm = ref(false),
		quizzUpdate = function () {
			axios
				.post(route("quizzs.update", [theQuizz.value.id]), {
					title: theQuizz.value.title,
					body: theQuizz.value.body,
					outro: theQuizz.value.outro,
					chapter_id: theQuizz.value.chapter,
					_method: "PATCH",
				})
				.then(() => {
					showQuizzForm.value = false
					flash.success("le quizz a bien été mis à jour")
				})
				.catch((err) => {
					console.warn(err)
				})
		},
		quizzDestroy = function () {
			axios
				.post(route("quizzs.destroy", [theQuizz.value.id]), {
					_method: "DELETE",
				})
				.then(() => {
					router.visit(route("quizzs.admin"))
				})
		}

	const showUsersIndex = ref(-1),
		sessionTeam = ref<string|number>(""),
		sessionName = ref(""),
		sessionCreate = function () {
			axios
				.post(route("quizzs.sessions.create", [theQuizz.value.id]), {
					name: sessionName.value,
					team: sessionTeam.value,
				})
				.then(() => {
					showNewSessionForm.value = false
					flash.success(
						`la session ${
							sessionName.value
						} a bien été créée pour l'équipe ${
							props.teams.filter(
								(x) => +x.id === +sessionTeam.value,
							)[0].name
						}`,
					)
					// Add the new session
				})
				.catch((err) => {
					console.warn(err)
				})
		},
		sessionDestroy = function (id) {
			axios
				.post(route("quizzs.sessions.destroy", [id]), {
					_method: "DELETE",
				})
				.then(() => {
					flash.success("session supprimée")
					// remove the deleted session
				})
				.catch((err) => {
					console.warn(err)
				})
		},
		showNewSessionForm = ref(false),
		sessionCreateEnable = computed(() => {
			return !(sessionTeam.value === "" || sessionName.value === "")
		})

	// onMounted(() => {
	// 	console.table(props.quizz)
	// 	console.table(props.sessions.data)
	// 	console.table(props.teams)
	// })
</script>
<template>
	<section>
		<div class="py-10">
			<div class="flex justify-between">
				<h1 class="text-2xl font-semibold">
					Gestion du quizz
				</h1>
				<confirm-button
					xs
					@click="quizzDestroy"
				>
					supprimer
				</confirm-button>
			</div>
			<Link
				:href="route('quizzs.admin')"
				class="hover:pl-3 transition-all"
			>
				<i class="bi bi-arrow-left" /> tous les quizz
			</Link>
		</div>

		<div class="bg-white border border-slate-200 rounded py-3 px-5">
			<h2
				class="text-2xl"
				v-text="theQuizz.title"
			/>
			<markdown-it :text="theQuizz.body" />

			<hr class="divide-slate-100 my-5">
			<markdown-it :text="theQuizz.outro" />
		</div>

		<div class="max-w-lg mx-auto grid grid-cols-2 gap-5 my-10">
			<button
				class="btn btn-xs text-lg bg-white h-32"
				@click="showQuizzForm = true"
			>
				éditer le quizz
			</button>
			<button
				class="btn btn-xs text-lg bg-white h-32"
				@click="showNewSessionForm = true"
			>
				nouvelle session
			</button>
		</div>

		<dialog-modal
			v-model="showNewSessionForm"
			class="py-2 max-w-lg"
		>
			<template #header>
				<h2 class="px-5 text-lg border-b border-slate-200">
					Nouvelle session
				</h2>
			</template>
			<template #footer>
				<div class="border-t border-slate-200 px-5 text-right pt-2">
					<button
						class="btn px-10"
						:class="sessionCreateEnable ? 'btn-primary' : ''"
						:disabled="!sessionCreateEnable"
						@click="sessionCreate"
					>
						créer
					</button>
				</div>
			</template>
			<div class="px-5 py-3">
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
				<form-maker
					v-model="sessionName"
					name="id session"
					label="id session"
				/>
			</div>
		</dialog-modal>
		<dialog-modal
			v-model="showQuizzForm"
			class="max-w-xl py-2"
		>
			<template #header>
				<h2 class="text-xl px-5 border-b border-slate-200">
					éditer le quizz
				</h2>
			</template>
			<template #footer>
				<div class="px-5 text-right">
					<button
						class="btn btn-primary"
						@click="quizzUpdate"
					>
						Enregistrer les modifications
					</button>
				</div>
			</template>
			<div class="px-5">
				<form-maker
					type="select"
					v-model="theQuizz.chapter"
					name="quizz-themes"
					label="thème"
				>
					<option value="">
						-
					</option>
					<option
						v-for="chapter in props.chapters"
						:key="'chapter-' + chapter.id"
						:value="chapter.id"
						v-text="chapter.title"
					/>
				</form-maker>
				<form-maker
					v-model="theQuizz.title"
					name="quizz-title"
					label="title"
				/>
				<form-maker
					type="textarea"
					v-model="theQuizz.body"
					name="quizz-body"
					label="body"
					:rows="10"
				/>
				<form-maker
					type="textarea"
					v-model="theQuizz.outro"
					name="quizz-outro"
					label="outro"
					:rows="4"
				/>
			</div>
		</dialog-modal>

		<div>
			<!-- list of questions - make it draggable, like in a post -->
			<questions-index
				:container-id="theQuizz.id"
				container-type="Quizz"
				:questions="props.questions.data"
			/>
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
					<th>Suppr.</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(session, index) in props.sessions.data"
					:key="`session-${session.id}`"
					class="hover:bg-yellow-200"
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
					<td>
						<confirm-button @confirm="sessionDestroy(session.id)">
							supprimer
						</confirm-button>
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>
