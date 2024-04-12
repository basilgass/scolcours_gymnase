<script lang="ts" setup>

import axios from "axios"
import type { TranslationUnitInterfaceExtended } from "@/types/modelInterfaces"
import { computed } from "vue"

const units = defineModel<TranslationUnitInterfaceExtended[]>()

const updateUnits = function(item) {
	// Change the state
	item.selected = !item.selected

	// Load the missing words
	if (item.words.length===0) {
		axios.get(route("translations.words", [item.id])).then(res => {
			item.words = res.data
			console.log(units.value)
		})
	}
}

const numberOfWords = computed(()=>{
	// sum for all units selected, get the number of words
	return units.value.reduce((acc, item) => {
		return item.selected ? acc + item.words.length : acc
	}, 0)
})

</script>
<template>
	<div class="border-y border-gray-400 pt-3 pb-5">
		<div class="flex justify-between font-extralight ">
			<h2 class="text-lg mb-2 uppercase">
				sélection des unités
			</h2>
			<div v-show="numberOfWords>0">
				{{ numberOfWords }} mots
			</div>
		</div>

		<div class="flex flex-wrap gap-3">
			<button
				v-for="(item, key) of units"
				:key="key"
				:class="item.selected?'btn-success':'bg-white'"
				class="btn !px-10"
				@click="updateUnits(item)"
			>
				{{ item.unit }}
			</button>
		</div>
	</div>
</template>
