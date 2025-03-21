<script
	lang="ts"
	setup
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {getModule, MODULE_TYPES} from "@/scolcours"

import {ToolInterface} from "@/types/modelInterfaces.ts"
import {computed, provide, ref} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ToolsSearch from "@/Components/Tools/Parts/ToolsSearch.vue"

defineOptions({layout: LayoutMain})


const props = defineProps<{
	tool: ToolInterface
}>()

provide("toolSlug", props.tool.slug)

const toolComponent = computed(() => {
	return getModule(props.tool.slug, MODULE_TYPES.TOOLS)
})

const showDialog = ref(false)

</script>
<template>
	<section class="scolcours-container">
		<div v-if="toolComponent">
			<!-- Title -->
			<div class="flex justify-between items-baseline my-4">
				<h2 class="text-2xl font-extralight">
					{{ tool.title }}
				</h2>
				<button @click="showDialog = true">
					<span class="hidden md:inline">rechercher</span> <i class="bi bi-search" />
				</button>
			</div>

			<div
				class="bg-content border
						rounded-sm px-3 py-2"
			>
				<suspense>
					<component :is="toolComponent" />
					<template #fallback>
						<div
							class="font-code h-[80vh] grid place-items-center"
						>
							Chargement du composant
						</div>
					</template>
				</suspense>
			</div>
		</div>
	</section>

	<dialog-modal
		v-model="showDialog"
		class="px-5 pb-5"
	>
		<tools-search />
	</dialog-modal>
</template>
