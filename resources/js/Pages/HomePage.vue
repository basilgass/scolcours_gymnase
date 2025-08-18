<script lang="ts" setup>

import ScolCoursLogo from "@/Components/ScolcoursLogo.vue"
import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"
import axios from "axios"
import {router, usePage} from "@inertiajs/vue3"
import {computed, onMounted, ref} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {CourseInterface, UserInterface} from "@/types/modelInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutFullpage})

const connectedUser = ref<boolean>(usePage().props.auth.user !== null)
const courses = ref<CourseInterface[]>([])

onMounted(() => {
	if (usePage().props.auth.user) {
		axios
			.get(route('api.students.users.show', {user: +usePage().props.auth.user.id}))
			.then((res: AxiosResponseModel<{
				user: UserInterface,
				courses: CourseInterface[]
			}>) => {
				courses.value = res.data.courses.filter(course => course.lessons.length > 0)
				connectedUser.value = true
			})
			.catch((err: AxiosErrorMessage) => {
				console.warn(err.response.data.message)
			})
	}
})

</script>


<template>
	<div class="space-y-10">
		<ScolCoursLogo />

		<div v-if="connectedUser">
			<h3 class="text-lg md:text-xl">
				Mes cours
			</h3>
			<div
				v-if="courses.length"
				class="columns-3 space-y-3"
			>
				<course-card
					v-for="course in courses"
					:key="`course-${course.id}`"
					:course
				/>
			</div>
			<div
				v-else
				class="text-center text-lg lg:text-xl min-h-[200px] grid place-items-center"
			>
				<div>A la recherche de cours...</div>
			</div>
		</div>
		<div
			v-else
			class="grid place-items-center h-[100px]"
		>
			<sc-button
				type="primary"
				xl
				href="/login"
			>
				<i class="bi bi-person" />se connecter
			</sc-button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<InertiaLink
				v-for="(theme) in $page.props.themes"
				:key="theme.slug"
				v-theme.bg.text="theme.slug"
				:href="'/' + theme.slug"
				class="aspect-[2] group
					transition-all duration-400 ease-in-out
					text-xl font-thin whitespace-nowrap
					rounded-md hover:rounded-xl hover:shadow-xs
					overflow-hidden cursor-pointer
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
	</div>
</template>
