AdminChaptersPage.vue
<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {ToolInterface} from "@/types/modelInterfaces.ts"
import {PropType} from "vue"
import ToolEditItem from "@/Components/Elements/ToolEditItem.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})
defineProps({
	tools: {type: Object as PropType<ToolInterface[]>, required: true}
})

</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des outils
		</h1>

		<filtered-list
			:list="tools"
			list-class="grid grid-cols-1 gap-16"
		>
			<template #card="{ item }: { item: ToolInterface }">
				<tool-edit-item :tool="item" />
			</template>
		</filtered-list>
	</section>
</template>


