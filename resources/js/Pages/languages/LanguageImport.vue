<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import LanguageAdminBook from "@/Components/Languages/admin/LanguageAdminBook.vue"
import LanguageAdminSelector from "@/Components/Languages/admin/LanguageAdminSelector.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { TranslationUnitInterface } from "@/types/modelInterfaces.ts"
import { useForm } from "@inertiajs/vue3"
import axios from "axios"
import { computed, ref, watch } from "vue"

// Concept
// 1. sélectionner une langue
// 2. sélectionner un livre ou en créer un
// 3. sélectionner un chapitre ou en créer un
// 4. importer les traductions.

defineOptions({ layout: LayoutMain })

const form = useForm({
	language: "",
	book: -1,
	title: ""
})

const traduction = ref("")
const swapFrForeign = ref(false)
const quizletMode = ref(true)
const traductions = computed(() => {
	if(quizletMode.value){
		const formatedTraduction = []

		const arr = traduction.value.split('\n')
			.filter(x=>x.trim() !== "")

		while(arr.length>1){
			const values = [arr.shift().trim(), arr.shift().trim()]

			console.log(arr.length)
			formatedTraduction.push(
				{
					fr: values[swapFrForeign.value ? 1 : 0],
					foreign: values[swapFrForeign.value ? 0 : 1]
				}
			)

		}
		return formatedTraduction
	}

	return traduction.value.split("\n")
		.filter(x => x.trim() !== "" && x.split("\t").length >= 2)
		.map(x => {

			const values = x
				.replaceAll("’", "'")
				.split("\t")
			return {
				fr: values[swapFrForeign.value ? 1 : 0],
				foreign: values[swapFrForeign.value ? 0 : 1]
			}
		})
})


function resetUnits() {
	existingUnits.value = []
}

function getUnits(bookId: number) {
	axios.get(route("translations.units", bookId))
		.then(res => {
			existingUnits.value = res.data
			return
		}).catch(res => {
		console.log(res.response.data.message)
	})
}

const existingUnits = ref<TranslationUnitInterface[]>([])
watch(() => form.language, () => {
	form.book = -1
	resetUnits()
})
watch(() => form.book, (prev: number, next: number) => {
	if (prev !== next) {
		if (form.book === -1) {
			resetUnits()
		} else {
			getUnits(form.book)
		}
	}
})


function importerLesTraductions() {
	form
		.transform((data) => {
			return {
				...data,
				translations: traductions.value
			}
		})
		.post(route("translations.create"))
}

</script>

<template>
	<main class="scolcours-container">
		<h1 class="py-10 text-xl">
			Importer des vocabulaires
		</h1>

		<div class="flex flex-col gap-4 my-5">
			<language-admin-selector
				v-model="form.language"
				:languages="['italiano', 'english', 'deutsch', 'espanol']"
			/>

			<language-admin-book
				v-show="form.language"
				v-model="form.book"
				:language="form.language"
			/>

			<ul class="list list-inside list-disc">
				<!-- existing units -->
				<li
					v-for="unit in existingUnits"
					:key="unit.id"
				>
					{{ unit.title }}
				</li>
			</ul>
		</div>


		<div v-show="form.book!==-1">
			<form-maker
				v-model="form.title"
				label="titre"
				name="titre"
			/>

			<form-maker
				v-model="traduction"
				catch-tab
				label="traduction"
				message="français \t langue étrangère \t description \t exemples"
				name="traduction"
				type="textarea"
			/>

			<div class="flex gap-3">
				<button
					class="btn btn-primary"
					@click="importerLesTraductions"
				>
					Importer
				</button>

				<form-maker
					v-model="swapFrForeign"
					:label="`inverser français et ${form.language}`"
					name="swapLanguage"
					type="switch"
				/>
			</div>

			<div class="bg-white">
				<table class="w-full">
					<thead>
						<tr class="text-left">
							<th class="p-2">
								français
							</th>
							<th class="p-2">
								langue étrangère
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) of traductions"
							:key="index"
							class="odd:bg-amber-100"
						>
							<td class="p-2">
								{{ item.fr }}
							</td>
							<td class="p-2">
								{{ item.foreign }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</template>
