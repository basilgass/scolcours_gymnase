<script lang="ts" setup>
	import FormWrapper from "@/Components/Form/FormWrapper.vue"
	import { ref } from "vue"

	let txt = ref("hello world")
	let nb = ref(8)
	let chk = ref(true)
</script>

<template>
	<form-wrapper v-model="txt" color="blue" label="hello world" with-icon>
	</form-wrapper>

	<form-wrapper
		v-model="txt"
		color="blue"
		label="hello world"
		with-icon
		inline-label
	>
	</form-wrapper>

	<form-wrapper
		v-model="txt"
		color="blue"
		label="hello world"
		with-icon
		font-code
		label-as-placeholder
	>
	</form-wrapper>

	<form-wrapper
		v-model="nb"
		color="blue"
		label="nombre à donner"
		type="number"
		with-icon
	>
	</form-wrapper>

	<form-wrapper
		v-model="nb"
		color="blue"
		label="nombre de 5 à 20"
		type="number"
		with-icon
		:min="5"
		:max="20"
		:step="0.2"
	/>

	<form-wrapper
		v-model="chk"
		color="blue"
		label="case à cocher"
		type="checkbox"
	>
	</form-wrapper>
</template>

<style scoped></style>
