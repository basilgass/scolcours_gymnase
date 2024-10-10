<script generic="T" lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router, usePage } from "@inertiajs/vue3"
import { computed, PropType, ref } from "vue"

interface FilterItem {
	title: string,
	slug: string,
	active: boolean,
	theme: {
		slug: string,
		title: string
	}
}
// TODO: add a group by / (theme) tag to the filtered list

const props = defineProps({
	title: { type: String, default: "" },
	search: { type: String, default: null },
	list: { type: Object as PropType<T[]>, required: true },
	routeName: { type: String, default: "" },
	routeData: { type: Function, default: () => [] },
	itemTitle: { type: Function, default: (item) => item?.title },
	itemBackground: { type: Function, default: () => "bg-white" },
	itemClass: { type: String, default: "" },
	collapsed: { type: Boolean, default: null },
	listClass: { type: String, default: "flex gap-3 flex-wrap" },
	noFilterIfLessThan: { type: Number, default: 10 },
	noTitle: { type: Boolean, default: false },
	filterByTheme: { type: Boolean, default: false },
	focus: {type: Boolean, default: false}
})

const filteredList = computed<T[]>(() => {
		// Get the actual list.
		let arr = props.list

		// Get the user input value
		const checkString = selectedList.value.trim().toLowerCase()

		// Nothing to do.
		if (checkString === "" && selectedTheme.value === "") return props.list

		// filter by theme
		if (selectedTheme.value !== "") {
			arr = arr.filter((item: T) => {
				if (typeof item === "string") return false

				const { theme } = item as FilterItem // destructure for typescript
				return theme && theme.slug === selectedTheme.value

			})
		}

		// Filter by string.
		if (checkString !== "") {
			arr = arr.filter((item) =>
				Object.values(item)
					.filter((x) => typeof x === "string")
					.some((x) => (x as string).toLowerCase().includes(checkString))
			)
		}

		// The list is empty.
		if (arr.length === 0) {
			emits("empty", true)
			return []
		}

		if (arr.length === 1) emits("unique", arr[0])

		emits("empty", false)

		return arr
	}
)

const selectedList = ref("")
const selectedTheme = ref("")
const showList = ref(props.collapsed !== true)

function itemClicked(item) {
	if (props.routeName) {
		router.visit(route(props.routeName, props.routeData(item)))
	}
}

defineSlots<{
	card(props: { item: T }): unknown,
	button(),
	title(),
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
			<div>
				<h3
					v-if="!noTitle && $slots['title'] === undefined"
					class="text-lg uppercase my-3"
				>
					{{ title }}
				</h3>
				<slot name="title" />
			</div>
			<div class="flex gap-3 my-auto py-3">
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
				:label="search===null?`filtrer les ${title}`:search"
				autocomplete="off"
				class="mb-2"
				clearable
				:focus="focus"
				name="chapter-list"
				@enter="emits('enter', filteredList)"
			/>

			<div
				v-if="filterByTheme"
				class="flex gap-5 items-center mt-3 mb-5"
			>
				<div>Filtrer par thèmes:</div>
				<button
					:class="selectedTheme === '' ? 'btn-success' : 'opacity-40'"
					class="btn btn-xs"
					@click="selectedTheme = ''"
				>
					Tous
				</button>
				<button
					v-for="(theme, id) of usePage().props.themes"
					:key="id"
					:class="selectedTheme === theme.slug ? 'btn-success' : 'opacity-40'"
					class="btn btn-xs"
					@click="selectedTheme = theme.slug"
				>
					{{ theme.title }}
				</button>
			</div>

			<div
				v-if="filteredList.length>0"
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
			<div v-else>
				<slot name="noItemMessage">
					Aucun {{ title.endsWith("s") ? title.slice(0, -1) : title }} trouvé
				</slot>
			</div>
		</div>
	</div>
</template>
