AdminChaptersPage.vue
<script lang="ts" setup>
import { PropType } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ToolInterface } from "@/types"
import FilteredList from "@/Components/Ui/FilteredList.vue"

defineOptions({ layout: LayoutMain })
defineProps({
	tools: { type: Object as PropType<ToolInterface[]>, required: true }
})

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des outils
		</h1>

		<filtered-list
			:list="tools"
			list-class="grid grid-cols-1 gap-3"
		>
			<template #card="{item}:{item: ToolInterface}">
				<div
					:key="item.id"
					class="bg-white border rounded"
				>
					<header class="flex justify-between border-b px-3 py-2">
						<Link
							as="div"
							class="cursor-pointer"
							:href="route('tools.tool', [item.slug])"
						>
							<h3 class="text-lg leading-6 font-medium text-gray-900">
								{{ item.title }}
							</h3>
							<p class="mt-1 max-w-2xl text-sm text-gray-500">
								{{ item.slug }}
							</p>
						</Link>
						<div class="text-xs text-right">
							<Link :href="route('tools.edit', item.id)">
								<i class="bi bi-pencil" />
							</Link>
							<div class="text-gray-500">
								{{ item.updated_at }}
							</div>
						</div>
					</header>
					<main class="px-3 py-3 font-extralight">
						{{ item.body }}
					</main>
				</div>
			</template>
		</filtered-list>
	</section>
</template>

<style scoped></style>
