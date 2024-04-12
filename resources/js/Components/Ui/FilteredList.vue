<script lang="ts" setup>
import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router } from "@inertiajs/vue3"

const props = defineProps({
	title: { type: String, required: true },
	list: { type: Object as PropType<(object | string)[]>, required: true },
	routeName: { type: String, default: "" },
	routeData: { type: Function, default: () => [] },
	itemTitle: { type: Function, default: (item) => item?.title },
	itemBackground: { type: Function, default: () => "bg-white" },
	itemClass: { type: String, default: "" },
	collapsed: { type: Boolean, default: null },
	listClass: { type: String, default: "flex gap-3 flex-wrap" },
	noFilterIfLessThan: { type: Number, default: 10 }
})


const filteredList = computed<(object | string)[]>(() => {
	const checkString = selectedList.value.trim().toLowerCase()

	if (checkString === "") {
		return props.list
	}

	return props.list.filter((item) =>
		Object.values(item)
			.filter((x) => typeof x === "string")
			.some((x) => x.toLowerCase().includes(checkString))
	)
})
const selectedList = ref("")
const showList = ref(props.collapsed !== true)

function itemClicked(item) {
	if (props.routeName) {
		router.visit(route(props.routeName, props.routeData(item)))
	}
}

defineSlots<{
	card(props: { item: object | string }): unknown,
	button()
}>()

const emits = defineEmits(['enter'])
</script>
<template>
	<div>
		<div class="flex justify-between">
			<h3 class="text-lg uppercase">
				{{ title }}
			</h3>
			<div class="flex gap-3">
				<button
					v-if="props.collapsed !== null"
					@click="showList = !showList"
					v-text="showList ? 'cacher la liste' : 'afficher la liste'"
				/>
				<slot name="button" />
			</div>
		</div>

		<div v-show="showList">
			<form-maker
				v-show="props.list.length >= noFilterIfLessThan"
				v-model="selectedList"
				:label="`filtrer les ${title}`"
				class="mb-5"
				name="chapter-list"
				@enter="emits('enter', filteredList)"
			/>

			<div
				:class="props.listClass"
			>
				<transition-group name="list">
					<div
						v-for="(item, index) in filteredList"
						:key="`id-${index}`"
					>
						<slot
							v-if="$slots['card']"
							:item="item"
							name="card"
						/>
						<div
							v-else
							v-katex.auto="props.itemTitle(item)"
							v-theme.bg.text="props.itemBackground(item)"
							:class="props.itemClass + (props.routeName ? ' cursor-pointer' : '')"
							class="p-4 border border-gray-200 rounded hover:scale-105 hover:shadow transition-all h-full"
							@click="itemClicked(item)"
						/>
					</div>
				</transition-group>
			</div>
		</div>
	</div>
</template>
