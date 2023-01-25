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

		<form-input
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
		<div class="flex justify-between">
			<h2 class="text-xl">
				Utilisateurs
			</h2>

			<form-switch
				v-model="deleteMode"
				label="mode suppression"
				name="deleteSwitch"
				sm
			/>
			<form-switch
				v-model="teamsMode"
				label="assignation des équipes"
				name="teamsSwitch"
				sm
			/>
		</div>
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
		<div class="bg-white">
			<div
				v-for="user of selectedUsers"
				:key="user.id"
				class="odd:bg-gray-50 px-5 py-4 flex justify-between"
			>
				<div class="user-wrapper-left flex justify-between w-full">
					<div>
						<h2 class="text-lg">
							{{ user.name }}
						</h2>
						<div class="text-xs">
							{{ user.email }}
						</div>
					</div>
					<div v-show="!teamsMode">
						{{ user.team }}
					</div>
				</div>

				<div class="user-wrapper-right">
					<button
						v-if="deleteMode"
						class="btn-delete btn-xs"
						@click="destroyUser(user.id)"
					>
						Supprimer
					</button>

					<div
						v-if="teamsMode"
						class="flex gap-3"
					>
						<button
							v-for="team of theTeams"
							:key="`team-${user.id}-${team.id}`"
							:class="user.team===team.name?'is-active':'bg-white'"
							class="btn btn-xs"
							@click="updateTeam(user.id, team.id)"
						>
							{{ team.name }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<div>
			<form-input
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
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import {computed, ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import {useForm} from "@inertiajs/inertia-vue3"
import {Inertia} from "@inertiajs/inertia"
import FormSwitch from "@/Components/Form/FormSwitch"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"

let props = defineProps({
		users: {type: Object},
		teams: {type: Array}
	}),
	theUsers = ref(props.users.data),
	theTeams = ref(props.teams)

let usersEmails = ref(""),
	usersEmailsList = computed(() => {
		const sep = usersEmails.value.includes(";") ? ";" : "\n"

		return usersEmails.value.split(sep).filter(x => x !== "").map(x => x.trim().toLowerCase())
	})


let addMode = ref(false),
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
		onSuccess: () => form.reset()
	})

}

let deleteMode = ref(false)

function destroyUser(id) {
	axios.post(route("admin.users.destroy", [id]), {_method: "delete"}).then((res) => {
		if (res.data) {
			// Reload the page.
			Inertia.reload({only: ["users"]})
		}
	})
}

const usersTeams = computed(() => {
		return [
			...new Set([...theUsers.value.filter(user => user.team).map(user => user.team)])
		]
	}),
	teamsMode = ref(false),
	selectedTeam = ref(""),
	selectedUsers = computed(() => {
		if (selectedTeam.value === "") {
			return theUsers.value
		} else if (selectedTeam.value === "_") {
			return theUsers.value.filter(user => !user.team)
		} else {
			return theUsers.value.filter(user => (user.team) === selectedTeam.value)
		}
	}),
	newTeam = ref(""),
	storeTeam = function () {
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
	updateTeam = function (userId, teamId) {
		axios.post(route("users.team.toggle", [userId, teamId]),
			{_method: "PATCH"})
			.then(res => {
				// update the button
				theUsers.value.forEach(user => {
					if (user.id === userId) {
						user.team = res.data.team
					}
				})
				console.log(res)
			})
			.catch(res => {
				console.error(res)
			})
	},
	destroyTeam = function (teamId) {
		axios.post(route("teams.destroy", [teamId]),
			{_method: "DELETE"}
		).then(res => {
			theTeams.value = theTeams.value.filter(x => x.name !== res.data)
		}).catch(res => {
			console.error(res.response.data.message)
		})
	}

</script>
