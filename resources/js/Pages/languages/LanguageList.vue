<template>
	<article>
		<ArticleTitle :title="props.language"/>
		<Link
				:href="`/${props.language}`"
				class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left"/> retour
		</Link>

		<LanguageUnitsSelector
				:units="props.units"
				@update="unitsSelection=$event"
		/>

		<div
				class="mt-10 flex items-end justify-between"
		>

			<button
					class="btn-primary"
					@click="generateWords"
			>
				Afficher la liste des unité(s)
			</button>

			<form-switch
					v-model="fr_foreign"
					:label="`français - ${props.language}`"
					name="ordreLangues"
			/>

			<form-switch
					v-model="random"
					label="ordre aléatoire"
					name="randomwords"
					@click="generateWords"
			/>
		</div>


		<div class="mt-5 flex items-end w-full gap-3">
			<div class="flex-1 ">
				<form-input
						v-model="filterValue"
						label="filtrer"
						name="filtrer"
				/>
			</div>

			<button :class="filteredWords.length===0?'bg-gray-300':'btn-primary'"
			        :disabled="filteredWords.length===0"
			        class="btn"
			        @click="exportList"
			>exporter
			</button>
		</div>
		<div>Il y a {{ availableWords.length }} mots</div>

		<div
				v-if="filteredWords.length>0"
				class="flex flex-col gap-2 mt-10"
		>
			<div
					v-for="(item, index) in filteredWords"
					:key="index"
					:class="editMode.enabled.value?'hover:bg-amber-100 cursor-pointer':''"
					class="bg-white border rounded grid grid-cols-2 p-3"
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
					<button
							class="btn btn-primary"
							@click="updateTranslation"
					>
						enregistrer
					</button>
				</div>
			</template>
			<div class="px-3">
				<form-input
						v-model="editWord.fr"
						label="français"
						name="edit-fr"
				>
					<form-input
							v-model="editWord.foreign"
							label="translation"
							name="edit-foreign"
					/>
				</form-input>
			</div>
		</dialog-modal>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {computed, inject, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import LanguageUnitsSelector from "@/Components/Languages/LanguageUnitsSelector.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {usePage} from "@inertiajs/vue3"
import DialogModal from "@/Components/Ui/DialogModal.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: () => []}
})

const flash = inject("flash"),
	editMode = inject("editMode")

let availableWords = ref([]),
	random = ref(false),
	fr_foreign = ref(true),
	unitsSelection = ref([]),
	filterValue = ref("")

let generateWords = function () {
		// All words available
		let words = []
		for (let values of unitsSelection.value.map(x => x.words)) {
			words = words.concat(values)
		}

		// availableWords.value = PiMath.Random.array(words, numberOfCards.value)
		if (random.value) {
			availableWords.value = PiMath.Random.shuffle(words)
		} else {
			availableWords.value = words
		}
	},
	filteredWords = computed(() => {
		if (filterValue.value === "") {
			return availableWords.value
		}

		return availableWords.value.filter(word => {
			return word.fr.toLowerCase().includes(filterValue.value) ||
				word.foreign.toLowerCase().includes(filterValue.value)
		})
	})

let showEditForm = ref(false),
	editWord = ref({}),
	editTranslation = function (word) {
		if (editMode.enabled.value && usePage().props.auth.can.admin) {
			editWord.value = word
			showEditForm.value = true
		}

	},
	updateTranslation = function () {
		axios.post(route("translation.words.update", [editWord.value.id]), {
			...editWord.value,
			_method: "PATCH"
		}).then(res => {
			showEditForm.value = false
		})
	},
	exportList = function(){
		// TODO: export as excel list.
	}

</script>
