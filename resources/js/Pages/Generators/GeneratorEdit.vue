<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { useGenerator } from "@/Composables/useGenerator"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import { ChallengeInterface, GeneratorInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import PiMath from "pimath"
import { computed, inject, ref } from "vue"
import GeneratorsExamples from "@/Components/Elements/GeneratorsExamples.vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")

const props = defineProps<{
	generator: GeneratorInterface,
	challenges: ChallengeInterface[]
}>()

const theGenerator = ref(props.generator)

function saveGenerator() {
	axios.post(route("generators.update", [props.generator.id]), {
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
	axios.post(route("generators.destroy", [props.generator.id]), {
		_method: "delete"
	}).then(() => {
		flash.success("Générateur supprimé")
		router.visit(route("generators.index"))
	}).catch((err) => {
		console.log(err)
		flash.error("Erreur lors de la suppression")
	})
}

function historyBack(){
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

			<div>
				<div class="flex gap-3 justify-end">
					<button
						class="btn btn-primary btn-xs"
						@click="historyBack"
					>
						retour
					</button>
					<button
						class="btn btn-primary btn-xs"
						@click="saveGenerator"
					>
						enregistrer
					</button>
					<button
						class="btn btn-primary btn-xs"
						@click="duplicateGenerator"
					>
						dupliquer
					</button>
					<confirm-button
						class="btn btn-delete btn-xs"
						@confirm="deleteGenerator"
					>
						supprimer
					</confirm-button>
				</div>
				<ul class="list my-4">
					<li
						v-for="challenge in challenges"
						:key="`challenge-link-${challenge.id}`"
						class="flex justify-between gap-3"
					>
						{{ challenge.title }}
						<div class="flex gap-3">
							<InertiaLink
								:href="route('challenges.show', [challenge.slug])"
							>
								<i class="bi bi-eye" />
							</InertiaLink>
							<InertiaLink
								:href="route('challenges.edit', [challenge.id])"
							>
								<i class="bi bi-pencil" />
							</InertiaLink>
						</div>
					</li>
				</ul>
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
					name="generatorBody"
					type="textarea"
				/>
			</div>

			<div>
				<form-maker
					v-model=" theGenerator.template"
					inline-label
					label="template"
					label-class="w-[110px]"
					type="code"
				/>

				<form-maker
					v-model=" theGenerator.keyboard"
					inline-label
					label="clavier"
					label-class="w-[110px]"
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
				type="code"
			/>

			<generators-examples
				class="min-w-[250px]"
				generate-on-mounted
				:questions-number="5"
				:generator="generator"
			/>
		</div>
	</section>
</template>
