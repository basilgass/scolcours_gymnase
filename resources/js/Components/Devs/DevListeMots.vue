<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { computed, ref } from "vue"
import axios from "axios"

defineOptions({ layout: LayoutMain })

const nbCar = ref(5)

const words = ref<string[]>([])

function getWords(){
	if(nbCar.value===0){
		return
	}

	axios.get(route('dico.fetch', {
		language: 'fr',
		size: nbCar.value
	}))
		.then(response => {
			words.value = response.data
		})
}

</script>
<template>
	<!-- Title -->
	<div ref="root">
		<form-maker
			v-model="nbCar"
			type="number"
		/>

		<div>Il y a {{ words.length }} mots</div>
		<pre v-text="words" />
	</div>
</template>
