<template>
	<post-form
		v-model="show"
		:post="props.post.data"
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
import PostForm from "@/Components/Posts/PostForm.vue"

let props = defineProps({
	post: {type: Object, required: true}
})
let show = ref(true)
</script>
