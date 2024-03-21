<script setup lang="ts">
import { ref } from "vue"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	block: {type: Object, required: true},
})
const show = ref(true)
</script>

<template>
	<block-form
		v-model="show"
		:block="props.block.data"
	/>
</template>
