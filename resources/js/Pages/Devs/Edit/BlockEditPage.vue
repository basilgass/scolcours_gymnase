<template>
	<block-form
		v-model="show"
		:block="props.block.data"
	/>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain,
}
</script>

<script setup>
import {ref} from "vue"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"

let props = defineProps({
	block: {type: Object, required: true},
})
let show = ref(true)
</script>
