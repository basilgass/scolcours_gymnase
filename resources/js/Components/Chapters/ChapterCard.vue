<script lang="ts" setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {AxiosErrorMessage} from "@/types"
import {ChapterShowInterface} from "@/types/modelInterfaces.ts"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"
import {ref} from "vue"


const props = defineProps<{
	chapter: ChapterShowInterface
}>()

const editMode = useStoreEditMode()

const isActive = ref<boolean>(!!props.chapter.active)

function activate() {
	isActive.value = !isActive.value
	axios.patch(
		route('toggleChapterActive', [props.chapter.slug]),
		{active: isActive.value}
	).catch((res: AxiosErrorMessage) => {
		console.log(res.response.data.message)
	})

}
</script>

<template>
	<div class="w-full break-inside-avoid-column">
		<div
			v-admin="editMode.enable"
			v-theme.bg.text.admin
			class="px-3 py-1 text-xs flex justify-between"
		>
			<div>id: {{ chapter.id }}</div>
			<div class="flex gap-4">
				<button @click="activate">
					<i
						:class="isActive ? 'bi bi-eye':'bi bi-eye-slash'"
					/>
				</button>
			</div>
		</div>

		<InertiaLink
			:class="{ 'opacity-30 hover:opacity-70 transition-all': !isActive }"
			:href="route('themes.chapters.intro', [usePage().props.theme.slug, chapter.slug])"
			class="text-xl
					block h-full rounded-b-lg shadow space-y-3
					bg-white dark:bg-gray-800
					cursor-pointer
					transition-all"
		>
			<h3
				v-katex.auto="chapter['title']"
				v-theme.bg.text
				class="text-xl px-5 py-3 truncate"
			/>

			<markdown-it
				:text="chapter['block']['body']"
				class="px-5 pb-3"
			/>
		</InertiaLink>
	</div>
</template>
