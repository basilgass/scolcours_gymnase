<script setup lang="ts">
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

let props = defineProps({
	courses: {type: Object, required: true}
})

</script>
<template>
	<ArticleTitle :title="`profil de ${$page.props.auth.user.fullname}`" />

	<div
		v-admin
		class="flex flex-col gap-3 my-3 admin-wrapper"
	>
		<Link
			href="/admin/"
			class="hover:underline"
		>
			Administration
		</Link>
	</div>

	<div class="bg-white rounder border border-gray-200">
		<h2 class="text-xl p-5 border-b border-gray-200 uppercase font-extralight">
			Cours ouvert(s)
		</h2>

		<div class="flex flex-col divide-y divide-gray-200 -pt-3">
			<Link
				v-for="course in props.courses"
				:key="course.slug"
				:href="route('themes.chapters.slide', [course.theme, course.slug, course.currentPost])"
				class="px-5 py-3 hover:px-8 transition-all flex justify-between items-baseline"
			>
				<div
					v-katex.auto="course.title"
				/>
				<div class="text-xs">
					{{ course.currentPost }}<sup>e</sup> page sur {{ course.maxPost }}, {{ course.updated_at }}
				</div>
			</Link>
		</div>
	</div>
</template>
