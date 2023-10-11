<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script setup>
	import { inject, onMounted, ref } from "vue"
	import BlockShow from "@/Components/Posts/Blocks/BlockShow.vue"

	const props = defineProps({
		chapterSlug: { type: String, required: true },
		responsive: { type: Boolean, default: false },
	})
	const theFormular = ref([]),
		theSlug = ref(props.chapterSlug),
		themeChapters = ref([]),
		loadingState = ref(true),
		theFormularErrors = ref("")

	const flash = inject("flash"),
		editMode = inject("editMode")
	const addFormula = function () {
			axios
				.post(route("chapters.formulas.store", [props.chapterSlug]), {})
				.then((res) => {
					flash.success("formule créée")
					theFormular.value.push(res.data.data)
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
					console.warning("update ordering order: ", res.data)
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

	// Load the formular
	onMounted(() => {
		loadFormular()
	})
</script>

<template>
	<article>
		<div class="px-5 flex justify-between">
			<h3 class="text-xl uppercase font-extralight mb-2">Formulaires</h3>
		</div>

		<div
			v-if="themeChapters.length > 0 || editMode.enabled.value"
			class="flex flex-wrap text-xs gap-1 px-5"
		>
			<button
				v-for="item of themeChapters"
				:key="item.slug"
				v-katex.auto="item.title"
				:class="{
					'is-active': item.slug === theSlug,
					'font-semibold': item.slug === props.chapterSlug,
				}"
				class="btn btn-xs transition-colors"
				@click="updateFormular(item.slug)"
			/>
		</div>

		<div v-if="theFormular.length > 0 || editMode.enabled.value">
			<div
				v-if="loadingState"
				class="px-5 grid place-items-center min-h-[10em]"
			>
				à la recherche des formules dans un très gros livre
			</div>
			<div
				v-else
				:class="props.responsive ? 'md:columns-2 lg:columns-3' : ''"
				class="columns-1 gap-4"
			>
				<draggable
					v-model="theFormular"
					class="my-5"
					handle=".draggable-handle"
					item-key="id"
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
							:max-illustration="1"
							class="break-inside-avoid-column"
							@destroy="deleteFormular(element.id)"
						/>
					</template>
					<template #footer>
						<footer>
							<div
								v-show="editMode.enabled.value"
								v-admin
								class="px-5"
							>
								<button class="btn-new" @click="addFormula">
									Ajouter une formule
								</button>
							</div>
						</footer>
					</template>
				</draggable>
			</div>
		</div>

		<div
			v-if="theFormularErrors !== ''"
			class="text-red font-code text-xs"
			v-text="theFormularErrors"
		/>
	</article>
</template>
