<script
	setup
	lang="ts"
>

import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

withDefaults(defineProps<{
	label: string | number,
	href: string
	inline?: boolean
}>(), {
	inline: false
})

const editMode = useStoreEditMode()
</script>

<template>
	<sc-button
		v-if="label && href"
		v-admin="editMode.enable"
		outline
		type="edit"
		xs
		:href
		class="font-code"
		:class="inline ? '' : 'absolute top-0 right-0 z-10'"
	>
		{{ label }} <i class="bi bi-pencil" />
	</sc-button>
</template>


