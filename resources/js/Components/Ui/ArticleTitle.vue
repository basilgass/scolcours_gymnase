<script lang="ts" setup>

import EditLink from "@/Components/Ui/EditLink.vue"
import {computed} from "vue"

const props = defineProps<{
	title: string,
	subtitle?: string,
	prefix?: string,
	head?: string,
	returnLink?: {
		label: string,
		url: string
	},
	editLink?: {
		label: string | number,
		url: string
	}
}>()

const editLabel = computed<string>(() => {
	if (!props.editLink) {
		return 'éditer'
	}

	return isNaN(+props.editLink.label) ?
		props.editLink.label as string :
		`id: ${props.editLink.label}`
})

</script>
<template>
	<header
		v-theme.text
		class="w-full"
	>
		<div class="flex gap-3 items-baseline justify-between">
			<div>
				<div
					v-if="prefix"
					v-katex.auto="prefix"
					class="text-lg lg:text-xl font-[400] -mb-2"
				/>
				<h1
					v-katex.auto="title ?? 'sans titre'"
					class="text-3xl lg:text-4xl font-[400]"
				/>
			</div>
			<slot name="right">
				<edit-link
					v-if="editLink"
					:label="editLabel"
					:href="editLink.url"
					inline
				/>
			</slot>
		</div>
		<h3
			v-if="subtitle!==null"
			class="text-xl mb-2"
			v-katex.auto="subtitle"
		/>
		<InertiaLink
			v-if="returnLink"
			:href="returnLink.url"
			class="hover:pl-2 transition-all"
		>
			<i class=" bi bi-chevron-double-right mr-1" />
			<span v-katex.auto="returnLink.label" />
		</InertiaLink>
	</header>
</template>
