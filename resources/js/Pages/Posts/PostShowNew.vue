<template>
	<section>
		<h1 v-katex.auto="thePost.title" />

		<header>Post header - with admin and user</header>

		<div v-if="showBlocks">
			<h2 class="font-semibold">blocks</h2>
			<div
				v-for="block in thePost.blocks"
				:key="block.id"
				class="my-5"
			>
				{{
					block.body
				}}
			</div>
		</div>

		<div v-if="showQuestions">
			<h2 class="font-semibold">questions</h2>
			<div
				v-for="question in thePost.questions"
				:key="question.id"
				class="my-5"
			>
				{{
					question
				}}
			</div>
		</div>

		<footer>Post footer - with admin and user</footer>
	</section>
</template>

<script setup>
import {computed, reactive, ref} from "vue"

const props = defineProps({
	post: {type: Object, default: () => {}
	},
})

console.log({...props.post.data})

let thePost = reactive(props.post.data),
	toggleShowBlocks = ref(true),
	showBlocks = computed(()=>{
		if(thePost.blocks.length>0){
			return toggleShowBlocks.value
		}else{
			return false
		}
	}),
	toggleShowQuestions = ref(true),
	showQuestions = computed(()=>{
		if(thePost.questions.length>0){
			return toggleShowQuestions.value
		}else{
			return false
		}
	})

</script>
