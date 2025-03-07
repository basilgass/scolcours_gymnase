<!--
En-tête d'un challenge.
Contient le bouton de retour au chapitre, le titre, la description et l'édition
-->
<script
	lang="ts"
	setup
>

import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import type { ChallengeInterface } from "@/types/modelInterfaces"
import { PropType } from "vue"

const props = defineProps({
	challenge: { type: Object as PropType<ChallengeInterface>, required: true }
})

const  editMode  = useStoreEditMode()
</script>

<template>
	<header
		v-theme.bg.text
		class="py-2 lg:flex-row justify-between bg-opacity-80"
	>
		<div class="scolcours-container">
			<!-- The title of the challenge -->
			<div class="flex justify-between items-baseline">
				<h1
					v-katex.auto="props.challenge.title"
					class="text-2xl mb-4"
				/>
			</div>

			<!-- Header - return back -->
			<InertiaLink
				:href="route('themes.chapters.intro', [
					$page.props.theme.slug,
					props.challenge.chapter.slug,
				])
				"
				as="button"
				class="hover:pl-2 transition-all"
			>
				<i class=" bi bi-chevron-double-right mr-1" /><span v-katex.auto="props.challenge.chapter.title" />
			</InertiaLink>
		</div>
		<div
			v-admin="editMode.enable"
			v-theme.admin
			class="py-1 font-code text-sm -mb-2 mt-2"
		>
			<InertiaLink
				:href="route('challenges.edit', [props.challenge.id])"
				as="button"
				class="text-xs py-2 px-3 rounded-sm font-code flex place-content-center"
			>
				éditer le challenge (id: {{ props.challenge.id }}) <i class="bi bi-pencil ml-2" />
			</InertiaLink>
		</div>
	</header>
</template>
