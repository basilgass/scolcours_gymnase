<template>
	<chapter-simple-exercise>
		<template #options>
			<button
				v-if="!noShuffle"
				class="btn btn-xs"
				@click="updateContent"
			>
				<i class="bi bi-shuffle mr-5" />Aléatoire
			</button>
		</template>

		<div class="katex-boxed">
			<div
				v-if="example.header.title!==''"
				v-katex.auto="example.header.title"
				class="text-lg"
			/>

			<div v-katex.auto="example.header.body" />

			<div v-if="example.steps.length>0">
				<div class="text-center">
					<button
						class="text-gray-500 italic text-xs"
						:class="develop?'invisible':''"
						@click="develop=!develop"
					>
						Développer l'exemple
					</button>
				</div>

				<collapse-transition
					v-model="develop"
					button
				>
					<div v-if="develop">
						<div
							v-for="item of example.steps"
							:key="item.id"
						>
							<div v-katex.auto="item.body" />
							<chapter-answer
								v-if="item.answer!==''"
								:force-show="developed"
							>
								<div v-katex="item.answer" />
							</chapter-answer>
						</div>
					</div>
				</collapse-transition>
			</div>
		</div>
	</chapter-simple-exercise>
</template>
<script setup>

import {onMounted, reactive, ref} from "vue"
import ChapterSimpleExercise from "@/Components/Ui/Chapters/ChapterSimpleExercise"
import ChapterAnswer from "@/Components/Ui/Chapters/ChapterAnswer"
import CollapseTransition from "@/Components/CollapseTransition"

let props = defineProps({
	content: {type: Function, required: true},
	developed: {type: Boolean, default: false},
	noShuffle: {type: Boolean, default: false}
})

let example = reactive(
	{
		header: "",
		steps: []
	}
)

let develop = ref(props.developed),
	showAnswer = ref(props.developed)

function updateContent() {
	develop.value = props.developed

	let values = props.content()

	example.header = values.header
	example.steps = values.steps.map(x=>x.data)
}

onMounted(() => {
	updateContent()
})

</script>
