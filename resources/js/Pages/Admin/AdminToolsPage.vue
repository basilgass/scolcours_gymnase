AdminChaptersPage.vue
<script lang="ts" setup>
import { PropType } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ToolInterface } from "@/types"

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
		<div class="w-full">
			<div
				v-for="tool in tools"
				:key="tool.slug"
				class="hover:bg-gray-200 flex justify-between px-4 py-2"
			>
				<div>
					<h3 class="text-lg leading-6 font-medium text-gray-900">
						{{ tool.title }}
					</h3>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">
						{{ tool.slug }}
					</p>
				</div>
				<div>
					<div>{{ tool.updated_at }}</div>
					<div>Is activated</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
