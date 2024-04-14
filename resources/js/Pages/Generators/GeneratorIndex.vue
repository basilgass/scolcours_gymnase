<script lang="ts" setup>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import { PropType } from "vue"
import { GeneratorInterface } from "@/types/modelInterfaces"
import FilteredList from "@/Components/Ui/FilteredList.vue"

defineOptions({ layout: LayoutMain })

defineProps({
	generators: { type: Object as PropType<GeneratorInterface[]>, required: true }
})
</script>

<template>
	<section class="scolcours-container">
		<h1>Generateur </h1>

		<filtered-list
			:item-background="(item) => item.theme_id"
			:item-title="(item)=>item.title===''?item.slug:item.title"
			:list="generators"
			:route-data="(item) => [item.id]"
			:route-name="'generators.edit'"
			title="générateurs"
		/>
	</section>
</template>

<style scoped>

</style>
