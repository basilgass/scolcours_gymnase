<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script setup>
	import { computed, ref } from "vue"
	import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"
	import { useIntersectionObserver } from "@vueuse/core"

	const props = defineProps({
		chapterSlug: { type: String, required: true },
		responsive: { type: Boolean, default: false },
	})

	const theoremsList = ref(null)
	useIntersectionObserver(theoremsList, ([{ isIntersecting }]) => {
		if (isIntersecting && theTheorems.value.length === 0) {
			console.log("load theorems")
			loadTheorems()
		}
	})

	const theTheorems = ref([]),
		theSlug = ref(props.chapterSlug),
		loadingState = ref(true),
		theTheoremsErrors = ref(""),
		showTheorems = ref(true),
		showProperties = ref(true),
		showDefinitions = ref(true)

	const loadTheorems = function () {
		return axios
			.get(route("chapters.theorems.index", [theSlug.value]))
			.then((res) => {
				theTheorems.value = res.data.data
			})
			.catch((err) => {
				theTheoremsErrors.value = err.toJSON()
			})
			.finally((res) => {
				loadingState.value = false
			})
	}
	const theTheoremsFiltered = computed(() => {
		return theTheorems.value
			.filter((block) => {
				return (
					(block.type === "theorem" && showTheorems.value) ||
					(block.type === "property" && showProperties.value) ||
					(block.type === "definition" && showDefinitions.value)
				)
			})
			.slice(0, 5)
	})
</script>

<template>
	<article ref="theoremsList">
		<div v-if="theTheorems.length > 0">
			<div class="px-5 my-5">
				<h3 class="text-xl uppercase font-extralight mb-2">Théorie</h3>
				<div class="flex flex-wrap text-xs gap-1">
					<button
						:class="showTheorems ? 'is-active' : ''"
						class="btn btn-xs"
						@click="showTheorems = !showTheorems"
					>
						théorèmes
					</button>
					<button
						:class="showDefinitions ? 'is-active' : ''"
						class="btn btn-xs"
						@click="showDefinitions = !showDefinitions"
					>
						définitions
					</button>
					<button
						:class="showProperties ? 'is-active' : ''"
						class="btn btn-xs"
						@click="showProperties = !showProperties"
					>
						propriétés
					</button>
				</div>
			</div>

			<div>
				<div
					v-if="loadingState"
					class="px-5 grid place-items-center min-h-[10em]"
				>
					à la recherche des théories dans un très gros livre
				</div>

				<div v-else class="grid grid-cols-1 gap-5">
					<block-show
						v-for="block in theTheoremsFiltered"
						:key="`block-${block.id}`"
						:block="block"
						force-show
					></block-show>
				</div>
			</div>

			<div
				v-if="theTheoremsErrors !== ''"
				class="text-red font-code text-xs"
				v-text="theTheoremsErrors"
			/>
		</div>
	</article>
</template>
