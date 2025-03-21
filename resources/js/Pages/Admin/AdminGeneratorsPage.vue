<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {PropType} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces.ts"
import GeneratorItem from "@/Components/Elements/GeneratorItem.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})
defineProps({
	generators: {type: Object as PropType<GeneratorInterface[]>, required: true}
})

</script>

<template>
	<main
		class="scolcours-container"
	>
		<sc-button
			type="danger"
			@click="useMenuScrollToData('withErrors', true)"
		>
			Rechercher la première erreur
		</sc-button>
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


