<script setup lang="ts">

import FormInput from "@/Components/Form/FormInput.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {TeamInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {ref} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import Card from "@/Components/Ui/Card.vue"

const props = defineProps<{ teams: TeamInterface[] }>()
const emits = defineEmits<{
	storeTeam: [team: TeamInterface],
	destroyTeam: [teamId: number]
}>()

const theTeams = ref<TeamInterface[]>(props.teams)

const newTeam = ref("")

function storeTeam() {
	axios.post(route("api.admin.teams.store"), {
			"name": newTeam.value
		}
	).then((res: AxiosResponseModel<TeamInterface>) => {
		emits('storeTeam', res.data)
	})
		.catch((res: AxiosErrorMessage) =>
			console.error(res.response.data.message)
		)
}


function destroyTeam(teamId: number) {
	axios
		.delete(route("api.admin.teams.destroy", {
				teamId
			})
		)
		.then((res: AxiosResponseModel<number>) => {
			theTeams.value = theTeams.value.filter(x => +x.id !== +res.data)
			emits('destroyTeam', res.data)
		})
		.catch(res => {
			console.error(res.response.data.message)
		})
}
</script>

<template>
	<Card>
		<template #header>
			<h2 class="text-xl">
				gestion des équipes
			</h2>
		</template>

		<div>
			<FormInput
				v-model="newTeam"
				label="nouvelle équipe"
				name="newTeam"
				btn
				@button="storeTeam"
			>
				<template #button>
					créer
				</template>
			</FormInput>
		</div>
		<template #footer>
			<div>
				<h3>supprimer une équipe</h3>
				<div class="flex gap-3">
					<confirm-button
						v-for="team of teams"
						:key="`destroy-${team.id}`"
						@confirm="destroyTeam(team.id)"
						xs
					>
						{{ team.name }}
					</confirm-button>
				</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
