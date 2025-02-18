AdminChaptersPage.vue
<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ToolInterface} from "@/types/modelInterfaces.ts"
import {inject, PropType} from "vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import axios from "axios"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import type {flashInterface} from "@/types"
import ToolEditItem from "@/Components/Elements/ToolEditItem.vue"

defineOptions({layout: LayoutMain})
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


