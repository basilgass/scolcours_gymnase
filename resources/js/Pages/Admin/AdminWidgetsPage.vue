<script lang="ts" setup>
import WidgetForm from "@/Components/WidgetForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { PropType } from "vue"
import type { widgetInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })

defineProps({
	widgets: { type: Object as PropType<widgetInterface[]>, required: true }
})

</script>
<template>
	<h1 class="text-3xl pt-5 mb-10">
		Gestion des widgets
	</h1>

	<div class="flex flex-col gap-4">
		<div
			v-for="widget in widgets"
			:key="widget.id"
			v-theme.border="widget.theme_id"
			class="bg-white border-l-8 px-5 py-2 rounded-r-lg"
		>
			<div
				:class="!widget.control?'text-red-600':''"
				class="font-semibold"
			>
				{{ widget.name }} <span class="text-xs ml-4">id: {{ widget.id }}</span>
			</div>

			<widget-form :widget="widget" />
		</div>
	</div>
</template>

<style scoped></style>
