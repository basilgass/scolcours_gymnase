<script setup lang="ts">
import {Head, useForm} from "@inertiajs/vue3"
import LayoutGuest from "@/Layouts/LayoutGuest.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutGuest})
defineProps<{
	status: string | null
}>()

const form = useForm({
	email: ""
})

function submit() {
	form.post(route("password.email"))
}
</script>

<template>
	<Head title="Mot de passe oublié ?" />

	<div class="mb-4 text-sm text-gray-600">
		Vous avez oublié votre mot de passe ?
	</div>

	<div
		v-if="status"
		class="mb-4 font-medium text-sm text-green-600"
	>
		{{ status }}
	</div>

	<form @submit.prevent="submit">
		<form-maker
			label="Email"
			autocomplete="username"
			focus
			required
			type="email"
			v-model="form.email"
		/>


		<div class="flex items-center justify-end mt-4">
			<sc-button
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
				type="primary"
			>
				Envoyer un lien de récupération
			</sc-button>
		</div>
	</form>
</template>
