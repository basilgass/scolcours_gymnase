<script
	setup
	lang="ts"
>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {CourseInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import CourseCard from "@/Components/Courses/CourseCard.vue"
import FormSwitch from "@/Components/Form/FormSwitch.vue"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"
import Card from "@/Components/Ui/Card.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	teams: TeamInterface[],
	courses: CourseInterface[],
}>()

const page = usePage()

const teamsName = computed(() => props.teams.map(team => team.name).join(', '))

const pseudo = ref(page.props.auth.user.pseudo)
const showRealName = ref(page.props.auth.user.showRealName)

function regeneratePseudo() {
	axios.patch(route('profile.pseudo.regenerate'))
		.then((res) => {
			pseudo.value = res.data.pseudo
		})
		.catch((res) => {
			console.warn(res.response?.data?.message)
		})
}

function updateShowRealName(value: boolean) {
	alert(value)
	axios.patch(route('profile.showRealName.update'), {show_real_name: showRealName.value})
		.then((res) => {
			console.log(res)
			// Do nothing
		})
		.catch((res) => {
			console.warn(res.response?.data?.message)
		})
}

</script>
<template>
	<section class=" space-y-10">
		<div class="flex justify-between items-end">
			<div class="flex flex-col mt-2">
				<div class="font-extralight uppercase -mb-1">
					profil
				</div>
			</div>
			<sc-button
				v-admin
				type="admin"
				href="/admin/"
				class="hover:underline"
			>
				Administration
			</sc-button>
		</div>


		<card>
			<div class="flex flex-col gap-2 mt-3">
				<div class="text-3xl">
					{{ $page.props.auth.user.fullname }}
				</div>
				<div class="text-sm font-code">
					{{ $page.props.auth.user.email }}
				</div>

				<div class="flex items-center gap-2">
					<span class="font-code">{{ pseudo }}</span>
					<sc-button
						type="generate"
						icon
						xs
						@click="regeneratePseudo"
					>
						Nouveau pseudo
					</sc-button>
				</div>
			</div>
			<template #footer>
				<div class="flex gap-4 items-center">
					affichage du nom :
					<form-switch
						v-model="showRealName"
						sm
						label="nom réel,pseudo"
						@update="updateShowRealName"
					/>
				</div>
			</template>
		</card>
		<card class="flex gap-3">
			<template #header>
				<h3 class="font-semibold">
					équipes
				</h3>
			</template>
			<div>{{ teamsName }}</div>
		</card>

		<div class="mt-24">
			<h3 class="text-xl uppercase font-extralight">
				Liste des cours
			</h3>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				<course-card
					v-for="course in courses"
					:key="`course-${course.id}`"
					:course
				/>
			</div>
		</div>
	</section>
</template>
