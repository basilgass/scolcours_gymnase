<template>
	<question-form
		v-model="show"
		:question="props.question.data"
	/>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup>
import {ref} from "vue"
import QuestionForm from "@/Components/Posts/Questions/QuestionForm.vue"

let props = defineProps({
	question: {type: Object, required: true}
})
let show = ref(true)
</script>
