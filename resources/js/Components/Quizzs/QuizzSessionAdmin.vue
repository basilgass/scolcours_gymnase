<script setup lang="ts">

import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import type {QuizzSessionInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import axios from "axios"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()
const props = defineProps<{
	quizzId: number,
	sessions: QuizzSessionInterface[],
	teams: TeamInterface[]
}>()

const showUsersIndex = ref(-1)
const sessionTeam = ref<string | number>("")
const sessionName = ref("")


function ongoing(session: QuizzSessionInterface) {
	return session.current <= session.total && session.enable
}

function sessionCreate() {
	axios
		.post(route("api.admin.quizzs.sessions.create", [props.quizzId]), {
			name: sessionName.value,
			team: sessionTeam.value,
		})
		.then(() => {
			showNewSessionForm.value = false
			flash.success(
				`la session ${sessionName.value
				} a bien été créée pour l'équipe ${props.teams.filter(
					(x) => +x.id === +sessionTeam.value,
				)[0].name
				}`,
			)
			// Add the new session
		})
		.catch((err) => {
			console.warn(err)
		})
}

function sessionDestroy(id) {
	axios
		.post(route("api.admin.quizzs.sessions.destroy", [id]), {
			_method: "DELETE",
		})
		.then(() => {
			flash.success("session supprimée")
			// remove the deleted session
		})
		.catch((err) => {
			console.warn(err)
		})
}

const showNewSessionForm = ref(false)
const sessionCreateEnable = computed(() => {
	return !(sessionTeam.value === "" || sessionName.value === "")
})
</script>

<template>
	<article>
		<h2 class="text-lg">
			sessions précédantes
		</h2>
		<sc-button
			type="add"
			icon
			@click="showNewSessionForm=true"
		>
			nouvelle session
		</sc-button>
		<table
			v-if="props.sessions.length > 0"
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
					v-for="(session, index) in props.sessions"
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
							class="absolute right-0 w-[250px] max-h-[30em] overflow-y-auto bg-white shadow-sm p-3 flex flex-col gap-3 z-10"
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
						<InertiaLink
							:href="route('admin.quizzs.sessions.dashboard', [
								session.shortcode,
							])
							"
						>
							dashboard
						</InertiaLink>
					</td>
					<td>
						<confirm-button @confirm="sessionDestroy(session.id)">
							supprimer
						</confirm-button>
					</td>
				</tr>
			</tbody>
		</table>
	</article>

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
</template>

<style scoped>

</style>
