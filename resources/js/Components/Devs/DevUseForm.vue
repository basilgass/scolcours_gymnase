<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import {ref} from "vue"
import FormSelect from "@/Components/Form/FormSelect.vue"
import FormInput from "@/Components/Form/FormInput.vue"


const value = ref("")

const choices = {
	'a': 'hello',
	'b': 'world'
}
</script>

<template>
	<article class="scolcours-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<Card>
			<FormSelect
				v-model="value"
				label="selection input"
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
