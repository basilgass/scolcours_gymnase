<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {CourseInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import axios from "axios"
import {router} from "@inertiajs/vue3"
import {AxiosErrorMessage} from "@/types"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {computed, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {slugify} from "@/scolcours.ts"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import CourseCalendar from "@/Components/Courses/CourseCalendar.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	teams: UserTeamInterface[],
	teamCourses: CourseInterface[],
	// userCourses: CourseInterface[]
}>()

</script>

<template>
	<main>
		<article-title title="Mes cours" />

		<div
			v-if="!$page.props.auth.user"
			class="grid place-items-center h-[60vh]"
		>
			<div class="flex flex-col gap-12 items-center">
				Pour pouvoir utiliser les cours, il faut se connecter.

				<sc-button
					type="primary"
					:href="route('login')"
				>
					Se connecter
				</sc-button>
			</div>
		</div>

		<div v-else>
			<div>
				<h2 class="text-lg md:text-2xl mb-5">
					Cours de classe
				</h2>
				<div class="flex flex-col gap-3">
					<course-card
						v-for="course in teamCourses"
						:key="`team-${course.id}`"
						:course
					/>
				</div>
			</div>

		</div>
	</main>
</template>

<style scoped></style>
