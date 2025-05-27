<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import {ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"


const value = ref("")

const choices = {
	'a': 'hello',
	'b': 'world'
}
</script>

<template>
	<article class="scolcours-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<Card>
			<form-maker
				v-model="value"
				label="selection input"
				type="select"
				:choices
			/>
		</Card>
		<Card>
			<template #header>
				RESULT
			</template>
			<div>{{ value }}</div>
		</Card>
	</article>
</template>
