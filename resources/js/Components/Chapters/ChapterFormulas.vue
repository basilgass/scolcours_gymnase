<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script
	lang="ts"
	setup
>
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { flashInterface } from "@/types"
import { FormulaInterface } from "@/types/modelInterfaces.ts"
import { useIntersectionObserver } from "@vueuse/core"
import axios from "axios"
import { inject, ref } from "vue"

const props = defineProps({
	chapterSlug: { type: String, required: true },
	responsive: { type: Boolean, default: false }
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

const flash = inject<flashInterface>("flash")
const editMode = useStoreEditMode()

function addFormula() {
	axios
		.post(route("formulas.store", [props.chapterSlug]), {})
		.then((res) => {
			flash.success("formule créée")
			theFormular.value.push(res.data)
		})
}

function updateFormulasOrder() {
	axios
		.post(route("formulas.updateOrder"), {
			order: theFormular.value.map((x, index) => {
				return { id: x.id, order: index }
			})
		})
		.then(() => {
			// TODO : flash message !
			flash.success(
				"L'ordre des formules à bien été enregistré !"
			)
		})
		.catch((res) => {
			// toDO: Show error message
			console.warn("update ordering order: ", res.data)
		})
}

function loadFormular() {
	return axios
		.get(route("chapters.formulas.index", [theSlug.value]))
		.then((res) => {
			theFormular.value = res.data.formular
			// Add the new chapters to the list
			res.data.chapters.forEach((chapter) => {
				if (
					!themeChapters.value.find(
						(x) => x.slug === chapter.slug
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
}

function updateFormular(slug: string) {
	theSlug.value = slug
	loadingState.value = true
	loadFormular()
}

function destroyFormula(id: number){
	theFormular.value = theFormular.value.filter(x=>x.id!==id)
}
</script>

<template>
	<section ref="formular">
		<div class="px-5 flex justify-between">
			<h3 class="text-xl uppercase font-extralight mb-2">
				Formulaires
			</h3>
		</div>

		<div
			v-if="themeChapters.length > 0 || editMode.enable"
			class="flex flex-wrap items-center gap-1 px-5 min-h-[3em]"
		>
			<button
				v-for="item of themeChapters"
				:key="item.slug"
				v-katex.auto="item.title"
				v-theme.btn.text="item.theme.id"
				:class="{
					'btn-xs text-xs': item.slug !== theSlug,
					'font-semibold': item.slug === props.chapterSlug,
				}"
				class="transition-all btn"
				@click="updateFormular(item.slug)"
			/>
		</div>

		<div v-if="theFormular.length > 0 || editMode.enable">
			<div
				v-if="loadingState"
				class="px-5 grid place-items-center min-h-[10em]"
			>
				à la recherche des formules dans un très gros livre
			</div>
			<draggable
				v-else
				v-model="theFormular"
				:class="props.responsive ? 'lg:columns-2 xl:columns-3' : ''"
				class="columns-xs space-y-5 "
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !$page.props.auth.can.admin,
				}"
				@end="updateFormulasOrder"
			>
				<template #item="{ element }: {element: FormulaInterface}">
					<formula-show
						:formula="element"
						@destroy="destroyFormula"
					/>
				</template>
				<template #footer>
					<footer>
						<div
							v-show="editMode.enable"
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
	</section>
</template>
