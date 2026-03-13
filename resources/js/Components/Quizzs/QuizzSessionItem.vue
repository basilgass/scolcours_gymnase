<script setup lang="ts">

import {QuizzSessionInterface} from "@/types/modelInterfaces.ts"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {Link as InertiaLink} from "@inertiajs/vue3"

const props = defineProps<{
	session: QuizzSessionInterface
}>()

const emits = defineEmits<{
	destroy: []
}>()

const enable = ref(props.session.enable)

function updateEnable() {
	axios
		.patch(
			route('api.admin.quizzes.sessions.enable', {quizzSession: props.session.id}),
			{
				enable: enable.value
			}
		)
}
</script>

<template>
	<div
		class="border px-3 py-1"
		:class="{
			'bg-green-50 border-l-8 border-green-600': enable
		}"
	>
		<div class="flex justify-between items-start">
			<div class="font-code">
				<div>({{ session.id }}): {{ session.shortcode }}</div>
				<div>
					<InertiaLink :href="route('admin.quizzes.sessions.projection', {quizzSession: session.shortcode})">
						projection
					</InertiaLink>

					<InertiaLink :href="route('admin.quizzes.sessions.dashboard', {quizzSession: session.shortcode})">
						dashboard
					</InertiaLink>
				</div>
			</div>

			<div class="grid grid-cols-4 gap-x-6 gap-y-1 text-center">
				<div>status</div>
				<div>activer</div>
				<div>current</div>
				<div>users</div>
				<div>{{ session.status }}</div>
				<form-maker
					label=""
					type="switch"
					v-model="enable"
					@update="updateEnable"
				/>
				<div>{{ session.current }} / {{ session.total }}</div>
				<div>{{ session.users?.length ?? 0 }}</div>
			</div>
			<confirm-button
				@confirm="emits('destroy')"
				icon
				xs
			>
				supprimer
			</confirm-button>
		</div>
	</div>
</template>

<style scoped>

</style>
