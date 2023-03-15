<template>
	<article>
		<div class="px-5 flex justify-between">
			<h3 class="uppercase font-extralight mb-2">
				Formulaires
			</h3>
		</div>

		<div v-if="theFormular.length>0 || editMode.enabled.value">
			<div class="flex flex-wrap text-xs gap-1 px-5">
				<button
					v-for="item of themeChapters"
					:key="item.slug"
					v-katex.auto="item.title"
					:class="{
						'is-active': item.slug===theSlug,
						'font-semibold': item.slug===props.chapterSlug
					}"
					class="btn btn-xs transition-colors"
					@click="updateFormular(item.slug)"
				/>
			</div>

			<div
				:class="props.responsive?'md:columns-2 lg:columns-3': ''"
				class="columns-1 "
			>
				<draggable
					v-model="theFormular"
					class="grid grid-cols-1 gap-3 my-5"
					handle=".draggable-handle"
					item-key="id"
					v-bind="{
						animation: 200,
						disabled: !($page.props.auth.can.admin),
					}"
					@end="updateFormulasOrder"
				>
					<template #item="{ element }">
						<block-show
							v-if="element.block"
							:key="element.id"
							:block="element.block"
							:max-illustration="1"
							class="break-inside-avoid-column"
						/>
					</template>
					<template #footer>
						<footer>
							<div
								v-show="editMode.enabled.value"
								v-admin
								class="px-5"
							>
								<button
									class="btn-new"
									@click="addFormula"
								>
									Ajouter une formule
								</button>
							</div>
						</footer>
					</template>
				</draggable>
			</div>
		</div>
	</article>
</template>

<script setup>

import {inject, onMounted, ref} from "vue"
import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"

const props = defineProps({
	chapterSlug: {type: String, required: true},
	responsive: {type: Boolean, default: false}
})
const theFormular = ref([]),
	theSlug = ref(props.chapterSlug),
	themeChapters = ref([])

const flash = inject("flash"),
	editMode = inject("editMode")
const addFormula = function () {
		axios
			.post(route("chapters.formulas.store", [props.chapterSlug]), {})
			.then(res => {
				flash.add("formule créée")
				theFormular.value.push(res.data.data)
			})
	},
	updateFormulasOrder = function () {
		axios.post(route("formulas.updateOrder"), {
			order: theFormular.value.map((x, index) => {
				return {id: x.id, order: index}
			})
		}).then(res => {
			// TODO : flash message !
			flash.add("L'ordre des formules à bien été enregistré !")
		}).catch(res => console.log("update ordering order: ", res.data))
	},
	loadFormular = function () {
		return axios
			.get(route("chapters.formulas.index", [theSlug.value]))
			.then(res => {
				theFormular.value = res.data.formular
				themeChapters.value = res.data.chapters
			})
	},
	updateFormular = function (slug) {
		theSlug.value = slug
		loadFormular()
	}

// Load the formular
onMounted(() => {
	loadFormular()
})
</script>
