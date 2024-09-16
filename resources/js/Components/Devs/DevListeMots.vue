<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import { listeDeMots } from "@/helpers/liste-des-mots-francais"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { computed, ref } from "vue"

defineOptions({ layout: LayoutMain })

const nbCar = ref(5)

const words = computed(() => {
	return listeDeMots.filter(x => x.length === nbCar.value)
})

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
