<!--
Affichage d'un formulaire, avec la possibilité de passer d'un formulaire du thème à un autre.
-->
<script
	lang="ts"
	setup
>
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import FormulaPicker from "@/Components/Chapters/FormulaPicker.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {ChapterInterface, FormulaInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useFormular} from "@/Composables/useFormular.ts"
import {useIsAdmin} from "@/Composables/useHelpers.ts"

const props = withDefaults(defineProps<{
		chapter: ChapterInterface,
		responsive?: boolean
	}>(),
	{
		responsive: false
	})

const editMode = useStoreEditMode()

const book = useFormular(props.chapter.id)

const showPicker = ref(false)

// Formules déjà rattachées au chapitre courant : exclues du picker de rattachement.
const attachedIds = computed(() => book.formular.value.map(f => f.id))

onMounted(() => {
	book.load()
})
</script>

<template>
	<section
		class="bg-content rounded-lg shadow-lg"
	>
		<div
			v-theme.bg.text
			class="p-3 flex justify-between items-center rounded-t-lg"
		>
			<h3 class="uppercase font-extralight flex gap-3 items-baseline">
				<i class="bi bi-table text-xl" />
				<p>formulaire</p>
			</h3>
			<div>
				<!-- no content -->
			</div>
		</div>

		<div
			class="p-3 flex flex-col gap-3"
		>
			<div
				v-if="book.relatedChapters.value.length > 0 || editMode.enable"
				class="flex flex-wrap items-center
					gap-2 md:gap-3 lg:gap-5"
			>
				<sc-button
					v-for="item of book.relatedChapters.value"
					:key="item.id"
					:theme="item.theme_id"
					:outline="item.id !== book.currentChapterId.value"
					:active="item.id === chapter.id"
					xs
					@click="book.update(item.id)"
				>
					<div v-katex.auto="item.title" />
				</sc-button>
			</div>

			<div v-if="book.formular.value.length > 0 || editMode.enable">
				<div
					v-if="book.loadingState.value"
					class="px-5 grid place-items-center min-h-[10em]"
				>
					à la recherche des formules dans un très gros livre
				</div>

				<draggable
					v-else
					v-model="book.formular.value"
					:class="props.responsive ? 'lg:columns-2 xl:columns-3' : ''"
					class="columns-xs space-y-5 "
					handle=".draggable-handle"
					item-key="id"
					v-bind="{
						animation: 200,
						disabled: !useIsAdmin(),
					}"
					@end="book.updateOrder()"
				>
					<template #item="{ element }: {element: FormulaInterface}">
						<formula-show
							:formula="element"
							@destroy="book.formula.destroy(element.id)"
							@detach="book.formula.detach(element.id)"
						/>
					</template>
				</draggable>

				<!-- Actions d'édition : hors du <draggable> (ce ne sont pas des items triables). -->
				<footer
					v-show="editMode.enable"
					v-admin
					class="flex flex-wrap gap-3 mt-5"
				>
					<sc-button
						type="add"
						@click="book.formula.add(book.currentChapterId.value ?? 0)"
					>
						Ajouter une formule
					</sc-button>
					<sc-button
						type="add"
						outline
						@click="showPicker = true"
					>
						Rattacher une formule existante
					</sc-button>
				</footer>
			</div>

			<div
				v-if="book.errors.value !== ''"
				class="text-red font-code text-xs"
				v-text="book.errors.value"
			/>

			<formula-picker
				v-if="showPicker"
				v-model="showPicker"
				:exclude-ids="attachedIds"
				@attach="book.formula.attach"
			/>
		</div>
	</section>
</template>
