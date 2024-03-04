<script setup lang="ts">
import { ref } from "vue"
import PostForm from "@/Components/Posts/PostForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

let props = defineProps({
	post: {type: Object, required: true}
})
let show = ref(true)
</script>

<template>
	<post-form
		v-model="show"
		:post="props.post.data"
	/>
</template>
