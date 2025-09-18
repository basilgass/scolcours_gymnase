<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import {useQuestionAdmin} from "@/Components/Questions/useQuestionAdmin.ts"

const editMode = useStoreEditMode()

const props = defineProps<{
	container: {
		id: number,
		type: 'Post' | 'Quizz',// TODO: move this to an interface.
		questionsGrid?: string
	},
	components: InstanceType<typeof QuestionShow>[]
}>()


const questions = defineModel<Partial<QuestionInterface>[]>('questions')
const grid = defineModel<string>('grid')

const questionsAdmin = useQuestionAdmin(
	props.container,
	questions,
	props.components
)

</script>
<template>
	<div
		v-admin="editMode.enable"
		class="admin-content py-2 px-3 flex gap-6"
	>
		<sc-button
			type="add"
			xs
			@click="questionsAdmin.add"
		>
			<i class="bi bi-plus-lg" />
		</sc-button>
		<div class="flex-1 flex gap-2">
			<form-maker
				v-model="grid"
				class="flex-1"
				inline-label
				label="grille"
				sm
				@enter="questionsAdmin.updateGrid(grid)"
			/>
		</div>

		<div class="flex gap-2 items-center">
			<div class="text-sm">
				apparitions
			</div>
			<sc-button
				xs
				outline
				type="admin"
				@click="questionsAdmin.displayIf.auto"
			>
				<i class="bi bi-bar-chart" />
			</sc-button>
			<sc-button
				xs
				outline
				type="admin"
				@click="questionsAdmin.displayIf.remove"
			>
				<i class="bi bi-trash" />
			</sc-button>
		</div>


		<div class="flex gap-2 items-center">
			<div class="text-sm">
				réponses
			</div>
			<sc-button
				xs
				outline
				type="admin"
				@click="questionsAdmin.answers.show"
			>
				<i
					v-if="questionsAdmin.answers.isShown"
					class="bi bi-eye"
				/>
				<i
					v-else
					class="bi bi-eye-slash"
				/>
			</sc-button>
			<sc-button
				xs
				outline
				type="admin"
				@click="questionsAdmin.answers.reset"
			>
				<i class="bi bi-trash" />
			</sc-button>
		</div>
	</div>
</template>
