<template>
	<div
		ref="root"
	>
		<pi-draw-parser
			v-if="illustration.type==='draw'"
			:draw="illustration"
		/>
		<component
			:is="IllustrationComponent"
			v-if="illustration.type==='component'"
			:illustration="illustration"
		/>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

const props = defineProps({
	illustration: {type: Object, required: true},
})

let root = ref(null)

const IllustrationComponent = computed(
	() => {
		if(props.illustration.type==="component"){
			return defineAsyncComponent(
				() => import(`@/Components/Posts/Illustrations/Elements/${props.illustration.title}.vue`)
			)
		}else{
			return false
		}
	}
)
</script>
