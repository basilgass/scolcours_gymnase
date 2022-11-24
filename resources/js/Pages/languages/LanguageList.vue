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
		<div
			v-if="availableWords.length>0"
			class="flex flex-col gap-2 mt-10"
		>
			<div
				v-for="(item, index) in availableWords"
				:key="index"
				class="bg-white border rounded grid grid-cols-2 p-3"
			>
				<div>
					{{ fr_foreign?item.fr:item.foreign }}
				</div>
				<div>
					{{ fr_foreign?item.foreign:item.fr }}
				</div>
			</div>
		</div>
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
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import {vocabulary} from "@/Pages/languages/English/englishUnits"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import LanguageUnitsSelector from "@/Pages/languages/LanguageUnitsSelector.vue"

let props = defineProps({
	code: {type: String, required: true},
	language: {type: String, required: true},
	units: {type: Array, default: ()=>[]}
})

let availableWords = ref([]),
	random = ref(false),
	fr_foreign = ref(true),
	unitsSelection = ref([])

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
}

</script>
