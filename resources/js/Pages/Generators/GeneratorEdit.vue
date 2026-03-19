<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeInterface, GeneratorInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {ref} from "vue"
import GeneratorsExamples from "@/Components/Elements/GeneratorsExamples.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

defineOptions({layout: LayoutMain})

const flash = useStoreFlashMessage()

const props = defineProps<{
	generator: GeneratorInterface,
	challenges: ChallengeInterface[]
}>()

const theGenerator = ref(props.generator)

function saveGenerator() {
	axios.post(route("api.admin.generators.update", [props.generator.id]), {
		...theGenerator.value,
		_method: "patch"
	}).then(() => {
		flash.success("Générateur enregistré")
	}).catch((err) => {
		console.log(err)
		flash.error("Erreur lors de l'enregistrement")
	})
}

function duplicateGenerator() {
// TODO: Duplicate a generator.
}

function deleteGenerator() {
	axios.post(route("api.admin.generators.destroy", [props.generator.id]), {
		_method: "delete"
	}).then(() => {
		flash.success("Générateur supprimé")
		router.visit(route("admin.generators.index"))
	}).catch((err) => {
		console.log(err)
		flash.error("Erreur lors de la suppression")
	})
}

function historyBack() {
	window.history.back()
}

</script>

<template>
	<section class="scolcours-container my-5">
		<header class="flex justify-between items-baseline mb-6">
			<div>
				<h1>
					<span class="text-xl md:text-2xl">
						édition d'un générateur
					</span>
					<span class="text-xs font-code ml-5">
						(id: {{ props.generator.id }})
					</span>
				</h1>
			</div>

			<div class="flex gap-3 justify-end">
				<sc-button
					type="cancel"
					xs
					@click="historyBack"
				>
					retour
				</sc-button>
				<sc-button
					type="save"
					xs
					@click="saveGenerator"
				>
					enregistrer
				</sc-button>
				<sc-button
					disabled
					type="add"
					xs
					@click="duplicateGenerator"
				>
					dupliquer
				</sc-button>
				<confirm-button
					xs
					@confirm="deleteGenerator"
				>
					supprimer
				</confirm-button>
			</div>
		</header>

		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<form-maker
					v-model="theGenerator.title"
					inline-label
					label="titre"
					label-class="w-[110px]"
					name="generatorTitle"
				/>
				<form-maker
					v-model="theGenerator.slug"
					inline-label
					label="slug"
					label-class="w-[110px]"
					name="generatorTitle"
					sm
				/>
				<form-maker
					v-model="theGenerator.body"
					:rows="5"
					inline-label
					label="description"
					label-class="w-[110px]"
					language="latex"
					name="generatorBody"
					type="codearea"
				/>

				<markdown-it
					:text="theGenerator.body"
					class="bg-content ml-[110px]"
				/>
			</div>

			<div>
				<form-maker
					v-model="theGenerator.template"
					label="template"
					type="codearea"
				/>

				<form-maker
					v-model="theGenerator.keyboard"
					label="clavier"
					type="keyboard"
				/>
			</div>
		</div>


		<div class="flex gap-5 mt-5">
			<form-maker
				v-model="theGenerator.code"
				:rows="20"
				auto-size
				class="flex-1"
				label="générateur de questions"
				language="javascript"
				resizable
				type="codearea"
			/>

			<generators-examples
				:generator="generator"
				:questions-number="5"
				class="min-w-[250px]"
				generate-on-mounted
			/>
		</div>

		<div class="my-4 bg-content">
			<h3 class="font-semibold border-content border-b p-3">
				generatorable
			</h3>
			<ul class="list p-3">
				<li
					v-for="challenge in challenges"
					:key="`challenge-link-${challenge.id}`"
					class="flex justify-between gap-3"
				>
					<div>{{ challenge.title }}</div>
					<div class="flex gap-3">
						<InertiaLink
							:href="route('challenges.show', { challenge: challenge.slug })"
						>
							<i class="bi bi-eye" />
						</InertiaLink>
						<InertiaLink
							:href="route('admin.challenges.edit', [challenge.id])"
						>
							<i class="bi bi-pencil" />
						</InertiaLink>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>
