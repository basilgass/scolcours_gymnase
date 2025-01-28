<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {PropType} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"

defineOptions({layout: LayoutMain})
defineProps({
	generators: {type: Object as PropType<GeneratorInterface[]>, required: true}
})

</script>

<template>
	<main
		class="scolcours-container"
	>
		<button
			class="btn btn-algebre"
			@click="useMenuScrollToData('withErrors', true)"
		>
			Rechercher la première erreur
		</button>
		<filtered-list
			:list="generators"
			list-class="flex flex-col gap-12"
		>
			<template #card="{ item }: { item: GeneratorInterface }">
				<generator-item :generator="item" />
			</template>
		</filtered-list>
	</main>
</template>

<style scoped>

</style>
