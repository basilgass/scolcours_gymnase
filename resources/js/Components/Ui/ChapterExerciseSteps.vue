<template>
	<chapter-simple-exercise>
		<template #options>
			<button
				class="btn btn-xs"
				@click="updateContent"
			>
				<i class="bi bi-shuffle mr-5" />Aléatoire
			</button>
		</template>

		<div class="space-y-10 katex-boxed">
			<div
				v-katex.auto="example.header"
				class="mb-5"
			/>

			<div v-if="example.steps.length>0">
				<div
					v-if="!develop"
					class="text-center"
				>
					<button
						class="btn"
						@click="develop=true"
					>
						Afficher le développement
					</button>
				</div>
				<div v-else>
					<div
						v-for="item of example.steps"
						:key="item.id"
					>
						<div v-katex.auto="item.text" />
						<chapter-answer v-if="item.math">
							<div v-katex="item.math" />
						</chapter-answer>
					</div>
				</div>
			</div>
		</div>
	</chapter-simple-exercise>
</template>
<script setup>

import {onMounted, reactive, ref} from "vue"
import ChapterSimpleExercise from "@/Components/Ui/ChapterSimpleExercise"
import ChapterAnswer from "@/Components/Ui/ChapterAnswer"

let props = defineProps({
	content: {type: Function, required: true}
})

let example = reactive(
	{
		header: "",
		steps: []
	}
)

let develop = ref(false)

function updateContent(){
	develop.value = false
	let values = props.content()

	example.header = values.header
	example.steps = values.steps
}

onMounted(() => {
	updateContent()
})

</script>
