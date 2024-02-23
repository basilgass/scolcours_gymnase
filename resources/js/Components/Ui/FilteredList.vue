<script setup>
import { computed, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router } from "@inertiajs/vue3"

const props = defineProps({
		title: { type: String, required: true },
		list: { type: Array, required: true },
		routeName: { type: String, default: "" },
		routeData: { type: Function, default: () => [] },
		itemTitle: { type: Function, default: (item) => item?.title },
		itemBackground: { type: Function, default: () => "bg-white" },
		itemClass: { type: String, default: "" },
		collapsed: { type: Boolean, default: null },
	})

	const filteredList = computed(() => {
			const checkString = selectedList.value.trim().toLowerCase()

			if (checkString === "") {
				return props.list
			}

			return props.list.filter((item) =>
				Object.values(item)
					.filter((x) => typeof x === "string")
					.some((x) => x.toLowerCase().includes(checkString)),
			)
		})
const selectedList = ref("")
	const showList = ref(props.collapsed !== true)

function itemClicked(item) {
		if (props.routeName) {
			router.visit(route(props.routeName, props.routeData(item)))
		}
	}
</script>
<template>
	<div>
		<div class="flex justify-between">
			<h3 class="text-lg uppercase">
				{{ title }}
			</h3>
			<button
				v-if="props.collapsed !== null"
				@click="showList = !showList"
				v-text="showList ? 'cacher la liste' : 'afficher la liste'"
			/>
		</div>

		<div v-show="showList">
			<form-maker
				v-model="selectedList"
				:label="`filtrer les ${title}`"
				class="mb-5"
				name="chapter-list"
			/>

			<div
				class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
			>
				<transition-group name="list">
					<div
						v-for="item of filteredList"
						:key="`id-${item.id}`"
					>
						<div v-if="$slots['card']">
							<slot
								:item="item"
								name="card"
							/>
						</div>
						<div
							v-else
							v-theme.bg.text="props.itemBackground(item)"
							:class="props.itemClass + (props.routeName ? ' cursor-pointer' : '')"
							class="p-4 border border-gray-200 rounded hover:scale-105 hover:shadow transition-all h-full"
							@click="itemClicked(item)"
							v-katex.auto="props.itemTitle(item)"
						/>
					</div>
				</transition-group>
			</div>
		</div>
	</div>
</template>
