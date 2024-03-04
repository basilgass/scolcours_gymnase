<script setup lang="ts">
import { ref } from "vue"
import QuestionForm from "@/Components/Posts/Questions/QuestionForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	question: {type: Object, required: true}
})
const show = ref(true)
</script>
<template>
	<question-form
		v-model="show"
		:question="props.question.data"
	/>
</template>
