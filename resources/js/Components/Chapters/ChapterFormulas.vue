<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script
	lang="ts"
	setup
>
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {AxiosResponseModel, flashInterface} from "@/types"
import {ChapterInterface, FormulaInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {inject, onMounted, ref, useTemplateRef} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {router} from "@inertiajs/vue3"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = withDefaults(defineProps<{
		chapter: ChapterInterface,
		responsive?: boolean
	}>(),
	{
		responsive: false
	})

const currentChapterId = ref(props.chapter.id)
const formular = useTemplateRef<HTMLElement>('formular')

const theFormular = ref([]),
	themeChapters = ref<ChapterInterface[]>([]),
	loadingState = ref(false),
	theFormularErrors = ref("")

const flash = useStoreFlashMessage()
const editMode = useStoreEditMode()

function addFormula() {
	axios
		.post(route("api.admin.chapters.formulas.store", [props.chapter.id]), {})
		.then((res: AxiosResponseModel<FormulaInterface>) => {
			flash.success("formule créée")
			theFormular.value.push(res.data)

			// Go and edit the new formula
			router.visit(route('admin.blocks.edit', {id: res.data.block.id}))
		})
}

function updateFormulasOrder() {
	axios
		.post(route("api.admin.formulas.updateOrder"), {
			order: theFormular.value.map((x, index) => {
				return {id: x.id, order: index}
			})
		})
		.then(() => {
			flash.success(
				"L'ordre des formules à bien été enregistré !"
			)
		})
		.catch((res) => {
			flash.error("Erreur lors de la mise à jour de l'ordre des formules")
			console.warn("update ordering order: ", res.data)
		})
}

function loadFormular() {
	loadingState.value = true

	axios.get(route("api.chapters.formulas.index", {
		chapter: props.chapter.id
	}))
		.then((res) => {
			theFormular.value = res.data.formular
			// Add the new chapters to the list
			res.data.chapters.forEach((chapter) => {
				if (
					!themeChapters.value.find(
						(x) => x.id === chapter.id
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

function updateFormular(value: ChapterInterface) {
	currentChapterId.value = value.id
	loadingState.value = true
	loadFormular()
}

function destroyFormula(id: number) {
	theFormular.value = theFormular.value.filter(x => x.id !== id)
}

onMounted(() => {
	loadFormular()
})
</script>

<template>
	<section ref="formular">
		<div class="flex gap-5 items-baseline">
			<h3 class="uppercase font-extralight mb-2">
				Formulaires
			</h3>
		</div>

		<div
			v-if="themeChapters.length > 0 || editMode.enable"
			class="flex flex-wrap items-center gap-1 mb-3 min-h-[3em]"
		>
			<sc-button
				v-for="item of themeChapters"
				:key="item.id"
				:theme="item.theme_id"
				:outline="item.id !== currentChapterId"
				:active="item.id === chapter.id"
				xs
				@click="updateFormular(item)"
			>
				<div v-katex.auto="item.title" />
			</sc-button>
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
							<sc-button
								type="add"
								@click="addFormula"
							>
								Ajouter une formule
							</sc-button>
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
