<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {ChapterShowInterface} from "@/types/modelInterfaces"
import {useForm} from "@inertiajs/vue3"
import {PropType} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})
const props = defineProps({
	chapters: {
		type: Object as PropType<ChapterShowInterface[]>, required: true
	}
})

const Form = useForm({
	slug: "",
	active: false
})

function toggleChapterVisibility(slug, active) {
	Form.slug = slug
	Form.active = active
	Form.patch(`/admin/chapters/${slug}`, {
		preserveScroll: true
	})
}
</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des chapitres
		</h1>

		<article>
			<filtered-list
				:list="chapters"
				filter-by-theme
				list-class="grid grid-cols-1 gap-2"
			>
				<template #card="{ item }: { item: ChapterShowInterface }">
					<div
						:key="item.id"
						v-theme.bg.text="item.theme_id"
						class="flex justify-between rounded-lg px-3 py-2"
					>
						<InertiaLink
							:href="route('chapters.show', [item.id])"
							as="div"
							class="cursor-pointer"
						>
							<h3 class="text-lg leading-6 font-medium">
								{{ item.title }}
							</h3>
							<p class="mt-1 max-w-2xl text-sm text-gray-200">
								{{ item.slug }}
							</p>
						</InertiaLink>

						<div>
							<div>{{ item.updated_at }}</div>
							<sc-button
								:type="item.active ? 'success' : 'danger'"
								xs
								class="w-full"
								@click="
									toggleChapterVisibility(
										item.slug,
										!item.active,
									)
								"
							>
								{{ item.active ? "en ligne" : "caché" }}
							</sc-button>
						</div>
					</div>
				</template>
			</filtered-list>
		</article>
	</section>
</template>


