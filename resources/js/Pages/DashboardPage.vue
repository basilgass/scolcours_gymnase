<script
	setup
	lang="ts"
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ChapterInterface } from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"

interface DashboardInterface extends ChapterInterface {
	maxPost: number,
	currentPost: number,
}
defineOptions({ layout: LayoutMain })

// TODO: amélioer le dashboard
defineProps<{
	courses: DashboardInterface[]
}>()


</script>
<template>
	<section class="">
		<div class="flex flex-col mt-2">
			<div class="font-extralight uppercase -mb-1">
				profil de
			</div>
			<div class="text-3xl">
				{{ $page.props.auth.user.fullname }}
			</div>
		</div>

		<div
			v-admin
			class="flex  my-3"
		>
			<sc-button
				type="admin"
				href="/admin/"
				class="hover:underline"
			>
				Administration
			</sc-button>
		</div>

		<!--		<div class="bg-white rounder border border-gray-200">-->
		<!--			<h2 class="text-xl p-5 border-b border-gray-200 uppercase font-extralight">-->
		<!--				Dernières modifications-->
		<!--			</h2>-->

		<!--			<div class="flex flex-col divide-y divide-gray-200 -pt-3">-->
		<!--				<InertiaLink-->
		<!--					v-for="course in courses"-->
		<!--					:key="course.slug"-->
		<!--					:href="route('themes.chapters.slide', [course.theme, course.slug, course.currentPost])"-->
		<!--					class="px-5 py-3 hover:px-8 transition-all flex justify-between items-baseline"-->
		<!--				>-->
		<!--					<div v-katex.auto="course.title" />-->
		<!--					<div class="text-xs">-->
		<!--						{{ course.currentPost }}<sup>e</sup> page sur {{ course.maxPost }}, {{ course.updated_at }}-->
		<!--					</div>-->
		<!--				</InertiaLink>-->
		<!--			</div>-->
		<!--		</div>-->
	</section>
</template>
