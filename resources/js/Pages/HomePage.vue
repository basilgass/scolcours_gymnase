<script lang="ts">
	import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"

	export default {
		layout: LayoutFullpage,
	}
</script>
<script lang="ts" setup>
	import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
	import { Head, router } from "@inertiajs/vue3"
	import { PropType } from "vue"
	import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

	interface ChapterMiniInterface {
		id: number
		title: string
		url: string
		modified: string
		body: string
	}
	let props = defineProps({
		canLogin: { type: Boolean, required: true },
		canRegister: { type: Boolean, required: true },
		newChapters: {
			type: Array as PropType<ChapterMiniInterface[]>,
			required: true,
		},
	})
</script>
<template>
	<div class="space-y-10 bg-gray-100">
		<Head title="" />

		<ScolCoursLogo class="py-10" />

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			<Link
				v-for="(theme, index) in $page.props.themes"
				:key="theme.slug"
				:class="`bg-scolcours-${theme.slug} ${
					index % 2 === 0 ? 'rotate-1' : '-rotate-1'
				}`"
				:href="'/' + theme.slug"
				class="grid grid-cols-1 gap-5 place-items-center text-xl font-thin whitespace-nowrap rounded border py-20 text-white cursor-pointer transform hover:scale-105 hover:rotate-0 duration-300"
			>
				<i :class="`${theme.icon} mr-2 text-3xl`" />
				{{ theme.title }}
			</Link>
		</div>

		<div class="space-y-10">
			<h2 class="text-center text-xl">Dernières mises à jour</h2>
			<div
				class="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			>
				<div
					v-for="item of newChapters"
					:key="item.id"
					class="bg-white border border-gray-300 rounded py-2 px-3 hover:shadow hover:translate-x-1 transition-all duration-500 cursor-pointer"
					@click="$inertia.visit(item.url)"
				>
					<div class="flex justify-between items-center mb-2">
						<h3
							class="font-normal text-lg"
							v-katex.auto="item.title"
						></h3>

						<div class="text-xs">
							{{ item.modified }}
						</div>
					</div>
					<markdown-it class="font-extralight" :text="item.body">
					</markdown-it>
				</div>
			</div>
		</div>
	</div>
</template>
