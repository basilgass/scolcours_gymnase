<script setup lang="ts" generic="T extends { id: number, title: string }">

import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import {onMounted, ref, watch} from "vue"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"

const props = withDefaults(
	defineProps<{
		apiRoute?: string | null,
		autoLoad?: boolean,
		title?: string
	}>(),
	{
		title: 'modèles',
		apiRoute: null,
		autoLoad: false
	}
)

const emits = defineEmits<{
	selected: [ev: T],
	onLoaded: [ev: T[]]
}>()

defineSlots<{
	title(props: { item: T }): T,
	button(),
}>()

const items = ref<T[]>([])

function loadItems() {
	axios
		.get(props.apiRoute)
		.then((res: AxiosResponseModel<T[]>) => {
			items.value = res.data
			emits('onLoaded', res.data)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

onMounted(() => {
	if (props.apiRoute && props.autoLoad) loadItems()
})

watch(() => props.apiRoute, (newRoute: string | null, oldRoute: string | null) => {
	if (newRoute === null) {
		items.value = []
		return
	}

	if (newRoute === oldRoute) {
		return
	}

	loadItems()
})

</script>

<template>
	<div v-if="!autoLoad && items.length===0">
		<sc-button
			type="primary"
			@click="loadItems"
		>
			lancer la recherche des {{ title }}
		</sc-button>
	</div>
	<filtered-list
		v-else
		:list="items"
		list-class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
		:title
	>
		<template #button>
			<slot name="button" />
		</template>

		<template #card="{item}: {item: unknown}">
			<Card>
				<template #header>
					<slot
						name="title"
						:item="item as T"
					>
						<div v-katex.auto="(item as T).title" />
					</slot>
				</template>

				<div class="flex justify-end">
					<sc-button
						icon
						type="add"
						xs
						@click="emits('selected', item as T)"
					>
						ajouter
					</sc-button>
				</div>
			</Card>
		</template>
	</filtered-list>
</template>
