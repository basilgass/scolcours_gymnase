<script lang="ts" setup>

// TODO: Permettre la modification des illustrations directement.
// TODO: pagination des illustrations
// TODO: chargement asynchrone...
// REFORMAT : (LOW) Refactor this component to use the new syntax


import {computed, defineAsyncComponent, PropType, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import type {IllustrationInterface} from "@/types/modelInterfaces"
import ErrorBoundary from "@/Components/errorBoundary.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

const asyncComponent = defineAsyncComponent(() => {
	return import('@/Components/Pi/PiDrawParser.vue')
})
defineOptions({layout: LayoutAdmin})

const props = defineProps({
	illustrations: {type: Object as PropType<IllustrationInterface[]>, required: true}
})

const search = ref("")
const listOfIllustrations = computed<IllustrationInterface[]>(() => {

	if (showErrorsOnly.value) {
		return props.illustrations.filter(item => illustrationsWithErrors.value.includes(item.id))
	}

	if (search.value === "") {
		return props.illustrations
	}

	const searchLC = search.value.toLowerCase()

	return props.illustrations
		.filter(item =>
			item.parameters?.toLowerCase().includes(searchLC) ||
			item.code.toLowerCase().includes(searchLC)
		)
})

const illustrationsWithErrors = ref<number[]>([])
const showErrorsOnly = ref<boolean>(false)
const showIllustration = ref<boolean>(false)
</script>
<template>
	<h1 class="text-3xl pt-5">
		Contrôle des illustrations
	</h1>


	<div>
		<form-maker
			v-model="search"
			:label="`filtrer (${listOfIllustrations.length} / ${props.illustrations.length})`"
			name="filtrer"
		/>
	</div>

	<div @click="showErrorsOnly=!showErrorsOnly">
		erreurs : {{ illustrationsWithErrors }}
	</div>


	<section class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
		<div
			v-for="illustration in listOfIllustrations"
			:key="illustration.id"
			class="bg-content border rounded-lg shadow-md"
		>
			<h2 class="mb-3 px-3 py-1 bg-slate-300 dark:bg-slate-600 flex justify-between">
				<span v-katex.auto="illustration.title" />

				<span class="text-xs">{{ illustration.id }}</span>
			</h2>
			<div class="p-2 grid grid-cols-1 md:grid-cols-2 gap-3 font-code">
				<div class="flex flex-col gap-3">
					<form-maker
						v-model="illustration.parameters"
						font-code
						sm
					/>
					<form-maker
						v-model="illustration.code"
						:rows="illustration.code.split('\n').length"
						:wrap="false"
						font-code
						language="json"
						sm
						type="codearea"
					/>
				</div>

				<error-boundary
					v-if="showIllustration"
					:reset-key="illustration.parameters + illustration.code"
					@error="illustrationsWithErrors.push(illustration.id)"
				>
					<suspense>
						<asyncComponent :draw="illustration" />
						<template #fallback>
							Chargement...
						</template>
					</suspense>
					<template #error>
						Erreur dans l'illustration
					</template>
				</error-boundary>
			</div>
		</div>
	</section>
</template>

