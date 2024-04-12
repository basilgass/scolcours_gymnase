<!--
Affichage de la liste des challenges pour un chapitre donné.
-->
<script setup lang="ts">
import DialogModal from "@/Components/Ui/DialogModal.vue"
import { inject, Ref, ref } from "vue"
import { useForm } from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"

let props = defineProps({
	chapter: { type: Object, required: true }
})

const editMode = inject<Ref<boolean>>("editMode")

let show = ref(false),
	form = useForm({
		title: "nouveau challenge"
	}),
	storeChallenge = function() {
		form.post(route("chapters.challenges.store", [props.chapter.id]))
	}
</script>

<template>
	<div
		v-if="chapter.challenges"
	>
		<h3 class="uppercase font-extralight mb-2">
			challenges
		</h3>

		<div
			class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 lg:gap-3"
		>
			<Link
				v-for="challenge in chapter.challenges"
				:key="`challenge-${challenge.id}`"
				v-katex.auto="challenge.title"
				:class="`btn-scolcours-${$page.props.theme.slug}`"
				:href="
					route('chapters.challenge', [
						$page.props.theme.slug,
						chapter.slug,
						challenge.slug,
					])
				"
				as="button"
				class="min-h-[80px] w-full h-full"
				type="button"
			/>

			<div
				v-show="editMode"
				v-admin
				class="min-h-[100px] grid place-items-center"
			>
				<button
					class="btn-new"
					@click="show = true"
				>
					Nouveau challenge
				</button>
				<dialog-modal
					v-model="show"
					class="max-w-[30em]"
				>
					<template #header>
						<div
							class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5"
						>
							<h1>
								<span class="text-xl md:text-2xl">créer un challenge</span>
							</h1>
						</div>
					</template>

					<template #footer>
						<div
							class="bg-white flex justify-end items-baseline border-t border-gray-200 px-5 py-3 mt-5"
						>
							<button
								class="btn btn-primary"
								@click="storeChallenge"
							>
								Créer un nouveau challenge 2
							</button>
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
	</div>
</template>
