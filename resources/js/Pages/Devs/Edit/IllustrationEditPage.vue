<script setup lang="ts">
import { PropType, ref } from "vue"
import IllustrationForm from "@/Components/Posts/Illustrations/IllustrationForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { IllustrationInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	illustration: {type: Object as PropType<IllustrationInterface>, required: true},
})
const show = ref(true)
</script>

<template>
	<illustration-form
		v-model="show"
		:illustration="props.illustration"
	/>
</template>
