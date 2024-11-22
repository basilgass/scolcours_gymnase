<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import { useIntersectionObserver } from "@vueuse/core"
import axios from "axios"
import { computed, ref } from "vue"

const props = defineProps({
	chapterSlug: { type: String, required: true },
	responsive: { type: Boolean, default: false }
})

const theoremsList = ref(null)
useIntersectionObserver(theoremsList, ([{ isIntersecting }]) => {
	if (isIntersecting && theTheorems.value.length === 0) {
		loadTheorems()
	}
})

const theTheorems = ref([]),
	theSlug = ref(props.chapterSlug),
	loadingState = ref(true),
	theTheoremsErrors = ref(""),
	showGroup = ref("")
// showTheorems = ref(true),
// showProperties = ref(true),
// showDefinitions = ref(true)

const loadTheorems = function() {
	return axios
		.get(route("chapters.theorems.index", [theSlug.value]))
		.then((res) => {
			theTheorems.value = res.data
		})
		.catch((err) => {
			theTheoremsErrors.value = err.toJSON()
		})
		.finally(() => {
			loadingState.value = false
		})
}
const theTheoremsFiltered = computed(() => {
	return theTheorems.value
		.filter((block) => {
			return (
				showGroup.value === "" || block.type === showGroup.value
			)
		})
		.slice(0, 5)
})

const groups = {
	"théorèmes": "theorem",
	"propriétés": "property",
	"définitions": "definition"
}

function toggleGroup(name: "theorem" | "property" | "definition") {
	showGroup.value = showGroup.value === name ? "" : name
}
</script>

<template>
	<article ref="theoremsList">
		<div
			v-if="loadingState"
			class="grid place-items-center min-h-[10em]"
		>
			à la recherche des théories dans un très gros livre
		</div>

		<div v-else-if="theTheorems.length > 0">
			<div class="my-5">
				<h3 class="text-xl uppercase font-extralight mb-2">
					Théorie
				</h3>
				<div class="flex flex-wrap text-xs gap-1">
					<button
						v-for="(key, name) in groups"
						:class="(showGroup==='' || showGroup===key) ? 'is-active' : ''"
						class="btn btn-xs"
						@click="toggleGroup(key)"
					>
						{{ name }}
					</button>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5">
				<block-show
					v-for="block in theTheoremsFiltered"
					:key="`block-${block.id}`"
					:block="block"
					force-show
				/>
			</div>
		</div>
		<div
			v-if="theTheoremsErrors !== ''"
			class="text-red font-code text-xs"
			v-text="theTheoremsErrors"
		/>
	</article>
</template>
