<template>
	<article>
		<ArticleTitle :title="props.language" />
		<Link
			:href="`/${props.language}`"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" />  retour
		</Link>

		<div
			class="mt-10 flex items-end justify-between"
		>
			<LanguageUnitsSelector
				:units="props.units"
				@update="unitsSelection=$event"
			/>

			<button
				class="btn-primary"
				@click="generateWords"
			>
				Afficher la liste des unité(s)
			</button>

			<form-switch
				v-model="fr_foreign"
				name="ordreLangues"
				:label="`français - ${props.language}`"
			/>

			<form-switch
				v-model="random"
				name="randomwords"
				label="ordre aléatoire"
				@click="generateWords"
			/>
		</div>

		<div>Il y a {{ availableWords.length }} mots</div>

		<div>
			<form-input
				v-model="filterValue"
				name="filtrer"
				label="filtrer"
			/>
		</div>
		<div
			v-if="filteredWords.length>0"
			class="flex flex-col gap-2 mt-10"
		>
			<div
				v-for="(item, index) in filteredWords"
				:key="index"
				class="bg-white border rounded grid grid-cols-2 p-3"
				:class="editMode.enabled.value?'hover:bg-amber-100 cursor-pointer':''"
				@click="editTranslation(item)"
			>
				<div>
					{{ fr_foreign?item.fr:item.foreign }}
				</div>
				<div>
					{{ fr_foreign?item.foreign:item.fr }}
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
					name="edit-fr"
					label="français"
				>
					<form-input
						v-model="editWord.foreign"
						name="edit-foreign"
						label="translation"
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
import LanguageUnitsSelector from "@/Pages/languages/LanguageUnitsSelector.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {usePage} from "@inertiajs/inertia-vue3"
import DialogModal from "@/Components/Ui/DialogModal.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: ()=>[]}
})

const flash = inject("flash"),
	editMode = inject("editMode")

let availableWords = ref([]),
	random = ref(false),
	fr_foreign = ref(true),
	unitsSelection = ref([]),
	filterValue = ref("")

let generateWords = function() {
		// All words available
		let words = []
		for(let values of unitsSelection.value.map(x=>x.words)){
			words = words.concat(values)
		}

		// availableWords.value = PiMath.Random.array(words, numberOfCards.value)
		if(random.value) {
			availableWords.value = PiMath.Random.shuffle(words)
		}else{
			availableWords.value = words
		}
	},
	filteredWords = computed(()=>{
		if(filterValue.value===""){return availableWords.value}

		return availableWords.value.filter(word=>{
			return word.fr.toLowerCase().includes(filterValue.value) ||
				word.foreign.toLowerCase().includes(filterValue.value)
		})
	})

let showEditForm = ref(false),
	editWord = ref({}),
	editTranslation = function(word) {
		if(editMode.enabled.value && usePage().props.value.auth.can.admin){
			editWord.value = word
			showEditForm.value = true
		}
	// if(usePage().props.auth.can.admin) {
	// 	console.log(word)
	// }
	},
	updateTranslation = function(){
		axios.post(route("translation.words.update", [editWord.value.id]), {
			...editWord.value,
			_method: "PATCH"
		}).then(res=>{
			showEditForm.value = false
		})
	}

</script>
