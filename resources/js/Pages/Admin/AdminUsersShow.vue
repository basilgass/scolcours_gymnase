<script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup lang="ts">

import { computed, inject, PropType, ref } from "vue"
import {useForm} from "@inertiajs/vue3"
import {router} from "@inertiajs/vue3"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import { TeamInterface, UserInterface } from "@/types/modelInterfaces"
import { flashInterface } from "@/types"

let props = defineProps({
		users: {type: Object as PropType<UserInterface[]>, required: true},
		teams: {type: Object as PropType<TeamInterface[]>, required: true}
	}),
	theUsers = ref(props.users),
	theTeams = ref(props.teams)

const flash = inject<flashInterface>("flash")

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
		onSuccess: () => {
			flash.success("Utilisateurs ajoutés")
			form.reset()
			usersEmails.value = ""

		}
	})

}

let deleteMode = ref(false)

function destroyUser(id) {
	axios.post(route("admin.users.destroy", [id]), {_method: "delete"}).then((res) => {
		if (res.data) {
			// Reload the page.
			router.reload({only: ["users"]})
		}
	})
}

const usersTeams = computed(() => {
		console.log(theUsers.value
			.filter(user => user.teams)
			.map(user => user.teams.flatMap(team => team.name))
			.flat()
		)

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
			return theUsers.value.filter(user => user.teams.length===0)
		} else {
			return theUsers.value.filter(user => user.teams.find(team => team.name === selectedTeam.value))
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
	updateTeam = function (userId:number, teamId:number) {
		axios.post(route("users.team.toggle", [userId, teamId]),
			{_method: "PATCH"})
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
		<div class="flex justify-between">
			<h2 class="text-xl">
				Utilisateurs
			</h2>

			<form-maker
				type="switch"
				v-model="deleteMode"
				label="mode suppression"
				name="deleteSwitch"
				sm
			/>
			<form-maker
				type="switch"
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
					<button
						v-if="deleteMode"
						class="btn-delete btn-xs ml-3"
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
							:class="user.teams.find(search=>search.name===team.name)?'is-active':'bg-white'"
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
</template>
