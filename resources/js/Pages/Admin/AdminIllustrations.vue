<script setup lang="ts">

import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { IllustrationInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	illustrations: {type: Object as PropType<IllustrationInterface[]>, required: true}
})

const search = ref(""),
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
<template>
	<h1 class="text-3xl pt-5">
		Contrôle des illustrations
	</h1>

	<div>
		<form-maker
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

