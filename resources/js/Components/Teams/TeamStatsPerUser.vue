<script lang="ts" setup>
import { computed, PropType, ref } from "vue"
import { ChapterMinInterface, PostQuestionsForOneUserStatsInterface, UserInterface } from "@/types/modelInterfaces"
import { useIntersectionObserver } from "@vueuse/core"
import { router } from "@inertiajs/vue3"

const props = defineProps({
	user: {
		type: Object as PropType<UserInterface>,
		required: true
	},
	chapter: {
		type: Object as PropType<ChapterMinInterface>,
		required: true
	},
	stats: {
		type: Object as PropType<PostQuestionsForOneUserStatsInterface[]>,
		required: true
	},
	percent:  {
		type: Boolean,
		default: false
	}
})

const chapterQuestions = computed(() => {
	const [answered, total] = props.stats.map(post => {
		return [post.sum, post.total]
	}).reduce((acc, [sum, length]) => {
		return [acc[0] + sum, acc[1] + length]
	}, [0, 0])

	return {
		answered,
		total,
		ratio: answered / total
	}
})

const userStatRef = ref(null)
const animate = ref(0)

useIntersectionObserver(userStatRef, ([entry]) => {
	if (entry.isIntersecting) animate.value = 1
}, {
	threshold: 0.5

})

function displayValue(sum: number, value: number){
	if(props.percent){
		return `${(sum===0?0:sum / value*100).toFixed(0)}%`
	}
	return `${sum} / ${value}`
}
function gotoPost(postId: number){
	router.visit(route('posts.show', postId))
}
</script>

<template>
	<section ref="userStatRef">
		<div class="flex">
			<h2
				class="text-2xl w-full min-w-[251px] max-w-[250px]"
			>
				{{ user.name }} {{ user.firstname }}
			</h2>
			<div class="relative w-full">
				<div
					class="absolute inset-0 grid place-items-center"
					v-text="displayValue(chapterQuestions.answered , chapterQuestions.total)"
				/>
				<div
					:style="`width:${chapterQuestions.ratio*100*animate}%`"
					class="flex h-[2em] transition-all duration-500 ease-in-out"
					:class="{
						'bar-success': chapterQuestions.ratio>0.75,
						'bar-danger': chapterQuestions.ratio<0.30,
						'bar-warning': chapterQuestions.ratio>=0.30 && chapterQuestions.ratio<=0.75
					}"
				/>
			</div>
		</div>
		<div
			v-for="post in stats"
			:key="post.id"
			class="bg-white border rounded-l flex items-center"
		>
			<h2
				class="px-3 min-w-[250px] max-w-[250px] max-h-[2em] leading-[0.9] text-xs cursor-pointer"
				v-katex.auto="post.title"
				@click="gotoPost(post.id)"
			/>

			<div class="relative w-full">
				<div
					class="absolute inset-0 grid place-items-center"
					v-text="displayValue(post.sum, post.total)"
				/>
				<div
					:style="`width:${(post.sum===0?1:post.sum / post.total)*100*animate}%`"
					class="flex h-[2em] bar transition-all duration-500 ease-in-out"
					:class="{
						'bar-success': post.sum / post.total>0.75,
						'bar-danger': post.sum / post.total<0.30,
						'bar-warning': post.sum / post.total>=0.30 && post.sum / post.total<=0.75
					}"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
.bar-success{
	@apply bg-green-400/30 border border-green-400;
}
.bar-danger{
	@apply bg-red-300/30 border border-red-200;
}
.bar-warning{
	@apply bg-amber-300/30 border border-amber-400;
}
</style>
