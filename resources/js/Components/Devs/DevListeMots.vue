<script setup lang="ts">

import FormInput from "@/Components/Form/FormInput.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ref} from "vue"
import axios from "axios"

defineOptions({layout: LayoutMain})

const nbCar = ref(5)

const words = ref<string[]>([])

function getWords() {
	if (nbCar.value === 0) {
		return
	}

	axios.get(route('dico.index', {
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
		<FormInput
			v-model="nbCar"
			type="number"
		/>

		<div>Il y a {{ words.length }} mots</div>
		<pre v-text="words" />
	</div>
</template>
