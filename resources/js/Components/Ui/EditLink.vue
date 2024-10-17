<script
	setup
	lang="ts"
>

import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"

defineProps({
	id: { type: Number, required: true },
	routeName: { type: String, required: true },
	label: { type: String, default: "id: " },
	inline: { type: Boolean, default: false }
})

const  editMode  = useStoreEditMode()
</script>

<template>
	<InertiaLink
		v-admin="editMode.enable"
		class="text-xs"
		:class="inline ? '' : 'absolute top-0 right-0 bg-white/30 rounded px-3 py-1 z-10'"
		:href="route(routeName, [id])"
	>
		{{ label }} {{ id }} <i class="bi bi-pencil" />
	</InertiaLink>
</template>

<style scoped></style>
