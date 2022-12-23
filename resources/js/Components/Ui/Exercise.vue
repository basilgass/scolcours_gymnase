<template>
	<Panel class="overflow-hidden flex flex-col h-full">
		<header class="pb-2 flex justify-between">
			<div>
				<h2 class="text-lg leading-6 text-gray-900">
					{{ `exercice ${exerciseNumber}` }}
				</h2>
				<div class="text-sm text-gray-500">
					{{ exercise.title }}
				</div>
			</div>

			<div v-admin>
				<i
					class="bi bi-trash text-gray-200 hover:text-red-500 transition-colors cursor-pointer"
					@click="deleteExercise(exercise.id)"
				/>
			</div>
		</header>

		<!-- Exercise body -->
		<section class="flex border-t -mx-4 px-4 py-2 flex-1">
			<div class="w-1/6">
				Donnée
			</div>
			<div class="w-5/6">
				{{ exercise.body }}
			</div>
		</section>

		<!-- Images or components -->
		<section
			v-if="exercise.illustrations.length>0"
			class="flex border-t -mx-4 px-4 py-2"
		>
			<div class="w-1/6">
				Images
			</div>

			<div
				:class="{
					'md:grid-cols-2 xl:grid-cols-3':exercise.illustrations.length>2,
					'md:grid-cols-2 xl:grid-cols-2':exercise.illustrations.length===2,
				}"
				class="w-5/6 grid grid-cols-1 gap-2"
			>
				<template
					v-for="illustration of exercise.illustrations"
					:key="`illustration_${illustration.id}`"
				>
					<img

						:src="'/storage/'+illustration.url"
						alt="illustration"
						@click="showImage=illustration.url"
					>
				</template>
			</div>
		</section>

		<!-- Explication -->
		<section
			v-if="exercise.explanation!==null"
			class="flex border-t -mx-4 px-4 py-2"
		>
			<div
				class="w-1/6 cursor-pointer"
				@click="showExplanation=!showExplanation"
			>
				explications
			</div>
			<div class="w-5/6">
				<transition name="slide-right">
					<div v-show="showExplanation">
						{{ exercise.explanation }}
					</div>
				</transition>
			</div>
		</section>

		<!-- Answer -->
		<footer class="flex  border-t -mx-4 px-4 py-2">
			<div
				class="w-1/6 cursor-pointer"
				@click="showAnswer=!showAnswer"
			>
				réponse
			</div>
			<transition name="slide-right">
				<span
					v-show="showAnswer"
					class="inline-block"
				>
					{{ exercise.answer }}
				</span>
			</transition>
		</footer>
	</Panel>
</template>
<script setup>
import Panel from "@/Components/Ui/Panel"
import {ref} from "vue"
import {useForm} from "@inertiajs/inertia-vue3"

const props = defineProps({
	exercise: {
		type: Object, default: () => {
		}
	},
	exerciseNumber: {type: Number, default: 1, required: true}
})

let showAnswer = ref(false),
	showExplanation = ref(false),
	showImage = ref(null)

const form = useForm()

function deleteExercise(id) {
	form.delete(`/exercise/${id}`, {
		preserveScroll: true
	})
}
</script>
