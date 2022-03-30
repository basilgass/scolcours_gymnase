<template>
	<div
		v-for="post in posts"
		:key="post.id"
	>
		<component
			:is="getPostTemplate(post)"
			:post="post"
		/>
		<p>{{ post.title }}</p>
		<p>{{ post.body }}</p>
	</div>
</template>

<script setup>

import {defineAsyncComponent, ref} from "vue"

const props = defineProps({
	chapter: {type: String, default: ""},
	filter: {type: String, default: ""}
})
let posts = ref([])

function getPostTemplate(post) {
	return defineAsyncComponent(
		() => import(`@/Components/Posts/Templates/${post.template.component}`)
	)
}

async function getPosts() {
	axios.get(
		"/post/fetch/" + props.chapter,
	).then(res => {
		posts.value = res.data
	}).catch(
		err => {console.error(err.response)}
	)
}

posts.value = getPosts()

</script>
