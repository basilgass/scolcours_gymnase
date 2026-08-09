<script setup lang="ts">

import FormInput from "@/Components/Form/FormInput.vue"
import {TeamInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {nextTick, ref, useTemplateRef} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import Card from "@/Components/Ui/Card.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import DialogModal
	from "../../../../../.claude/worktrees/f0-frontend-outillage/resources/js/Components/Ui/DialogModal.vue"
import {router} from "@inertiajs/vue3"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

const props = defineProps<{ teams: TeamInterface[] }>()
const emits = defineEmits<{
	storeTeam: [team: TeamInterface],
	destroyTeam: [teamId: number]
}>()

const theTeams = ref<TeamInterface[]>(props.teams)

const newTeam = ref<string>("")
const input = useTemplateRef<InstanceType<typeof FormInput>>('input')
const createTeamModal = ref<boolean>(false)

function onShowModal() {
	createTeamModal.value = true
	nextTick(() => {
		input.value?.focus()
	})
}

function storeTeam() {
	axios.post(route("api.admin.teams.store"), {
			"name": newTeam.value
		}
	).then((res: AxiosResponseModel<TeamInterface>) => {
		emits('storeTeam', res.data)
		router.visit(route('admin.teams.show', {team: res.data.name}))
	})
		.catch((res: AxiosErrorMessage) => {
			flash.error(`L'équipe n'a pas pu être créée : <br/>${res.response.data.message}`)
			console.error(res.response.data.message)
		})
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
	<div v-admin="editMode.enable">
		<sc-button
			type="add"
			@click="onShowModal"
		>
			<i class="bi bi-plus-circle mr-3" />Créer une équipe
		</sc-button>

		<dialog-modal
			v-model="createTeamModal"
			class="max-w-md h-auto"
		>
			<Card>
				<template #header>
					<h2 class="text-xl">
						gestion des équipes
					</h2>
				</template>

				<div>
					<FormInput
						ref="input"
						v-model="newTeam"
						s
						label="nouvelle équipe"
						name="newTeam"
						btn
						@button="storeTeam"
						@enter="storeTeam"
					>
						<template #button>
							créer
						</template>
					</FormInput>
				</div>
				<!--		<template #footer>-->
				<!--			<div>-->
				<!--				<h3>supprimer une équipe</h3>-->
				<!--				<div class="flex gap-3">-->
				<!--					<confirm-button-->
				<!--						v-for="team of teams"-->
				<!--						:key="`destroy-${team.id}`"-->
				<!--						@confirm="destroyTeam(team.id)"-->
				<!--						xs-->
				<!--					>-->
				<!--						{{ team.name }}-->
				<!--					</confirm-button>-->
				<!--				</div>-->
				<!--			</div>-->
				<!--		</template>-->
			</Card>
		</dialog-modal>
	</div>
</template>

<style scoped>

</style>
