<script lang="ts" setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {AxiosErrorMessage} from "@/types"
import {ChapterShowInterface} from "@/types/modelInterfaces.ts"
import {router, usePage} from "@inertiajs/vue3"
import axios from "axios"
import {computed, ref} from "vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import Card from "@/Components/Ui/Card.vue";


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
		route('api.admin.chapters.active', {
			chapter: props.chapter.slug
		}),
		{active: isActive.value}
	).then(() => {
		flash.success(`${props.chapter.slug} est ${isActive.value ? 'visible' : 'caché'}.`)
	}).catch((res: AxiosErrorMessage) => {
		console.log(res.response.data.message)
	})

}

function onChapterCardClick() {
	router.visit(route('themes.chapters.show', {
		theme: themeSlug.value,
		chapter: props.chapter.slug
	}))
}
</script>

<template>
	<card
		header-theme
		:class="{ 'opacity-30 hover:opacity-70 transition-all': !isActive }"
		class="w-full cursor-pointer"
		@click="onChapterCardClick"
	>
		<template #header>
			<div
				v-admin="editMode.enable"
				v-theme.admin
				class="-mx-3 -mt-2 px-3 py-1 text-xs flex justify-between"
				@click.stop
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

			<h3
				v-katex.auto="chapter['title']"
				v-theme.bg.text
				class="text-xl truncate rounded-t py-2"
			/>
		</template>

		<markdown-it
			:text="chapter['block']['body']"
		/>
	</card>
</template>
