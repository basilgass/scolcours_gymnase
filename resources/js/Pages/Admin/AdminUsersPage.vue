<script lang="ts" setup>

import { computed, inject, PropType, ref } from "vue"
import { router, useForm } from "@inertiajs/vue3"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import type { TeamInterface, UserInterface } from "@/types/modelInterfaces"
import type { flashInterface } from "@/types"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
		users: { type: Object as PropType<UserInterface[]>, required: true },
		teams: { type: Object as PropType<TeamInterface[]>, required: true }
	}),
	theUsers = ref(props.users),
	theTeams = ref(props.teams)

const flash = inject<flashInterface>("flash")

const usersEmails = ref(""),
	usersEmailsList = computed(() => {
		const sep = usersEmails.value.includes(";") ? ";" : "\n"

		return usersEmails.value.split(sep).filter(x => x !== "").map(x => x.trim().toLowerCase())
	})


const addMode = ref(false),
	form = useForm({
		users: [],
		password: "GymnaseScolcours"
	})

function addUsers() {
	form.transform((data) => ({
		users: usersEmailsList.value,
		password: data.password
	})).post(route("admin.users.create"), {
		preserveScroll: true,
		onSuccess: () => {
			flash.success("Utilisateurs ajoutés")
			form.reset()
			usersEmails.value = ""

		}
	})

}

const deleteMode = ref(false)

function destroyUser(id) {
	axios.post(route("admin.users.destroy", [id]), { _method: "delete" }).then((res) => {
		if (res.data) {
			// Reload the page.
			router.reload({ only: ["users"] })
		}
	})
}

const usersTeams = computed(() => {

		return [
			...new Set([...theUsers.value
				.filter(user => user.teams)
				.map(user => user.teams.flatMap(team => team.name))
				.flat()
			])
		]
	}),
	teamsMode = ref(false),
	selectedTeam = ref(""),
	selectedUsers = computed(() => {
		if (selectedTeam.value === "") {
			return theUsers.value
		} else if (selectedTeam.value === "_") {
			return theUsers.value.filter(user => user.teams.length === 0)
		} else {
			return theUsers.value.filter(user => user.teams.find(team => team.name === selectedTeam.value))
		}
	}),
	newTeam = ref(""),
	storeTeam = function() {
		axios.post(route("teams.store"), {
				"name": newTeam.value
			}
		).then(res => {
			theTeams.value.push(res.data)
		})
			.catch(res =>
				console.error(res.response.data.message)
			)
	},
	updateTeam = function(userId: number, teamId: number) {
		axios.post(route("users.team.toggle", [userId, teamId]),
			{ _method: "PATCH" })
			.then(res => {
				// update the button
				theUsers.value.forEach(user => {
					if (user.id === userId) {
						user.teams = res.data.teams
					}
				})
			})
			.catch(res => {
				console.error(res)
			})
	},
	destroyTeam = function(teamId) {
		axios.post(route("teams.destroy", [teamId]),
			{ _method: "DELETE" }
		).then(res => {
			theTeams.value = theTeams.value.filter(x => x.name !== res.data)
		}).catch(res => {
			console.error(res.response.data.message)
		})
	}


const editUserShow = ref(false)
const editUserForm = ref({
	id: 0,
	firstname: "",
	name: ""
})

function editUser(id) {
	const user = theUsers.value.find(x => x.id === id)
	editUserForm.value.id = user.id
	editUserForm.value.name =user.name
	editUserForm.value.firstname =user.firstname
	editUserShow.value = true
}

