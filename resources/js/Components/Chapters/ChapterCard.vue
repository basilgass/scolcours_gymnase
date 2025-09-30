<script lang="ts" setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {AxiosErrorMessage} from "@/types"
import {ChapterShowInterface} from "@/types/modelInterfaces.ts"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"
import {computed, ref} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"


const props = defineProps<{
	chapter: ChapterShowInterface
}>()

const themeSlug = computed<string>(() => usePage().props.themes[props.chapter.theme_id].slug)

const editMode = useStoreEditMode()

const flash = useStoreFlashMessage()


const isActive = ref<boolean>(!!props.chapter.active)

function activate() {
	isActive.value = !isActive.value

	axios.patch(
		route('api.admin.chapters.toggleActive', {
			chapter: props.chapter.slug
		}),
		{active: isActive.value}
	).then(() => {
		flash.success(`${props.chapter.slug} est ${isActive.value ? 'visible' : 'caché'}.`)
	}).catch((res: AxiosErrorMessage) => {
		console.log(res.response.data.message)
	})

}
</script>

<template>
	<div class="w-full break-inside-avoid-column">
		<div
			v-admin="editMode.enable"
			v-theme.admin
			class="px-3 py-1 text-xs flex justify-between"
		>
			<div>id: {{ chapter.id }}</div>
			<div class="flex gap-4">
				<button
					@click="activate"
					class="cursor-pointer"
				>
					<i
						:class="isActive ? 'bi bi-eye':'bi bi-eye-slash'"
					/>
				</button>
			</div>
		</div>

		<InertiaLink
			:class="{ 'opacity-30 hover:opacity-70 transition-all': !isActive }"
			:href="route('themes.chapters.show', {
				theme: themeSlug,
				chapter: chapter.slug
			})"
			class="text-xl
					block h-full rounded-b-lg shadow
					cursor-pointer
					transition-all"
		>
			<h3
				v-katex.auto="chapter['title']"
				v-theme.bg.text
				class="text-xl px-5 py-3 truncate  rounded-t"
			/>

			<markdown-it
				:text="chapter['block']['body']"
				class="px-5 py-3 bg-content border-x border-b"
			/>
		</InertiaLink>
	</div>
</template>
