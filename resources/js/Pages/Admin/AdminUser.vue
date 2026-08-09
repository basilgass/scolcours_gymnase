<script lang="ts" setup>

import {computed, ref} from "vue"
import {router, useForm} from "@inertiajs/vue3"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import axios from "axios"
import type {TeamInterface, UserInterface} from "@/types/modelInterfaces"
import type {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"

// TODO: créer un composant pour chaque utilisateur - plus propre ?

defineOptions({layout: LayoutAdmin})

const props = defineProps<{
	users: UserInterface[],
	teams: TeamInterface[]
}>()

interface UserTeamInterface {
	id: number,
	name: string
}

const theUsers = ref(props.users)
const theTeams = ref(props.teams)

const flash = useStoreFlashMessage()
const usersEmails = ref("")
const usersEmailsList = computed(() => {
	const sep = usersEmails.value.includes(";") ? ";" : "\n"

	return usersEmails.value.split(sep).filter(x => x !== "").map(x => x.trim().toLowerCase())
})


const form = useForm<{
	users: string[],
	password: string
}>({
	users: [],
	password: "GymnaseScolcours"
})

function addUsers() {
	form.transform((data) => ({
		users: usersEmailsList.value,
		password: data.password
	})).post(route("admin.users.store"), {
		preserveScroll: true,
		onSuccess: () => {
			flash.success("Utilisateurs ajoutés")
			form.reset()
			usersEmails.value = ""

		}
	})

}

const deleteMode = ref(false)

function destroyUser(id: number) {
	axios.post(route("api.admin.users.destroy", [id]), {_method: "delete"}).then((res) => {
		if (res.data) {
			// Reload the page.
			router.reload({only: ["users"]})
		}
	})
}

const usersTeams = computed<string[]>(() => {
	return [
		...new Set([...theUsers.value
			.filter(user => user.teams)
			.map(user => (user.teams ?? []).flatMap(team => team.name))
			.flat()
		])
	]
})
const teamsMode = ref(false)
const selectedTeam = ref<string>("")

const selectedUsers = computed(() => {
	if (selectedTeam.value === "") {
		return theUsers.value
	} else if (selectedTeam.value === "_") {
		return theUsers.value.filter(user => (user.teams ?? []).length === 0)
	} else {
		return theUsers.value.filter(user => (user.teams ?? []).find(team => team.name === selectedTeam.value))
	}
})

const createUsersShow = ref(false)


const editUserShow = ref(false)
const editUserForm = ref({
	id: 0,
	firstname: "",
	name: ""
})

function editUser(id: number) {
	const user = theUsers.value.find(x => x.id === id)
	if (!user) {
		return
	}
	editUserForm.value.id = user.id
	editUserForm.value.name = user.name
	editUserForm.value.firstname = user.firstname
	editUserShow.value = true
}

function editUserStore() {
	axios.post(route("admin.users.update", [editUserForm.value.id]), {
		...editUserForm.value,
		_method: "PATCH"
	}).then(res => {
		editUserShow.value = false
		// update the user
		theUsers.value.forEach(user => {
			if (user.id === editUserForm.value.id) {
				user.name = editUserForm.value.name
				user.firstname = editUserForm.value.firstname
				user.fullname = res.data.fullname
			}
		})
		flash.success("Utilisateur modifié")
	}).catch(res => {
		console.error(res.response.data.message)
		flash.error("Erreur lors de la modification")
	})
}

function updateUserTeam(userId: number, teamId: number) {
	axios
		.patch(route("api.admin.teams.users.toggle", {
			user: userId,
			team: teamId
		}))
		.then((res: AxiosResponseModel<UserInterface>) => {
			// update the button
			theUsers.value.forEach(user => {
				if (user.id === userId) {
					user.teams = res.data.teams
				}
			})
		})
		.catch((res: AxiosErrorMessage) => {
			console.error(res.response.data.message)
		})
}

</script>
<template>
	<main class="scolcours-container">
		<article-title
			title="utilisateurs"
		>
			<template #right>
				<sc-button
					type="add"
					xs
					@click="createUsersShow=true"
				>
					ajouter des utilisateurs
				</sc-button>
			</template>
		</article-title>

		<section>
			<!-- titre -->
			<div class="flex justify-between">
				<h2 class="text-xl">
					Utilisateurs
				</h2>

				<div class="flex flex-col gap-3 items-end">
					<FormSwitch
						v-model="deleteMode"
						label="mode suppression"
						name="deleteSwitch"
						sm
					/>
					<FormSwitch
						v-model="teamsMode"
						label="assignation des équipes"
						name="teamsSwitch"
						sm
					/>
				</div>
			</div>

			<!-- choix des team -->
			<div
				v-if="usersTeams.length>0"
				class="flex gap-3 flex-wrap mb-3"
			>
				<sc-button
					:active="selectedTeam===''"
					xs
					@click="selectedTeam=''"
				>
					Tous
				</sc-button>
				<sc-button
					:active="selectedTeam==='_'"
					xs
					@click="selectedTeam='_'"
				>
					~ vide ~
				</sc-button>
				<sc-button
					v-for="team of usersTeams"
					:key="team"
					:active="selectedTeam===team"
					xs
					@click="selectedTeam=team"
				>
					{{ team }}
				</sc-button>
			</div>
			<div v-else>
				aucune équipe
			</div>


			<!-- liste des utilisateurs -->
			<div class="flex flex-col gap-3">
				<div
					v-for="user of selectedUsers"
					:key="user.id"
					class="bg-content border px-5 py-4 flex justify-between"
				>
					<div class="user-wrapper-left flex justify-between w-full">
						<div class="flex gap-3 items-start">
							<sc-button
								xs
								type="edit"
								class="inline"
								icon
								outline
								no-label
								@click="editUser(user.id)"
							/>

							<div>
								<h2 class="text-lg">
									{{ user.fullname }}
								</h2>
								<div class="text-xs">
									{{ user.email }}
								</div>
							</div>
						</div>
						<div
							v-show="!teamsMode"
							class="flex flex-gap gap-3 items-start"
						>
							<sc-button
								v-for="team of user.teams"
								:key="`user-${user.id}-${team.id}`"
								xs
								@click="selectedTeam=team.name"
							>
								{{ team.name }}
							</sc-button>
						</div>
					</div>

					<div class="user-wrapper-right">
						<!-- suppression -->
						<sc-button
							v-if="deleteMode"
							type="delete"
							xs
							@click="destroyUser(user.id)"
						>
							Supprimer
						</sc-button>

						<!-- assignation des équipes -->
						<div
							v-if="teamsMode"
							class="flex gap-3"
						>
							<sc-button
								v-for="team of theTeams"
								:key="`team-${user.id}-${team.id}`"
								:active="!!(user.teams ?? []).find((search: UserTeamInterface)=>search.name===team.name)"
								xs
								@click="updateUserTeam(user.id, team.id)"
							>
								{{ team.name }}
							</sc-button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>

	<dialog-modal
		v-model="createUsersShow"
		title="importer des utilisateurs"
		class="w-200 h-[95vh]"
	>
		<div class="h-full p-3 flex flex-col space-y-3">
			<FormInput
				v-model="form.password"
				label="mot de passe"
				name="password"
			/>

			<div class="flex-1 flex gap-3 h-full">
				<FormTextarea
					v-model="usersEmails"
					fill
					class="flex-1"
					label="utilisateurs"
				/>
				<div class="w-75">
					<h2 class="text-lg pb-3">
						emails détectés
					</h2>
					<div
						v-for="email of usersEmailsList"
						:key="email"
						class="font-code text-sm"
					>
						{{ email }}
					</div>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="p-3 flex justify-center">
				<sc-button
					type="primary"
					@click="addUsers"
				>
					Ajouter {{ usersEmailsList.length }} utilisateur(s)
				</sc-button>
			</div>
		</template>
	</dialog-modal>
	<dialog-modal
		v-model="editUserShow"
		class="w-100 "
	>
		<template #header>
			<div class="px-5 py-3 flex justify-between">
				<h2 class="text-lg ">
					Édition de l'utilisateur
				</h2>
			</div>
		</template>

		<div class="px-5 pb-5">
			<FormInput
				v-model="editUserForm.firstname"
				label="prénom"
			/>
			<FormInput
				v-model="editUserForm.name"
				label="nom"
			/>
		</div>

		<template #footer>
			<div class="flex gap-3 justify-end px-5 py-2">
				<sc-button
					type="primary"
					xs
					@click="editUserStore"
				>
					enregistrer
				</sc-button>
				<sc-button
					type="cancel"
					xs
					@click="editUserShow=false"
				>
					annuler
				</sc-button>
			</div>
		</template>
	</dialog-modal>
</template>