function editUserStore(){
	axios.post(route("admin.users.update", [editUserForm.value.id]), {
		...editUserForm.value,
		_method: "PATCH"
	}).then(res => {
		editUserShow.value = false
		// update the user
		theUsers.value.forEach(user => {
			if(user.id === editUserForm.value.id){
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

</script>
<template>
	<div class="flex justify-between items-baseline">
		<h1 class="text-3xl pt-5">
			Gestion des utilisateurs
		</h1>
		<button
			class="btn btn-add btn-xs"
			@click="addMode=!addMode"
		>
			ajouter des utilisateurs
		</button>
	</div>

	<section
		v-show="addMode"
		class="my-10 bg-gray-100 rounded-xl border border-gray-400 px-3 py-5"
	>
		<h2 class="text-lg">
			Ajouter des utilisateurs
		</h2>

		<div class="grid grid-cols-2 gap-3">
			<textarea
				v-model="usersEmails"
				class="p-3"
				rows="10"
			/>
			<div>
				<div
					v-for="email of usersEmailsList"
					:key="email"
				>
					{{ email }}
				</div>
			</div>
		</div>

		<form-maker
			v-model="form.password"
			label="mot de passe"
			name="password"
		/>
		<button
			class="btn btn-primary"
			@click="addUsers"
		>
			Ajouter {{ usersEmailsList.length }} utilisateur(s)
		</button>
	</section>

	<section>
		<!-- titre -->
		<div class="flex justify-between">
			<h2 class="text-xl">
				Utilisateurs
			</h2>

			<form-maker
				v-model="deleteMode"
				label="mode suppression"
				name="deleteSwitch"
				sm
				type="switch"
			/>
			<form-maker
				v-model="teamsMode"
				label="assignation des équipes"
				name="teamsSwitch"
				sm
				type="switch"
			/>
		</div>

		<!-- choix des team -->
		<div
			v-if="usersTeams.length>0"
			class="flex gap-3 flex-wrap mb-3"
		>
			<button
				:class="selectedTeam===''?'is-active':'bg-white'"
				class="btn btn-xs"
				@click="selectedTeam=''"
			>
				Tous
			</button>
			<button
				:class="selectedTeam==='_'?'is-active':'bg-white'"
				class="btn btn-xs"
				@click="selectedTeam='_'"
			>
				~ vide ~
			</button>
			<button
				v-for="team of usersTeams"
				:key="team"
				:class="selectedTeam===team?'is-active':'bg-white'"
				class="btn btn-xs"
				@click="selectedTeam=team"
			>
				{{ team }}
			</button>
		</div>

		<!-- liste des utilisateurs -->
		<div class="bg-white">
			<div
				v-for="user of selectedUsers"
				:key="user.id"
				class="odd:bg-gray-50 px-5 py-4 flex justify-between"
			>
				<div class="user-wrapper-left flex justify-between w-full">
					<div>
						<h2 class="text-lg">
							{{ user.fullname }}
						</h2>
						<div class="text-xs">
							{{ user.email }}
						</div>
					</div>
					<div v-show="!teamsMode">
						{{ user.teams.map(team => team.name).join(",") }}
					</div>
				</div>

				<div class="user-wrapper-right">
					<!-- suppression -->
					<button
						v-if="deleteMode"
						class="btn btn-delete btn-xs ml-3"
						@click="destroyUser(user.id)"
					>
						Supprimer
					</button>

					<!-- assignation des équipes -->
					<div
						v-if="teamsMode"
						class="flex gap-3"
					>
						<button
							v-for="team of theTeams"
							:key="`team-${user.id}-${team.id}`"
							:class="user.teams.find(search=>search.name===team.name)?'is-active':'bg-white'"
							class="btn btn-xs"
							@click="updateTeam(user.id, team.id)"
						>
							{{ team.name }}
						</button>
					</div>

					<!-- édition du nom / prénom -->
					<div>
						<button
							class="btn btn-xs"
							@click="editUser(user.id)"
						>
							éditer
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- gestion des équipes -->
		<div class="mt-10 bg-white py-3 px-5 border">
			<h2 class="text-xl mb-5">
				gestion des équipes
			</h2>
			<form-maker
				v-model="newTeam"
				label="nouvelle équipe"
				name="newTeam"
			/>
			<button
				class="btn btn-xs btn-add"
				@click="storeTeam"
			>
				créer
			</button>

			<div>
				<h3>supprimer une équipe</h3>
				<confirm-button
					v-for="team of theTeams"
					:key="`destroy-${team.id}`"
					@confirm="destroyTeam(team.id)"
				>
					{{ team.name }}
				</confirm-button>
			</div>
		</div>
	</section>

	<dialog-modal v-model="editUserShow">
		<template
			#header
		>
			<div class="px-5 py-3 border-b flex justify-between">
				<h2 class="text-lg ">
					Édition de l'utilisateur
				</h2>

				<div class="flex gap-3">
					<button
						class="btn btn-primary btn-xs"
						@click="editUserStore"
					>
						enregistrer
					</button>
					<button
						class="btn btn-cancel btn-xs"
						@click="editUserShow=false"
					>
						annuler
					</button>
				</div>
			</div>
		</template>

		<div class="px-5 pb-5">
			<form-maker
				v-model="editUserForm.firstname"
				label="prénom"
			/>
			<form-maker
				v-model="editUserForm.name"
				label="nom"
			/>
		</div>
	</dialog-modal>
</template>
