<script lang="ts" setup>

import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"
import { ChapterShowInterface } from "@/types/modelInterfaces.ts"

defineOptions({ layout: LayoutFullpage })

defineProps<{
	newChapters: ChapterShowInterface[]
}>()

</script>


<template>
	<div class="space-y-10 bg-gray-100">
		<!--		<Head title="" />-->

		<ScolCoursLogo class="py-10 scale-150" />

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<InertiaLink
				v-for="(theme) in $page.props.themes"
				:key="theme.slug"
				:class="`bg-scolcours-${theme.slug}`"
				:href="'/' + theme.slug"
				class="aspect-[2] group
					transition-all duration-400 ease-in-out
					text-xl font-thin whitespace-nowrap text-white
					rounded hover:rounded-xl hover:shadow
					border overflow-hidden cursor-pointer
					hover:rotate-[-1deg] hover:scale-105
					grid grid-cols-1 place-items-center"
			>
				<div class="text-center space-y-5">
					<i
						:class="`${theme.icon}`"
						class="text-3xl block
							transition-all duration-400 ease-in-out"
					/>
					<div
						class="group-hover:text-right
								text-md group-hover:text-2xl
								transition-all duration-400 ease-in-out "
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
						:text="item.block.body"
						class="font-extralight"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
