<script setup lang="ts">

import LayoutGuest from "@/Layouts/LayoutGuest.vue"
import {Head, useForm} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

defineOptions({Layout: LayoutGuest})

const form = useForm({
	password: "",
})

function submit() {
	form.post(route("password.confirm"), {
		onFinish: () => form.reset(),
	})
}
</script>

<template>
	<Head title="Confirm Password" />

	<div class="mb-4 text-sm text-gray-600">
		This is a secure area of the application. Please confirm your password before continuing.
	</div>

	<form @submit.prevent="submit">
		<form-maker
			type="password"
			label="mot de passe"
			autocomplete="current-password"
			v-model="form.password"
			focus
			required
		/>

		<div class="flex justify-end mt-4">
			<sc-button
				type="primary"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
				class="ml-4"
			>
				Confirmer
			</sc-button>
		</div>
	</form>
</template>
