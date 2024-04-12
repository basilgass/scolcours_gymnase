<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script setup lang="ts">
import { inject, Ref, ref } from "vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"
import { useIntersectionObserver } from "@vueuse/core"
import { flashInterface } from "@/types/index.js"
import axios from "axios"

const props = defineProps({
		chapterSlug: { type: String, required: true },
		responsive: { type: Boolean, default: false },
	})

	const formular = ref(null)
	useIntersectionObserver(formular, ([{ isIntersecting }]) => {
		if (isIntersecting && theFormular.value.length === 0) {
			loadFormular()
		}
	})

	const theFormular = ref([]),
		theSlug = ref(props.chapterSlug),
		themeChapters = ref([]),
		loadingState = ref(true),
		theFormularErrors = ref("")

	const flash = inject<flashInterface>("flash"),
		editMode = inject<Ref<boolean>>("editMode")
	const addFormula = function () {
			axios
				.post(route("formulas.store", [props.chapterSlug]), {})
				.then((res) => {
					flash.success("formule créée")
					theFormular.value.push(res.data)
				})
		},
		deleteFormular = function (id) {
			axios
				.post(route("formulas.destroy", [id]), { _method: "DELETE" })
				.then(() => {
					flash.success("formule supprimée")
					theFormular.value = theFormular.value.filter(
						(x) => x.id !== id,
					)
				})
		},
		updateFormulasOrder = function () {
			axios
				.post(route("formulas.updateOrder"), {
					order: theFormular.value.map((x, index) => {
						return { id: x.id, order: index }
					}),
				})
				.then(() => {
					// TODO : flash message !
					flash.success(
						"L'ordre des formules à bien été enregistré !",
					)
				})
				.catch((res) => {
					// toDO: Show error message
					console.warn("update ordering order: ", res.data)
				})
		},
		loadFormular = function () {
			return axios
				.get(route("chapters.formulas.index", [theSlug.value]))
				.then((res) => {
					theFormular.value = res.data.formular
					// Add the new chapters to the list
					res.data.chapters.forEach((chapter) => {
						if (
							!themeChapters.value.find(
								(x) => x.slug === chapter.slug,
							)
						) {
							themeChapters.value.push(chapter)
						}
					})
					// themeChapters.value = res.data.chapters
				})
				.catch((err) => {
					theFormularErrors.value = err.toJSON()
				})
				.finally(() => {
					loadingState.value = false
				})
		},
		updateFormular = function (slug) {
			theSlug.value = slug
			loadingState.value = true
			loadFormular()
		}
</script>

<template>
	<article ref="formular">
		<div class="px-5 flex justify-between">
			<h3 class="text-xl uppercase font-extralight mb-2">
				Formulaires
			</h3>
		</div>

		<div
			v-if="themeChapters.length > 0 || editMode"
			class="flex flex-wrap items-center gap-1 px-5 min-h-[3em]"
		>
			<button
				v-for="item of themeChapters"
				:key="item.slug"
				v-theme.btn.text="item.theme_id"
				v-katex.auto="item.title"
				:class="{
					'btn-xs text-xs': item.slug !== theSlug,
					'font-semibold': item.slug === props.chapterSlug,
				}"
				class="transition-all btn"
				@click="updateFormular(item.slug)"
			/>
		</div>

		<div v-if="theFormular.length > 0 || editMode">
			<div
				v-if="loadingState"
				class="px-5 grid place-items-center min-h-[10em]"
			>
				à la recherche des formules dans un très gros livre
			</div>
			<draggable
				v-else
				v-model="theFormular"
				handle=".draggable-handle"
				item-key="id"
				:class="props.responsive ? 'md:columns-2 lg:columns-3' : ''"
				class="columns-1 space-y-5"
				v-bind="{
					animation: 200,
					disabled: !$page.props.auth.can.admin,
				}"
				@end="updateFormulasOrder"
			>
				<template #item="{ element }">
					<block-show
						v-if="element.block"
						:key="element.id"
						:block="element.block"
						v-theme.border="element.chapter.theme_id"
						:max-illustration="1"
						class="break-inside-avoid-column bg-white rounded shadow border-l-4"
						@destroy="deleteFormular(element.id)"
					/>
				</template>
				<template #footer>
					<footer>
						<div
							v-show="editMode"
							v-admin
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

		<div
			v-if="theFormularErrors !== ''"
			class="text-red font-code text-xs"
			v-text="theFormularErrors"
		/>
	</article>
</template>
