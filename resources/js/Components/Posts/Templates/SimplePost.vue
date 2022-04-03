<template>
	<div
		ref="root"
		class="max-w-6xl mx-auto bg-white p-3"
	>
		<h2 class="text-xl font-mono">
			{{ props.post.title }}
		</h2>


		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<markdown-it
				:text="props.post.body"
				class="my-10"
			/>

			<div v-if="props.post.illustrations.length>0">
				<div
					v-for="(illustration) of props.post.illustrations"
					:key="'illustration-'+illustration.id"
				>
					<IllustrationDraw
						v-if="illustration.type==='draw'"
						:draw="illustration"
						class="max-w-lg"
					/>
				</div>
			</div>

			<div v-if="props.post.walkthrough.length>0">
				<h3 class="mt-8 mb-4 font-semibold">
					Marche à suivre
				</h3>
				<ol class="list-decimal list-space space-y-4">
					<li
						v-for="step in props.post.walkthrough"
						:key="'walkguide-'+step.id"
						class="katex-boxed"
					>
						{{ step.step }}
					</li>
				</ol>
			</div>

			<div
				v-if="props.post.walkthrough.length>0"
				class="lg:col-span-2"
			>
				<div class="flex items-center mt-8 mb-4 space-x-10">
					<h3 class="font-semibold">
						Résolution
					</h3>
					<button
						v-show="solutions<props.post.walkthrough.length"
						class="btn px-2 py-1"
						@click="solutions++"
					>
						Etape suivante
					</button>
				</div>

				<ol class="list-decimal list-space space-y-4">
					<li
						v-for="(step, index) in props.post.walkthrough"
						v-show="solutions>index"
						:key="'walkguide-'+step.id"
						class="katex-boxed katex-left"
					>
						{{ step.resolution }}
					</li>
				</ol>
			</div>

			<div
				v-if="props.post.answer"
				class="bg-red-200 mt-10"
			>
				{{ props.post.answer.body }}
			</div>

			<div v-if="props.post.component">
				<component
					:is="PostComponent"
					:params="JSON.parse(props.post.component.parameters)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>

import {computed, defineAsyncComponent, onMounted, ref} from "vue"
import IllustrationDraw from "@/Components/Posts/IllustrationDraw"
import MarkdownIt from "@/Components/Ui/MarkdownIt"

let root = ref(null),
	solutions = ref(0)

const props = defineProps({
	post: {
		type: Object, default: () => {
		}
	}
})

const PostComponent = computed(() => {
	if (props.post.component) {
		return defineAsyncComponent(
			() => import(`@/Components/${props.post.component.component}`)
		)
	}
	return false
})

onMounted(() => {
	katexAutoRender(root.value)
})
</script>
