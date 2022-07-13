<template>
	<Head title="Reset Password" />

	<BreezeValidationErrors class="mb-4" />

	<form @submit.prevent="submit">
		<div>
			<BreezeLabel
				for="email"
				value="Email"
			/>
			<BreezeInput
				id="email"
				v-model="form.email"
				autocomplete="username"
				autofocus
				class="mt-1 block w-full"
				required
				type="email"
			/>
		</div>

		<div class="mt-4">
			<BreezeLabel
				for="password"
				value="Password"
			/>
			<BreezeInput
				id="password"
				v-model="form.password"
				autocomplete="new-password"
				class="mt-1 block w-full"
				required
				type="password"
			/>
		</div>

		<div class="mt-4">
			<BreezeLabel
				for="password_confirmation"
				value="Confirm Password"
			/>
			<BreezeInput
				id="password_confirmation"
				v-model="form.password_confirmation"
				autocomplete="new-password"
				class="mt-1 block w-full"
				required
				type="password"
			/>
		</div>

		<div class="flex items-center justify-end mt-4">
			<BreezeButton
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
			>
				Reset Password
			</BreezeButton>
		</div>
	</form>
</template>

<script>
import BreezeButton from "@/Components/Auth/Button.vue"
import BreezeGuestLayout from "@/Layouts/LayoutGuest.vue"
import BreezeInput from "@/Components/Auth/Input.vue"
import BreezeLabel from "@/Components/Auth/Label.vue"
import BreezeValidationErrors from "@/Components/Auth/ValidationErrors.vue"
import {Head} from "@inertiajs/inertia-vue3"

export default {

	components: {
		BreezeButton,
		BreezeInput,
		BreezeLabel,
		BreezeValidationErrors,
		Head,
	},
	layout: BreezeGuestLayout,

	props: {
		email: String,
		token: String,
	},

	data() {
		return {
			form: this.$inertia.form({
				token: this.token,
				email: this.email,
				password: "",
				password_confirmation: "",
			})
		}
	},

	methods: {
		submit() {
			this.form.post(this.route("password.update"), {
				onFinish: () => this.form.reset("password", "password_confirmation"),
			})
		}
	}
}
</script>
