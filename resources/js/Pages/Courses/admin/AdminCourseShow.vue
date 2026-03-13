<script lang="ts" setup>

import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ref} from "vue"
import CourseAgenda from "@/Components/Courses/CourseAgenda.vue"
import CourseStats from "@/Components/Courses/CourseStats.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"

defineOptions({layout: LayoutAdmin})

const props = defineProps<{
	course: CourseInterface,
	team: TeamInterface
}>()

const showBlock = ref<boolean>(false)
</script>

<template>
	<section>
		<article-title
			:return-link="{
				label: 'Retour à mes cours',
				url: route('admin.courses.index')
			}"
			:title="course.title"
			class="mb-3"
			subtitle="dashboard"
			theme
		>
			<template #right>
				<sc-button
					xs
					@click="showBlock=!showBlock"
				>
					Afficher la description du cours
				</sc-button>
			</template>
		</article-title>

		<block-show
			v-show="showBlock"
			:block="course.block"
			class="mb-10"
		/>

		<course-stats
			:course
			:team
			class="mb-10"
		/>

		<course-agenda
			:course
			:teams="[team]"
		/>
	</section>
</template>

