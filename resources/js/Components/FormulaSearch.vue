<!--
Point d'édition unique des formules.
- Sans chapitre (currentChapterId = null) : bibliothèque globale, filtrable (recherche + thème),
  toggle orphelines, création d'orpheline, suppression d'orphelines.
- Avec un chapitre : formulaire du chapitre, réordonnable (draggable), related chapters,
  création attachée, rattachement d'une formule existante, détachement.
Le tag « Aussi dans… » de FormulaShow bascule simplement le contexte (book.update(id)).
-->
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {FormulaInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import PleaseWait from "@/Components/Ui/PleaseWait.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTheme from "@/Components/Form/FormTheme.vue"
import FormulaShow from "@/Components/Blocks/FormulaShow.vue"
import FormulaPicker from "@/Components/Chapters/FormulaPicker.vue"
import {useFormular} from "@/Composables/useFormular.ts"
import {useIsAdmin} from "@/Composables/useHelpers.ts"

const props = withDefaults(defineProps<{
		chapterId?: number,
		themeId?: number,
		responsive?: boolean
	}>(),
	{
		chapterId: undefined,
		themeId: undefined,
		responsive: false
	})

const editMode = useStoreEditMode()
const book = useFormular(props.chapterId)

const showPicker = ref(false)

// Filtres (mode bibliothèque principalement).
const search = ref("")
const themeFilter = ref<number | undefined>(props.themeId)
const orphansOnly = ref(false)

const isChapterMode = computed(() => book.currentChapterId.value !== null)

const filterActive = computed(() =>
	search.value.trim() !== "" || themeFilter.value !== undefined || orphansOnly.value
)

// Réordonnancement : uniquement admin, en mode chapitre, et sans filtre actif (sinon ambigu).
const reorderEnabled = computed(() =>
	useIsAdmin() && isChapterMode.value && !filterActive.value
)

function matchesSearch(item: FormulaInterface): boolean {
	const value = search.value.trim().toLowerCase()
	if (value === "") {
		return true
	}
	return (item.block.title?.toLowerCase().includes(value) ?? false) ||
		(item.block.body?.toLowerCase().includes(value) ?? false)
}

// Filtre appliqué par masquage (v-show) sur la liste maître (toujours complète) :
// en mode chapitre, on ne montre que les formules du chapitre ; puis les filtres.
function isVisible(item: FormulaInterface): boolean {
	const chapterId = book.currentChapterId.value
	if (chapterId !== null && !item.chapters.some(c => c.id === chapterId)) {
		return false
	}
	if (orphansOnly.value && item.chapters.length !== 0) {
		return false
	}
	if (themeFilter.value !== undefined && item.theme_id !== themeFilter.value) {
		return false
	}
	return matchesSearch(item)
}

const hasVisible = computed(() => book.formular.value.some(isVisible))

// Ids déjà rattachés au chapitre courant : exclus du picker de rattachement.
const attachedIds = computed(() => {
	const id = book.currentChapterId.value
	if (id === null) {
		return []
	}
	return book.formular.value
		.filter(f => f.chapters.some(c => c.id === id))
		.map(f => f.id)
})

// Titre du chapitre courant, pour l'en-tête de contexte.
const currentChapterTitle = computed(() => {
	const id = book.currentChapterId.value
	if (id === null) {
		return ""
	}
	const related = book.relatedChapters.value.find(c => c.id === id)
	if (related) {
		return related.title
	}
	for (const formula of book.formular.value) {
		const chapter = formula.chapters.find(c => c.id === id)
		if (chapter) {
			return chapter.title
		}
	}
	return ""
})

function createFormula() {
	const id = book.currentChapterId.value
	if (id !== null) {
		book.formula.add(id)
	} else {
		book.formula.addOrphan()
	}
}

onMounted(() => {
	book.load()
})
</script>

<template>
	<div class="flex flex-col gap-3">
		<!-- En-tête de contexte : chapitre courant + related, ou bibliothèque globale. -->
		<header class="flex flex-wrap items-center gap-2 md:gap-3">
			<template v-if="isChapterMode">
				<span class="text-xs uppercase opacity-60">Chapitre :</span>
				<span
					v-katex.auto="currentChapterTitle"
					class="font-semibold"
				/>
				<button
					type="button"
					class="cursor-pointer opacity-70 hover:opacity-100"
					title="Revenir à la bibliothèque globale"
					@click="book.update(null)"
				>
					<i class="bi bi-x-circle" />
				</button>
			</template>
			<span
				v-else
				class="text-xs uppercase opacity-60"
			>
				Bibliothèque globale — aucun chapitre sélectionné
			</span>
		</header>

		<!-- Related chapters (mode chapitre). -->
		<div
			v-if="book.relatedChapters.value.length > 0"
			class="flex flex-wrap items-center gap-2 md:gap-3"
		>
			<sc-button
				v-for="item of book.relatedChapters.value"
				:key="item.id"
				:theme="item.theme_id"
				:outline="item.id !== book.currentChapterId.value"
				xs
				@click="book.update(item.id)"
			>
				<div v-katex.auto="item.title" />
			</sc-button>
		</div>

		<!-- Barre de filtre. -->
		<div class="flex flex-wrap items-end gap-3">
			<form-input
				v-model="search"
				class="flex-1 min-w-[12rem]"
				clearable
				label="rechercher une formule"
				name="formula-search"
				sm
			/>
			<form-theme
				v-model="themeFilter"
				deselectable
				label="thème"
				sm
			/>
			<sc-button
				v-if="!isChapterMode"
				v-admin
				:outline="!orphansOnly"
				type="warning"
				xs
				@click="orphansOnly = !orphansOnly"
			>
				<i class="bi bi-unlink" />
				orphelines
			</sc-button>
		</div>

		<!-- Chargement. -->
		<div
			v-if="book.loadingState.value"
			class="px-5 grid place-items-center min-h-[10em]"
		>
			<div class="flex flex-col gap-5 items-center">
				<div>à la recherche des formules dans un très gros livre</div>
				<please-wait />
			</div>
		</div>

		<template v-else>
			<draggable
				v-model="book.formular.value"
				:class="props.responsive ? 'lg:columns-2 xl:columns-3' : ''"
				class="columns-xs space-y-4"
				handle=".draggable-handle"
				item-key="id"
				v-bind="{
					animation: 200,
					disabled: !reorderEnabled,
				}"
				@end="book.updateOrder()"
			>
				<template #item="{ element }: {element: FormulaInterface}">
					<div
						v-show="isVisible(element)"
						class="break-inside-avoid-column"
					>
						<!-- Badge orpheline (bibliothèque, admin). -->
						<div
							v-if="!isChapterMode && element.chapters.length === 0"
							v-admin
							class="flex items-center justify-between gap-2
								px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/40
								text-amber-800 dark:text-amber-200 rounded-t"
						>
							<span class="flex items-center gap-1">
								<i class="bi bi-unlink" />
								orpheline — rattachée à aucun chapitre
							</span>
							<confirm-button
								xs
								@confirm="book.formula.deleteOrphan(element.id)"
							>
								<i class="bi bi-trash" />
								<template #confirm>
									<i class="bi bi-hand-thumbs-up" />
								</template>
							</confirm-button>
						</div>
						<formula-show
							:formula="element"
							:library="!isChapterMode"
							:chapter-context="book.currentChapterId.value"
							@moved="book.formula.refresh"
							@detach="book.formula.detach(element.id)"
							@select-chapter="book.update"
						/>
					</div>
				</template>
			</draggable>

			<div
				v-if="!hasVisible"
				class="px-5 py-8 text-center opacity-60"
			>
				Aucune formule à afficher.
			</div>

			<!-- Actions d'édition (admin + mode édition). -->
			<footer
				v-show="editMode.enable"
				v-admin
				class="flex flex-wrap gap-3 mt-2"
			>
				<sc-button
					type="add"
					@click="createFormula"
				>
					{{ isChapterMode ? 'Ajouter une formule' : 'Ajouter une formule orpheline' }}
				</sc-button>
				<sc-button
					v-if="isChapterMode"
					type="add"
					outline
					@click="showPicker = true"
				>
					Rattacher une formule existante
				</sc-button>
			</footer>
		</template>

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
</template>
