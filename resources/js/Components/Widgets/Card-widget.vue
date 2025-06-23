<script
	lang="ts"
	setup
>
import {BlockInterface, WidgetPropsInterface} from "@/types/modelInterfaces"
import {onMounted, ref} from "vue"
import CardItem from "@/Components/Elements/CardItem.vue"
import axios from "axios"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const recto = ref<BlockInterface>()
const verso = ref<BlockInterface>()

// TODO: centralize makeBlock
function makeBlock(body: string): BlockInterface {
	return {
		id: -1,
		active: true,
		order: 0,
		merge: false,
		switch: false,
		type: '',
		title: '',
		body,
		template: '',
		illustrationsGrid: '',
		illustrations: [],
		script: '',
		json: ''
	}
}

onMounted(() => {
	// props.illustrations.code is two texts, separated by --- (three dashes)
	const card = props.illustration.code
		.split('---')

	if(card.length===2){
		recto.value = makeBlock(card[0])
		verso.value = makeBlock(card[1])
	}else{
		const id = props.illustration.code

		axios.get(route("api.cards.fetch", [id]))
			.then(res => {
				// Sort the value to match the id's order
				recto.value = res.data[0].recto
				verso.value = res.data[0].verso
			})
			.catch(res=>{
				console.error(res)
			})
	}


})

</script>

<template>
	<card-item
		v-if="recto"
		:recto="recto"
		:verso="verso"
	/>
</template>


