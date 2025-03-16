<script lang="ts" setup>
// TODO : should be moved in component directory
import { useTheme } from "@/Composables/useHelpers.ts"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { DeckInterface } from "@/types/modelInterfaces.ts"
import { router } from "@inertiajs/vue3"
import { computed } from "vue"

const props = defineProps<{
	deck: DeckInterface
}>()

const editMode = useStoreEditMode()

const theme = computed(() => {
	return useTheme(props.deck.theme_id)
})
</script>
<template>
	<div>
		<div
			v-admin="editMode.enable"
			v-theme.admin
			class="flex justify-between p-2 items-middle"
		>
			<div class="font-code text-xs">
				{{ deck.slug }}
			</div>
			<InertiaLink
				:href="route('decks.edit', [deck.slug])"
				class="cursor-pointer"
			>
				éditer <i class="bi bi-pencil" />
			</InertiaLink>
		</div>
		<div class="relative aspect-video group">
			<div
				v-theme.bg.text="theme.id === null ? 'bg-white text-black' : theme.id"
				class="absolute inset-0
							translate-x-2 translate-y-2
							opacity-30
							border rounded z-0"
			/>
			<div
				v-theme.bg.text="theme.id === null ? 'bg-white text-black' : theme.id"
				class="absolute inset-0
							translate-x-1 translate-y-1
							group-hover:translate-x-0 group-hover:translate-y-0
							transition-all duration-600 ease-in-out
							opacity-65
							border rounded z-0"
			/>
			<div
				v-theme.bg.text="theme.id === null ? 'bg-white text-black' : theme.id"
				class="absolute inset-0 z-10
							border rounded px-3 py-5
							group-hover:-translate-x-2 group-hover:-translate-y-2
							transition-all duration-600 ease-in-out
							grid place-items-center cursor-pointer"
				@click="router.visit(route('decks.show', deck.slug))"
			>
				<h3
					class="text-xl"
					v-katex.auto="deck.title"
				/>
			</div>
		</div>
	</div>
</template>
