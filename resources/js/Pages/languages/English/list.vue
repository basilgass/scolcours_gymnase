<template>
	<article>
		<ArticleTitle title="English Unit" />
		<Link
			href="/english"
			class="hover:pl-2 transition-all duration-300"
		>
			<i class="bi bi-arrow-bar-left" />  retour
		</Link>

		<div
			class="mt-10 flex items-end justify-between"
		>
			<button
				class="btn-primary"
				@click="generateWords"
			>
				Afficher la liste des unité(s) {{ units }}
			</button>

			<form-input
				v-model="unitsSelection"
				label="sélection des unités"
				name="selectionunit"
			/>


			<form-switch
				v-model="random"
				name="randomwords"
				label="ordre aléatoire"
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
					{{ item[0] }}
				</div>
				<div>
					{{ item[1] }}
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

let availableWords = ref([]),
	random = ref(false),
	unitsSelection = ref("1"),
	units = computed(() => {
		return unitsSelection.value.split(",").filter(x=>!isNaN(x)).map(x => +x)
	})

let generateWords = function() {
	// All words available
	let words = []
	for (let unit in vocabulary) {
		if (units.value.includes(+unit)) {
			words = words.concat(vocabulary[unit].map(item=>[item.en, item.fr]))
		}
	}

	// availableWords.value = PiMath.Random.array(words, numberOfCards.value)
	if(random.value) {
		availableWords.value = PiMath.Random.shuffle(words)
	}else{
		availableWords.value = words
	}
}

</script>
