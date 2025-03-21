<script
	lang="ts"
	setup
>
import LayoutMain from "@/Layouts/LayoutMain.vue"

import {ToolInterface} from "@/types/modelInterfaces.ts"
import {PropType, provide, ref} from "vue"
import ToolsSearch from "@/Components/Tools/Parts/ToolsSearch.vue"

defineOptions({layout: LayoutMain})

defineProps({
	tools: {
		type: Object as PropType<ToolInterface[]>, default: () => {
		}
	}
})

</script>
<template>
	<section class="scolcours-container">
		<tools-search />
	</section>
</template>
