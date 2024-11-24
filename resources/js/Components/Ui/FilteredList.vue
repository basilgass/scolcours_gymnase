<script generic="T extends {id:number}" lang="ts" setup>
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router, usePage } from "@inertiajs/vue3"
import { computed, ref } from "vue"

interface FilterItem {
	title: string,
	slug: string,
	active: boolean,
	theme: {
		id: number,
		slug: string,
		title: string,
	}
}

const scolcoursThemes = computed(() => {
	return usePage().props.themes.filter(x => x.slug !== "tools")
})

interface FilteredListProps<T> {
	title?: string;
	search?: string | null;
	searchFunction?: ((item: T, searchValue: string) => boolean);
	list: T[];
	routeName?: string;
	routeData?: (item: T) => unknown[];
	itemTitle?: (item: T) => string;
	itemBackground?: (item: T) => string | number;
	itemClass?: string;
	collapsed?: boolean | null;
	listClass?: string;
	noFilterIfLessThan?: number;
	noTitle?: boolean;
	filterByTheme?: boolean | ((item: T) => string | number);
	focus?: boolean;
}

const props = withDefaults(
	defineProps<FilteredListProps<T>>(),
	{
		title: "",
		search: null,
		routeName: null,
		routeData: null,
		itemTitle: (item: T) => (typeof item === "object" && item !== null && "title" in item) ? item.title as unknown as string : item as unknown as string,
		itemBackground: () => "bg-white",
		itemClass: "",
		collapsed: null,
		listClass: "flex gap-3 flex-wrap",
		noFilterIfLessThan: 10,
		noTitle: false,
		filterByTheme: false,
		searchFunction: null,
		focus: false
	})

const filteredList = computed<(T & { id: number })[]>(() => {
		// Get the actual list.
		let arr = props.list

		// Get the user input value
		const checkString = selectedList.value.trim().toLowerCase()

		// Nothing to do.
		if (checkString === "" && selectedTheme.value === 0) return props.list

		// filter by theme
		if (selectedTheme.value !== 0) {
			arr = arr.filter((item: T) => {
				if (typeof item === "string") return false

				if (props.filterByTheme === true) {
					const { theme } = item as unknown as FilterItem // destructure for typescript
					return theme && theme.id === selectedTheme.value
				} else if (!(typeof props.filterByTheme === "boolean")) {
					return props.filterByTheme(item) === selectedTheme.value
				}

			})
		}

		// Filter by string.
		if (checkString !== "") {

			arr = arr.filter((item) => {
				if (props.searchFunction) {
					return props.searchFunction(item, checkString)
				}

				return Object.values(item)
					.filter((x) => typeof x === "string")
					.some((x) => (x as string).toLowerCase().includes(checkString))
			})
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
const selectedTheme = ref<number>(0)
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
				:focus="focus"
				:label="search===null?`filtrer les ${title}`:search"
				autocomplete="off"
				class="mb-2"
				clearable
				name="chapter-list"
				@enter="emits('enter', filteredList)"
			/>

			<div
				v-if="filterByTheme"
				class="flex gap-5 items-center mt-3 mb-5"
			>
				<div>Filtrer par thèmes:</div>
				<button
					:class="selectedTheme === 0 ? 'btn-success' : 'opacity-40'"
					class="btn btn-xs"
					@click="selectedTheme = 0"
				>
					Tous
				</button>
				<button
					v-for="(theme, id) of scolcoursThemes"
					:key="id"
					v-theme.bg.text="theme.id"
					:class="selectedTheme === theme.id ? '' : 'opacity-40'"
					class="btn btn-xs transition-transform hover:opacity-100 hover:scale-110"
					@click="selectedTheme = theme.id"
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
						v-for="(item) in filteredList"
						:key="`id-${item.id}`"
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
