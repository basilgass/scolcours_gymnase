<script
	lang="ts"
	setup
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {getModule, MODULE_TYPES} from "@/scolcours"

import {ToolInterface} from "@/types/modelInterfaces.ts"
import {computed, nextTick, provide, ref, useTemplateRef, watch} from "vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ToolsSearch from "@/Components/Tools/Parts/ToolsSearch.vue"
import {useMagicKeys} from "@vueuse/core"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	tool: ToolInterface
}>()

provide("toolSlug", props.tool.slug)

const toolComponent = computed(() => {
	return getModule(props.tool.slug, MODULE_TYPES.TOOLS)
})

const showDialog = ref(false)

useMagicKeys({
	passive: false,
	onEventFired: (e) => {
		if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
			e.preventDefault()
			showDialog.value = true
		}
	}
})

const toolsSearchRef = useTemplateRef<InstanceType<typeof ToolsSearch>>('toolsSearchRef')
watch(showDialog, (newVal) => {
	if(newVal){
		// Focus
		nextTick(()=>{
			toolsSearchRef.value.focus()
		})

	}
})


</script>
<template>
	<section>
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
		<keep-alive>
			<tools-search ref="toolsSearchRef" />
		</keep-alive>
	</dialog-modal>
</template>
