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
				{{ props.challenge.chapter.title }}
			</Link>
		</div>

		<!-- The title of the challenge -->
		<div class="flex justify-between">
			<h1 class="text-2xl mb-4">
				{{ props.challenge.title }}
			</h1>

			<button
				v-if="$page.props.auth.can.admin"
				class="text-xs"
				@click="showEditForm = true"
			>
				<i class="bi bi-pencil mr-2" /> {{ props.challenge.id }}
			</button>
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
	}),
	updatePost = function (p) {
		thePost.value = p
	}
</script>
