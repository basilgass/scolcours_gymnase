<script lang="ts" setup>

import BlockShow from "@/Components/Blocks/BlockShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {FormulaInterface} from "@/types/modelInterfaces.ts"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import {computed} from "vue"
import {useIsAdmin} from "@/Composables/useHelpers.ts"

const props = withDefaults(defineProps<{
	formula: FormulaInterface,
	// En mode bibliothèque globale (pas de chapitre courant) : les actions propres
	// au chapitre (déplacer, détacher) n'ont pas de sens et sont masquées.
	library?: boolean,
	// Chapitre courant : sert à afficher l'ordre pivot du bon chapitre et à exclure
	// ce chapitre de la mention « Aussi dans… ».
	chapterContext?: number | null
}>(), {
	library: false,
	chapterContext: null
})

const emits = defineEmits<{
	moved: [event: number]
	detach: [event: number]
	selectChapter: [id: number]
}>()

// Autres chapitres où la formule est utilisée. En contexte chapitre, on exclut le chapitre
// courant (« aussi dans… »). Le public ne voit que les chapitres actifs ; l'admin voit tout.
const displayChapters = computed(() => {
	const currentId = props.chapterContext
	const base = currentId == null
		? props.formula.chapters
		: props.formula.chapters.filter(c => c.id !== currentId)

	return useIsAdmin() ? base : base.filter(c => c.active)
})

// Ordre pivot affiché : celui du chapitre courant si présent, sinon l'ordre contextuel global.
const displayOrder = computed(() => {
	const currentId = props.chapterContext
	if (currentId == null) {
		return props.formula.order
	}
	return props.formula.chapters.find(c => c.id === currentId)?.order ?? props.formula.order
})

// La corbeille détache la formule du chapitre courant (elle survit dans la bibliothèque
// globale). Ce composant ne connaît pas le chapitre : le parent effectue l'appel API.
function detachFormula() {
	emits('detach', props.formula.id)
}
</script>

<template>
	<block-show
		v-theme.border="formula.theme_id"
		:block="formula.block"
		class="break-inside-avoid-column rounded-r shadow-sm border-l-4"
	>
		<template #adminLeft>
			<div class="text-xs flex gap-3 items-baseline">
				<i class="bi bi-arrows-move cursor-move draggable-handle" />
				<div class="font-code">
					F: {{ formula.id }} / B: {{ formula.block.id }} / O: {{ displayOrder }}
				</div>
			</div>
		</template>
		<template #adminRight>
			<div class="flex gap-3 items-baseline">
				<move-item-to
					v-if="!library"
					source="formula"
					:source-id="formula.id"
					target="chapter"
					@moved="emits('moved', formula.id)"
				/>
				<InertiaLink
					class="text-xs"
					:href="route('admin.blocks.edit', [formula.block.id])"
				>
					<i class="bi bi-pencil" />
				</InertiaLink>
				<confirm-button
					v-if="!library"
					xs
					btn-class=""
					@confirm="detachFormula"
				>
					<i class="bi bi-trash" />
					<template #confirm>
						<i class="bi bi-hand-thumbs-up" />
					</template>
				</confirm-button>
			</div>
		</template>
		<template #header>
			<div class="px-5 pt-2 space-y-1">
				<div class="flex justify-between items-baseline">
					<h2
						v-if="formula.block.title"
						v-theme.text="formula.theme_id"
						v-katex.auto="formula.block.title"
						class="text-xl font-extralight"
					/>
				</div>

				<!-- Chapitres où la formule est aussi utilisée (visible par tous). -->
				<div
					v-if="displayChapters.length > 0"
					class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs opacity-70"
				>
					<span>{{ library ? 'Utilisée dans :' : 'Aussi dans :' }}</span>
					<button
						v-for="chapter of displayChapters"
						:key="chapter.id"
						v-theme.text="chapter.theme_id"
						type="button"
						class="hover:underline cursor-pointer"
						:class="chapter.active ? '' : 'opacity-40 italic'"
						@click="emits('selectChapter', chapter.id)"
					>
						<span v-katex.auto="chapter.title" />
						<i
							v-if="!chapter.active"
							class="bi bi-eye-slash ml-1"
							title="chapitre désactivé"
						/>
					</button>
				</div>
			</div>
		</template>
	</block-show>
</template>
