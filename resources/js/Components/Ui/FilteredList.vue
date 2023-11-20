<script setup>
	import FormInput from "@/Components/Form/FormInput.vue"
	import { computed, ref } from "vue"

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

	let filteredList = computed(() => {
			const checkString = selectedList.value.trim().toLowerCase()

			if (checkString === "") {
				return props.list
			}

			return props.list.filter((item) =>
				Object.values(item)
					.filter((x) => typeof x === "string")
					.some((x) => x.toLowerCase().includes(checkString)),
			)
		}),
		selectedList = ref("")

	let showList = ref(props.collapsed !== true)
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
			<form-input
				v-model="selectedList"
				:label="`filtrer les ${title}`"
				class="mb-5"
				name="chapter-list"
			/>
			<div
				class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
			>
				<transition-group name="list">
					<div v-for="item of filteredList" :key="`id-${item.id}`">
						<div v-if="$slots['card']">
							<slot :item="item" name="card" />
						</div>
						<div
							v-else
							v-theme.bg.text="props.itemBackground(item)"
							:class="props.itemClass"
							class="p-4 border border-gray-200 rounded hover:scale-105 hover:shadow transition-all h-full"
						>
							<Link
								v-if="props.routeName !== ''"
								v-katex.auto="props.itemTitle(item)"
								:href="
									route(
										props.routeName,
										props.routeData(item),
									)
								"
							/>
							<div v-else v-katex.auto="props.itemTitle(item)" />
						</div>
					</div>
				</transition-group>
			</div>
		</div>
	</div>
</template>
