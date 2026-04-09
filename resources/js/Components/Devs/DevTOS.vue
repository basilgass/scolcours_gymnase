<script setup lang="ts">

import FormInput from "@/Components/Form/FormInput.vue"
import TableOfSigns from "@/Components/Pi/TableOfSigns.vue"
import { TABLE_OF_SIGNS_VALUES } from "pimath"
import { computed, ref } from "vue"

const rootsStr = ref('2,3,8')
const roots = computed(()=> rootsStr.value.split(','))

const signsStr = ref('-z+d+zh')
const signs = computed(()=> signsStr.value.split('') as TABLE_OF_SIGNS_VALUES[])

const resultStr = ref('-z+d+zh')
const result = computed(()=> resultStr.value.split('') as TABLE_OF_SIGNS_VALUES[])

const extremesStr = ref('-5,,')
const extremes = computed(()=> extremesStr.value.split(',') as TABLE_OF_SIGNS_VALUES[])
</script>

<template>
	<div class="grid grid-cols-2 gap-5 mb-10 p-5 md:p-0">
		<FormInput
			label="root"
			v-model="rootsStr"
		/>
		<FormInput
			label="signs"
			v-model="signsStr"
		/>

		<FormInput
			label="result"
			v-model="resultStr"
		/>

		<FormInput
			label="extremes"
			v-model="extremesStr"
		/>
	</div>

	<table-of-signs
		class="bg-white p-5"
		:roots="roots"
		:signs="signs"
		:result-line="result"
		:extremes="extremes"
	/>
</template>