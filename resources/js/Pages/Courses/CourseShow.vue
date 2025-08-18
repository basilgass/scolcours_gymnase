<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {ref} from "vue"
import LessonCard from "@/Pages/Courses/LessonCard.vue"
import LessonIconLegend from "@/Pages/Courses/LessonIconLegend.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface,
	team: UserTeamInterface
}>()

const lessons = ref<LessonInterface[]>(props.course.lessons)


</script>

<template>
	<section>
		<admin-header>
			<sc-button
				type="edit"
				icon
				xs
				:href="route('admin.courses.edit', {course: props.course.slug})"
			>
				éditer le cours
			</sc-button>
		</admin-header>

		<article-title
			:title="course.title"
			theme
			:return-link="{
				label: 'Retour à mes cours',
				url: route('courses.index')
			}"
		/>

		<block-show :block="course.block" />

		<div class="mt-10 grid grid-cols-1 gap-3">
			<lesson-card
				class="w-xl mx-auto"
				v-for="lesson in lessons"
				:key="`lesson-${lesson.id}`"
				:course
				:lesson
				:team
			/>
		</div>
		<lesson-icon-legend class="justify-center mt-24" />
	</section>
</template>

