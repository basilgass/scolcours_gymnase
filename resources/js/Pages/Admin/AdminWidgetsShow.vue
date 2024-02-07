<script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
		layout: LayoutMain,
	}
</script>

<script setup lang="ts">
	import WidgetForm from "@/Components/WidgetForm.vue"

	const props = defineProps({
		widgets: { type: Object, required: true }
	})

</script>
<template>
	<h1 class="text-3xl pt-5 mb-10">
		Gestion des widgets
	</h1>

	<div class="flex flex-col gap-4">
		<div
			class="bg-white border-l-8 px-5 py-2 rounded-r-lg"
			v-for="widget in widgets"
			:key="widget.id"
			v-theme.border="widget.theme_id"
		>
			<div
				class="font-semibold"
				:class="!widget.control?'text-red-600':''"
			>
				{{ widget.name }} <span class="text-xs ml-4">id: {{ widget.id }}</span>
			</div>

			<widget-form :widget="widget" />
		</div>
	</div>
</template>

<style scoped></style>
