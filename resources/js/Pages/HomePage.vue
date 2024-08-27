<script lang="ts" setup>
import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"
import { PropType } from "vue"

defineOptions({ layout: LayoutFullpage })

interface ChapterMiniInterface {
	id: number
	title: string
	url: string
	modified: string
	body: string
}

defineProps({
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
		<!--		<Head title="" />-->

		<ScolCoursLogo class="py-10 scale-150" />

		<div class="flex flex-col md:flex-row w-full">
			<Link
				v-for="(theme) in $page.props.themes"
				:key="theme.slug"
				:class="`bg-scolcours-${theme.slug}`"
				:href="'/' + theme.slug"
				class="group grid grid-cols-1 gap-5 place-items-center
					w-full h-[8em] hover:h-[15em]
					md:w-[20%] md:h-[20em] md:hover:w-3/4 md:hover:h-[20em]
					transition-all duration-1000 ease-in-out
					text-xl font-thin whitespace-nowrap text-white 
					rounded border overflow-hidden
					cursor-pointer"
			>
				<div
					class="flex flex-col text-center
					gap-2 group-hover:gap-10
					transition-all duration-1000 ease-in-out"
				>
					<i
						:class="`${theme.icon} mr-2 text-3xl`"
						class="group-hover:text-5xl
					transition-all duration-1000 ease-in-out"
					/>
					<span
						class="hidden 
					group-hover:inline
					transition-all duration-1000 ease-in-out"
					>{{ theme.title }}</span>
				</div>
			</Link>
		</div>

		<div class="space-y-10">
			<h2 class="text-center text-xl">
				Dernières mises à jour
			</h2>
			<div class="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<div
					v-for="item of newChapters"
					:key="item.id"
					class="bg-white border border-gray-300 rounded py-2 px-3 cursor-pointer"
					@click="$inertia.visit(item.url)"
				>
					<div class="flex justify-between items-center mb-2">
						<h3
							class="font-normal text-lg"
							v-katex.auto="item.title"
						/>

						<div class="text-xs">
							{{ item.modified }}
						</div>
					</div>
					<markdown-it
						class="font-extralight"
						:text="item.body"
					/>
				</div>
			</div>
		</div>
	</div>
</template>