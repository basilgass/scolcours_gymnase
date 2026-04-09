<script setup lang="ts">
import LayoutGuest from "@/Layouts/LayoutGuest.vue"
import {Head, useForm} from "@inertiajs/vue3"
import FormInput from "@/Components/Form/FormInput.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

defineOptions({layout: LayoutGuest})

const props = defineProps<{
	email: string,
	token: string,
}>()

const form = useForm({
	token: props.token,
	email: props.email,
	password: "",
	password_confirmation: "",
})

function submit() {
	form.post(route("password.update"), {
		onFinish: () => form.reset("password", "password_confirmation"),
	})
}

</script>

<template>
	<Head title="Reset Password" />

	<form @submit.prevent="submit">
		<FormInput
			type="email"
			label="email"
			v-model="form.email"
			autocomplete="username"
			focus
			required
		/>

		<FormInput
			class="mt-4"
			type="password"
			label="nouveau mot de passe"
			v-model="form.password"
			autocomplete="new-password"
			required
		/>

		<FormInput
			class="mt-4"
			type="password"
			label="confirmer le mot de passe"
			v-model="form.password_confirmation"
			autocomplete="new-password"
			required
		/>


		<div class="flex items-center justify-end mt-4">
			<sc-button
				type="primary"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
			>
				Reset Password
			</sc-button>
		</div>
	</form>
</template>
