<script setup lang="ts">

import { computed, PropType, ref } from "vue"
import axios from "axios"
import { TranslationUnitInterface } from "@/types/modelInterfaces"

const props = defineProps({
		units: {type: Object as PropType<TranslationUnitInterface[]>, default: ()=>{}}
	}),
	theUnits = ref(props.units.map(x=>({...x, selected: false}))),
	unitsSelection = computed(()=>{
		return theUnits.value.filter(x=>x.selected)
	}),
	updateUnits = function(item){
		item.selected=!item.selected

		if(!item.words) {
			axios.get(route("translation.words", [item.id])).then(res => {
				item.words = res.data
			})
		}

		emits("update", unitsSelection.value)
	}

const emits = defineEmits(["update"])
</script>
<template>
	<div class="border-y border-gray-400 pt-3 pb-5">
		<h2 class="text-lg font-extralight mb-2 uppercase">
			sélection des unités
		</h2>

		<div class="flex flex-wrap gap-3">
			<button
				v-for="(item, key) of theUnits"
				:key="key"
				class="btn !px-10"
				:class="item.selected?'btn-success':'bg-white'"
				@click="updateUnits(item)"
			>
				{{ item.unit }}
			</button>
		</div>
	</div>
</template>
