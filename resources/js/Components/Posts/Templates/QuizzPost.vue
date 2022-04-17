<template>
	<div ref="root">
		<h2 class="text-xl font-mono mt-6 mb-2 bg-red-300">
			{{ props.post.title }}
		</h2>

		<markdown-it :text="props.post.body" />

		<div>{{ items }}</div>

		<!--		<div ref="btnItems">-->
		<!--			<button-->
		<!--				v-for="item in items"-->
		<!--				:key="item"-->
		<!--				class="btn"-->
		<!--			>-->
		<!--				{{ item }}-->
		<!--			</button>-->
		<!--		</div>-->

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<div v-if="props.post.illustrations.length>0">
				<div
					v-for="(illustration) of props.post.illustrations"
					:key="'illustration-'+illustration.id"
				>
					<pi-draw-parser
						v-if="illustration.type==='draw'"
						:draw="illustration"
						class="max-w-lg"
					/>
				</div>
			</div>

			<div
				v-if="props.post.answer"
				class="bg-red-200 mt-10"
			>
				{{ props.post.answer.body }}
			</div>

			<div v-if="props.post.component">
				<component :is="PostComponent" />
			</div>
		</div>
	</div>
</template>

<script setup>
// TODO: QuizzPost to be completed ans reworked
import {computed, defineAsyncComponent, onMounted, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import PiDrawParser from "@/Components/Pi/PiDrawParser"

let root = ref(null),
	btnItems = ref(null)

const props = defineProps({
	post: {
		type: Object, default: () => {
		}
	}
})

let items = computed(() => {
	return [...props.post.body.matchAll(/@{(.*?)}/g)].map(x => x[1])
})

let btnWidth = computed(() => {
	let width = 100,
		btns = btnItems.value.getElementsByTagName("BUTTON")

	if (btn.length > 0) {
		// Do something
	}
	return width
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
