<template>
	<div ref="root">
		<div v-if="illustration.type==='draw'">
			<pi-draw-parser :draw="illustration" />
		</div>
		<div v-if="illustration.type==='component'">
			<component :is="IllustrationComponent" />
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser"

const props = defineProps({
	illustration: {type: Object, required: true}
})

let root = ref(null)


const IllustrationComponent = computed(
	() => {
		if(props.illustration.type==="component"){
			return defineAsyncComponent(
				() => import(`@/Components/Chapters/${props.illustration.code}`)
			)
		}else{
			return false
		}
	}
)
</script>
