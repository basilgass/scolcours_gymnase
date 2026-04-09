<script setup lang="ts">
import LayoutGuest from "@/Layouts/LayoutGuest.vue"
import {Head, useForm} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FormInput from "@/Components/Form/FormInput.vue"

defineOptions({layout: LayoutGuest})

const form = useForm({
	name: "",
	email: "",
	password: "",
	password_confirmation: "",
	terms: false,
})

function submit() {
	form.post(route("register"), {
		onFinish: () => form.reset("password", "password_confirmation"),
	})
}
</script>

<template>
	<Head title="Register" />


	<form @submit.prevent="submit">
		<FormInput
			label="nom"
			v-model="form.name"
			autocomplete="name"
			focus
			required
		/>

		<FormInput
			class="mt-4"
			label="e-mail"
			autocomplete="username"
			v-model="form.email"
			required
			type="email"
		/>

		<FormInput
			label="mot de passe"
			type="password"
			v-model="form.password"
			autocomplete="new-password"
			required
		/>

		<FormInput
			label="confirmer le mot de passe"
			type="password"
			autocomplete="new-password"
			required
			v-model="form.password_confirmation"
		/>

		<div class="flex items-center justify-end mt-4">
			<InertiaLink
				:href="route('login')"
				class="underline text-sm text-gray-600 hover:text-gray-900"
			>
				Déjà enregistré ?
			</InertiaLink>

			<sc-button
				type="primary"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
				class="ml-4"
			>
				Enregistrer
			</sc-button>
		</div>
	</form>
</template>
