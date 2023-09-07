<!--
En-tête d'un challenge.
Contient le bouton de retour au chapitre, le titre, la description et l'édition
-->
<template>
	<header>
		<!-- Header - return back -->
		<div class="pt-4 mb-4">
			<Link
				:href="
					route('theme.chapter.intro', [
						$page.props.theme.slug,
						props.challenge.chapter.slug,
					])
				"
				class="text-sm text-gray-400 hover:text-gray-800 transition-colors"
			>
				<i class="bi bi-chevron-left text-xs mr-2" />retour à
				<span v-katex.auto="props.challenge.chapter.title" />
			</Link>
		</div>

		<!-- The title of the challenge -->
		<div class="flex justify-between">
			<h1
				v-katex.auto="props.challenge.title"
				class="text-2xl mb-4"
			/>

			<Link
				v-if="$page.props.auth.can.admin"
				class="text-xs hover:font-semibold"
				:href="route('challenges.edit', [props.challenge.id])"
			>
				éditer le challenge (id: {{ props.challenge.id }}) <i class="bi bi-pencil ml-2" />
			</Link>
		</div>

		<!-- the body / question of the challenge -->
		<markdown-it
			:text="props.challenge.block.body"
			class="mt-3"
		/>

		<!-- illustration -->
		<illustration-show
			v-if="props.challenge.block.illustrations.length"
			:illustration="props.challenge.block.illustrations[0]"
			class="max-w-[30em] mx-auto"
		/>
	</header>

	<!-- edition du challenge -->
	<div
		v-if="showEditForm && $page.props.auth.can.admin"
		v-admin
	>
		<component
			:is="editForm"
			v-model="showEditForm"
			:challenge="challenge"
		/>
	</div>
</template>

<script setup>

import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {computed, defineAsyncComponent, ref} from "vue"

const props = defineProps({
	challenge: {type: Object, required: true}
})

let showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(() =>
			import("@/Components/Challenges/ChallengeForm.vue")
		)
	})
</script>
