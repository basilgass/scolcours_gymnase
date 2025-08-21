<script lang="ts" setup>
import WidgetForm from "@/Components/WidgetForm.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {PropType} from "vue"
import type {WidgetInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage} from "@/types"

defineOptions({layout: LayoutMain})

defineProps({
	widgets: {type: Object as PropType<WidgetInterface[]>, required: true}
})

function refreshWidgets() {
	// ROUTE : route does not exist
	axios
		.get(
			route("api.admin.widgets.refresh")
		)
		.then(() => {
			router.reload()
		})
		.catch(
			(err: AxiosErrorMessage) => console.warn(err)
		)
}
</script>
<template>
	<div class="scolcours-container">
		<div class="flex justify-between items-baseline">
			<h1 class="text-3xl pt-5 mb-10">
				Gestion des widgets
			</h1>
			<sc-button
				@click="refreshWidgets"
			>
				mise à jour
			</sc-button>
		</div>

		<div class="flex flex-col gap-4">
			<filtered-list
				:list="widgets"
				list-class="flex flex-col gap-5"
				title="chapitres"
				:no-filter-if-less-than="0"
			>
				<template #card="{ item }:{ item: WidgetInterface}">
					<div
						v-theme.border="item.theme_id"
						class="bg-content border-l-8 px-5 py-2 rounded-r-lg"
					>
						<div
							:class="!item.control?'text-red-600':''"
							class="font-semibold"
						>
							{{ item.name }} <span class="text-xs ml-4">id: {{ item.id }}</span>
						</div>
						<widget-form :widget="item" />
					</div>
				</template>
			</filtered-list>
		</div>
	</div>
</template>


