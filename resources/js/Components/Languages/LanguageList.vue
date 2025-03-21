<script lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import { LanguageDataInterface } from "@/Pages/languages/LanguageShow.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import type { TranslationWord } from "@/types/modelInterfaces"
import { usePage } from "@inertiajs/vue3"
import axios from "axios"
import { Random } from "pimath"
import {computed, inject, ref} from "vue"
import {useLanguage} from "@/Components/Languages/useLanguage.ts"
import ScButton from "@/Components/Ui/scButton.vue"

const languageData = inject<LanguageDataInterface>('LanguageData')
const {getListOfWordsFromUnits} = useLanguage(languageData)

const words = computed(()=>{
	if(languageData.units) {
		return getListOfWordsFromUnits(random.value)
	}

	return []
})
// Define the editMode.
const  editMode  = useStoreEditMode()

// game specific functions.

// toggle between random list and as inserted list.
const random = ref(false)
// swap fr <->foreign in the list
const fr_foreign = ref(true)
// filter search - default is  empty string = all words
const filterValue = ref("")
// display the list using a filter (searching in fr and foreign)
const filteredWords = computed<TranslationWord[]>(() => {
	if (filterValue.value === "") return words.value

	return words.value.filter(word => {
		return word.fr.toLowerCase().includes(filterValue.value) ||
			word.foreign.toLowerCase().includes(filterValue.value)
	})
})

/**
 * Edition part - should be moved elsewhere ?
 */
// determine if the edit form is hidden or visible
const showEditForm = ref(false)
// editWord contains the word (id/fr/foreign) to be edited
const editWord = ref<{ id: number, foreign: string, fr: string }>({
	id: null, foreign: null, fr: null
})
// before editing, store the word to edit.
const editTranslation = function(word) {
	if (editMode.enable && usePage().props.auth.can.admin) {
		editWord.value = word
		showEditForm.value = true
	}

}
// update the translation to the DB.
const updateTranslation = function() {
	axios.post(route("translations.words.update", [editWord.value.id]), {
		...editWord.value,
		_method: "PATCH"
	}).then(() => {
		showEditForm.value = false
	})
}

/**
 * Export list as excel
 * TODO: export as excel list.
 */
const exportList = function() {
	// TODO: export as excel list.
	alert("Pour l'instant, l'export n'est pas encore opérationnel !")
}

</script>
<template>
	<article>
		<div
			class="mt-10 flex items-end justify-between"
		>
			<form-maker
				v-model="fr_foreign"
				:label="`français,${languageData.language.name}`"
				type="switch"
			/>

			<form-maker
				v-model="random"
				label="ordre aléatoire"
				name="randomwords"
				type="switch"
			/>
		</div>

		<div class="mt-5 flex items-end w-full gap-3">
			<div class="flex-1 ">
				<form-maker
					v-model="filterValue"
					label="filtrer"
					name="filtrer"
				/>
			</div>

			<sc-button
				:active="filteredWords.length>0"
				:disabled="filteredWords.length===0"
				class="disabled:opacity-50"
				@click="exportList"
			>
				exporter
			</sc-button>
		</div>
		<div>Il y a {{ words.length }} mots</div>

		<div
			v-if="filteredWords.length>0"
			class="flex flex-col gap-2 mt-10"
		>
			<div
				v-for="(item, index) in filteredWords"
				:key="index"
				:class="editMode.enable?'hover:bg-amber-100 cursor-pointer':''"
				class="bg-white border rounded-sm grid grid-cols-2 p-3"
				@click="editTranslation(item)"
			>
				<div>
					{{ fr_foreign ? item.fr : item.foreign }}
				</div>
				<div>
					{{ fr_foreign ? item.foreign : item.fr }}
				</div>
			</div>
		</div>

		<dialog-modal v-model="showEditForm">
			<template #header>
				<div class="text-lg px-3 py-5">
					éditer une translation (id: {{ editWord.id }})
				</div>
			</template>
			<template #footer>
				<div class="text-right px-3 py-5">
					<sc-button
						type="primary"
						@click="updateTranslation"
					>
						enregistrer
					</sc-button>
				</div>
			</template>
			<div class="px-3">
				<form-maker
					v-model="editWord.fr"
					label="français"
					name="edit-fr"
				/>
				<form-maker
					v-model="editWord.foreign"
					label="translation"
					name="edit-foreign"
				/>
			</div>
		</dialog-modal>
	</article>
</template>
