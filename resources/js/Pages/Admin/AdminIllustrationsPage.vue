<script setup lang="ts">

import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { IllustrationInterface } from "@/types/modelInterfaces"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

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

	<section class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
		<div
			v-for="illustration in listOfIllustrations"
			:key="illustration.id"
			class="bg-white rounded-lg shadow-md"
		>
			<h2 class="bg-gray-200 mb-3 px-3 py-1">
				{{ illustration.title }} (id: {{ illustration.id }})
			</h2>
			<div class="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 font-code">
				<div class="flex flex-col gap-3">
					<form-maker
						v-model="illustration.parameters"
						font-code
						sm
					/>
					<form-maker
						v-model="illustration.code"
						font-code
						type="textarea"
						:wrap="false"
						:rows="illustration.code.split('\n').length"
						sm
					/>
				</div>
					
				<pi-draw-parser :draw="illustration" />
			</div>
		</div>
	</section>
</template>

