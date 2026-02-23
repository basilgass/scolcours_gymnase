<script setup lang="ts">

import {CourseInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import {AxiosErrorMessage} from "@/types"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {slugify} from "@/scolcours.ts"
import {router} from "@inertiajs/vue3"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import AdminCourseItem from "@/Components/Courses/AdminCourseItem.vue";
import FilteredList from "@/Components/Ui/FilteredList.vue";

defineOptions({layout: LayoutAdmin})
const props = defineProps<{
	courses: CourseInterface[],
	teams: UserTeamInterface[]
}>()

console.log(props.courses)
console.log(props.teams)
const showCreate = ref(false)
const newCourseTitle = ref("")
const newCourseSlug = computed(() => {
	return slugify(newCourseTitle.value)
})

function addCourse() {
	axios.post(route('api.admin.courses.store'), {
		title: newCourseTitle.value,
		slug: newCourseSlug.value
	})
		.then((res: { data: CourseInterface }) => {
			router.visit(route('admin.courses.edit', {course: res.data.slug}))
		})
		.catch((err: AxiosErrorMessage) => {
			console.log(err.response.data.message)
		})
}


const theCourses = ref<CourseInterface[]>(props.courses)

function onDelete(id: number) {
	const index = theCourses.value.findIndex(course => course.id === id)
	theCourses.value.splice(index, 1)
}

function searchFunction(item: CourseInterface, search: string): boolean {
	if (item.title.toLowerCase().includes(search)) {
		return true
	}

	console.log(item.teams.map(t => t.name))
	if (item.teams.some(team => team.name.toLowerCase().includes(search))) {
		return true
	}

	return false
}
</script>

<template>
	<section>
		<div>
			<article-title
				title="gestion des cours"
				:return-link="{
					url: route('admin.index'),
					label: 'retour à l\'administration'
				}"
			>
				<template #right>
					<sc-button
						type="add"
						xs
						@click="showCreate = true"
					>
						<i class="bi bi-plus-circle mr-2" />Créer un nouveau cours
					</sc-button>
				</template>
			</article-title>
		</div>

		<filtered-list
			:list="theCourses"
			search="rechercher un cours"
			:no-filter-if-less-than="3"
			list-class="grid grid-cols-1 gap-3"
			:search-function
		>
			<template #card="{item} : {item: CourseInterface }">
				<admin-course-item
					:course="item" :teams
					@delete="onDelete"
				/>
			</template>
		</filtered-list>


		<dialog-modal
			v-model="showCreate"
			class="w-75 h-auto p-3"
		>
			<div>
				<h2 class="text-lg font-extralight">
					Créer un nouveau cours
				</h2>
				<form-maker
					v-model="newCourseTitle"
					label="titre"
				/>
				<form-maker
					v-model="newCourseSlug"
					disabled
					label="slug"
				/>
			</div>
			<template #footer>
				<sc-button
					type="add"
					xs
					class="w-full"
					@click="addCourse"
				>
					<i class="bi bi-plus-circle mr-2" />Créer un nouveau cours
				</sc-button>
			</template>
		</dialog-modal>
	</section>
</template>

<style scoped>

</style>
