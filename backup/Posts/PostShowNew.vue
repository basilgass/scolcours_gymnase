<template>
	<section class="bg-white border border-gray-200 rounded-xl p-10">
		<h1
			v-katex.auto="thePost.title"
			class="text-lg md:text-xl font-semibold"
		/>

		<post-header />

		<div v-if="showBlocks">
			<post-blocks />
		</div>

		<div v-if="showQuestions">
			<h2 class="font-semibold">
				questions
			</h2>
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
import PostHeader from "./PostHeader.vue"
import PostBlocks from "./PostBlocks.vue"

const props = defineProps({
	post: {type: Object, default: () => {}
	},
})

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
