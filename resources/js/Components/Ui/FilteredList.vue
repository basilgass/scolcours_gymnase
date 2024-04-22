<script generic="T" lang="ts" setup>
import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router } from "@inertiajs/vue3"

// TODO: add a group by / (theme) tag to the filtered list

const props = defineProps({
	title: { type: String, required: true },
	list: { type: Object as PropType<T[]>, required: true },
	routeName: { type: String, default: "" },
	routeData: { type: Function, default: () => [] },
	itemTitle: { type: Function, default: (item) => item?.title },
	itemBackground: { type: Function, default: () => "bg-white" },
	itemClass: { type: String, default: "" },
	collapsed: { type: Boolean, default: null },
	listClass: { type: String, default: "flex gap-3 flex-wrap" },
	noFilterIfLessThan: { type: Number, default: 10 }
})


const filteredList = computed<T[]>(() => {
	const checkString = selectedList.value.trim().toLowerCase()

	if (checkString === "") return props.list

	const arr = props.list.filter((item) =>
		Object.values(item)
			.filter((x) => typeof x === "string")
			.some((x) => x.toLowerCase().includes(checkString))
	)

	// The list is empty.
	if (arr.length === 0) {
		emits("empty", true)
		return []
	}


	if (arr.length === 1) emits("unique", arr[0])

	emits("empty", false)
	return arr
})

const selectedList = ref("")
const showList = ref(props.collapsed !== true)

function itemClicked(item) {
	if (props.routeName) {
		router.visit(route(props.routeName, props.routeData(item)))
	}
}

defineSlots<{
	card(props: { item: T }): unknown,
	button(),
	noItemMessage(),
}>()

const emits = defineEmits<{
	enter: [event: T[]],
	unique: [item: T],
	empty: [value: boolean]
}>()
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
				v-if="filteredList.length>0"
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
			<div v-else>
				<slot name="noItemMessage">
					Aucun {{ title.endsWith('s') ? title.slice(0, -1) :title }} trouvé
				</slot>
			</div>
		</div>
	</div>
</template>
