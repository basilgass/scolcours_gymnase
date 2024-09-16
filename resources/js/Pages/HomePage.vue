<script
	lang="ts"
	setup
>
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
		required: true
	}
})
</script>


<template>
	<div class="space-y-10 bg-gray-100">
		<!--		<Head title="" />-->

		<ScolCoursLogo class="py-10 scale-150" />

		<div class="flex flex-col md:flex-row w-full">
			<InertiaLink
				v-for="(theme) in $page.props.themes"
				:key="theme.slug"
				:class="`bg-scolcours-${theme.slug}`"
				:href="'/' + theme.slug"
				class="group
					w-full md:flex-1 md:hover:flex-[8]
					h-[8em] hover:h-[15em] md:h-[25em] md:hover:h-[25em]
					transition-all duration-1000 ease-in-out
					text-xl font-thin whitespace-nowrap text-white
					rounded border overflow-hidden cursor-pointer
					grid grid-cols-1 place-items-center"
			>
				<div class="text-center h-full">
					<i
						:class="`${theme.icon}`"
						class="text-3xl block mt-16 mb-8
							group-hover:text-5xl
							transition-all duration-1000 ease-in-out"
					/>
					<div
						class="group-hover:text-right
								rotate-90 group-hover:rotate-0
								origin-left translate-x-[50%]
								group-hover:translate-x-0
								text-md group-hover:text-2xl
								transition-all duration-1000 ease-in-out "
					>
						{{ theme.title }}
					</div>
				</div>
			</InertiaLink>
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
							v-katex.auto="item.title"
							class="font-normal text-lg"
						/>

						<div class="text-xs">
							{{ item.modified }}
						</div>
					</div>
					<markdown-it
						:text="item.body"
						class="font-extralight"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
