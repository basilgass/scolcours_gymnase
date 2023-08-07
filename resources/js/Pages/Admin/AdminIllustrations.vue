<template>
	<h1 class="text-3xl pt-5">
		Contrôle des illustrations
	</h1>

	<div>
		<form-input
			v-model="search"
			name="filtrer"
			:label="`filtrer (${listOfIllustrations.length} / ${props.illustrations.length})`"
		/>
	</div>

	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<illustration-show
			v-for="(illustration, id) of listOfIllustrations"
			:key="`illustration-${id}`"
			:illustration="illustration"
		/>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {computed, ref} from "vue"

let props = defineProps({
	illustrations: {type: Array, required: true}
})

let search = ref(""),
	listOfIllustrations = computed(()=>{
		if(search.value===""){
			return props.illustrations
		}

		const searchLC = search.value.toLowerCase()

		return props.illustrations.filter(item =>
			item.parameters?.toLowerCase().includes(searchLC) ||
			item.code.toLowerCase().includes(searchLC)
		)
	})
</script>

