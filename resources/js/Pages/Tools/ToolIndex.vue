<script
	lang="ts"
	setup
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ToolsSearch from "@/Components/Tools/Parts/ToolsSearch.vue"

defineOptions({layout: LayoutMain})

</script>
<template>
	<section class="scolcours-container">
		<tools-search />
	</section>
</template>
