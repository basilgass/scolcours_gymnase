<script setup lang="ts">
import {type ComponentPublicInstance, computed, type CSSProperties, nextTick, ref, useTemplateRef, watch} from "vue"
import {onClickOutside, useEventListener} from "@vueuse/core"
import type {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	choices: string[] | Record<string, string>
	labelMap?: (element: unknown) => string
}

const props = withDefaults(defineProps<Props>(), {
	labelMap: (element: unknown) => element as string
})
const value = defineModel<string | Record<string, string>>()
const emits = defineEmits<FormElementEmits>()

const wrapperRef = useTemplateRef<ComponentPublicInstance>('wrapper')
const triggerRef = useTemplateRef<HTMLDivElement>('trigger')
const menuRef = useTemplateRef<HTMLDivElement>('menu')
const {errors, expose} = useFormMaker(triggerRef)
defineExpose<FormElementExpose>(expose)

const MENU_MAX = 300 // équivalent de l'ancien max-h-75 (18.75rem)

const open = ref(false)
const activeIndex = ref(-1)
const menuStyle = ref<CSSProperties>({})

// Liste plate des valeurs sélectionnables (fonctionne pour string[] et Record).
const choiceValues = computed(() => Object.values(props.choices))

const currentValue = computed(() => {
	if (value.value === undefined) return 'choisir...'
	return (props.choices as Record<string, string>)[value.value as string] ?? value.value
})

function updatePosition() {
	const el = triggerRef.value
	if (!el || !open.value) return
	const r = el.getBoundingClientRect()
	const gap = 4
	const spaceBelow = window.innerHeight - r.bottom - gap
	const spaceAbove = r.top - gap
	const openUp = spaceBelow < MENU_MAX && spaceAbove > spaceBelow
	const maxHeight = Math.min(MENU_MAX, openUp ? spaceAbove : spaceBelow)
	menuStyle.value = {
		position: 'fixed',
		left: `${r.left}px`,
		width: `${r.width}px`,
		maxHeight: `${maxHeight}px`,
		...(openUp
			? {bottom: `${window.innerHeight - r.top + gap}px`}
			: {top: `${r.bottom + gap}px`})
	}
}

function scrollActiveIntoView() {
	nextTick(() => {
		const item = menuRef.value?.children[activeIndex.value] as HTMLElement | undefined
		item?.scrollIntoView({block: 'nearest'})
	})
}

function openMenu() {
	open.value = true
	// Focus indispensable pour que onKeydown (sur le trigger) capte les touches —
	// notamment Échap, qu'il faut intercepter avant le listener window du DialogModal.
	triggerRef.value?.focus()
	const idx = choiceValues.value.indexOf(value.value as string)
	activeIndex.value = idx >= 0 ? idx : 0
	updatePosition()
	scrollActiveIntoView()
}

function onSelect(choice: string) {
	value.value = choice
	open.value = false
	activeIndex.value = -1
	errors.value = []
	emits('errors', errors.value)
	emits('update', value.value)
}

function onKeydown(e: KeyboardEvent) {
	if (!open.value) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
			e.preventDefault()
			openMenu()
		}
		return
	}

	switch (e.key) {
		case 'ArrowDown':
			e.preventDefault()
			activeIndex.value = Math.min(activeIndex.value + 1, choiceValues.value.length - 1)
			scrollActiveIntoView()
			break
		case 'ArrowUp':
			e.preventDefault()
			activeIndex.value = Math.max(activeIndex.value - 1, 0)
			scrollActiveIntoView()
			break
		case 'Enter':
			e.preventDefault()
			if (activeIndex.value >= 0) {
				onSelect(choiceValues.value[activeIndex.value])
			}
			break
	}
}

// Repositionne au scroll (capture: true pour capter le scroll interne d'un conteneur
// comme un modal) et au resize. Le garde !open dans updatePosition évite tout calcul inutile.
useEventListener(window, ['scroll', 'resize'], updatePosition, {capture: true, passive: true})

// Échap ferme le menu en priorité (avant un éventuel DialogModal parent). Écoute en phase
// de CAPTURE sur window : ce listener précède donc tout listener bubble du parent, quel que
// soit l'élément focalisé. stopImmediatePropagation neutralise les autres réactions à Échap.
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
	if (!open.value || e.key !== 'Escape') return
	e.preventDefault()
	e.stopImmediatePropagation()
	open.value = false
	activeIndex.value = -1
}, {capture: true})

// Fermeture au clic extérieur. On vise tout le wrapper (bouton caret inclus) pour que
// re-cliquer le caret ne soit pas vu comme un clic extérieur — sinon onClickOutside fermerait
// le menu juste avant que le toggle du bouton ne le rouvre. Le menu téléporté est ignoré
// explicitement, sinon un clic sur une option serait considéré comme « extérieur ».
onClickOutside(wrapperRef, () => {
	open.value = false
	activeIndex.value = -1
}, {ignore: [menuRef]})

watch(open, (isOpen) => {
	if (isOpen) updatePosition()
})
</script>

<template>
	<form-maker-wrapper
		ref="wrapper"
		v-bind="{...$attrs, ...props}"
		btn="bi bi-caret-down-fill"
		@button-click.stop="open ? (open = false) : openMenu()"
	>
		<div
			ref="trigger"
			tabindex="0"
			class="relative"
			@keydown="onKeydown"
		>
			<div
				v-katex.auto="labelMap(currentValue)"
				class="px-2 py-1 w-full focus:outline-hidden focus:ring-0"
				@click="open ? (open = false) : openMenu()"
			/>
			<Teleport to="body">
				<div
					v-show="open"
					ref="menu"
					:style="menuStyle"
					class="select-menu overflow-y-auto shadow bg-content rounded z-60"
				>
					<div
						v-for="(choice, index) in choiceValues"
						:key="`choice-${index}`"
						v-katex.auto="labelMap(choice)"
						v-theme.border
						class="px-2 py-3 cursor-pointer transition-colors border-0"
						:class="[
							index === activeIndex ? 'bg-slate-200 dark:bg-slate-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700',
							choice === value ? 'border-l-8' : ''
						]"
						@click="onSelect(choice)"
						@mouseenter="activeIndex = index"
					/>
				</div>
			</Teleport>
		</div>
	</form-maker-wrapper>
</template>
