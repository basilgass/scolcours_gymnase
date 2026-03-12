<!--
Affichage de la liste des challenges pour un chapitre donné.
-->
<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {ChallengeMinInterface, ChapterShowInterface} from "@/types/modelInterfaces.ts"
import {useForm} from "@inertiajs/vue3"
import {ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

let props = defineProps<{
	chapter: ChapterShowInterface,
	challenges: ChallengeMinInterface[]
}>()

const editMode = useStoreEditMode()

let show = ref(false)
const form = useForm({
	title: "nouveau challenge"
})

function storeChallenge() {
	form.post(route("api.admin.chapters.challenges.store", [props.chapter.id]))
}
</script>

<template>
	<div>
		<h3 class="uppercase font-extralight mb-2">
			challenges
		</h3>

		<div
			v-if="challenges.length>0"
			class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8"
		>
			<sc-button
				v-for="challenge in challenges"
				:key="`challenge-${challenge.id}`"
				v-katex.auto="challenge.title"
				theme
				:href="route('themes.chapters.challenges.show', {
					theme: $page.props.theme.slug,
					chapter: chapter.slug,
					challenge: challenge.slug
				})
				"
				class="py-5"
			/>
		</div>

		<div
			v-show="editMode.enable"
			v-admin
			class="min-h-[100px] grid place-items-center"
		>
			<sc-button
				type="add"
				@click="show = true"
			>
				Nouveau challenge
			</sc-button>

			<dialog-modal
				v-model="show"
				class="max-w-[450px] h-auto bg-content"
			>
				<template #header>
					<div
						class="flex justify-between items-baseline border-b border-content px-5 py-3 mb-5"
					>
						<h1>
							<span class="text-xl md:text-2xl">créer un challenge</span>
						</h1>
					</div>
				</template>

				<template #footer>
					<div class="flex justify-end items-baseline border-t border-content px-5 py-3 mt-5">
						<sc-button
							type="add"
							@click="storeChallenge"
						>
							Créer un nouveau challenge
						</sc-button>
					</div>
				</template>
				<div class="px-5">
					<form-maker
						v-model="form.title"
						:focus="true"
						label="Nouveau challenge"
						name="newChallenge"
						@cancel="show = false"
						@enter="storeChallenge"
					/>
				</div>
			</dialog-modal>
		</div>
	</div>
</template>
