<script>
import BreezeButton from "@/Components/Auth/Button.vue"
import BreezeGuestLayout from "@/Layouts/LayoutGuest.vue"
import BreezeInput from "@/Components/Auth/Input.vue"
import BreezeLabel from "@/Components/Auth/Label.vue"
import BreezeValidationErrors from "@/Components/Auth/ValidationErrors.vue"
import { Head, Link } from "@inertiajs/vue3"

export default {

	components: {
		BreezeButton,
		BreezeInput,
		BreezeLabel,
		BreezeValidationErrors,
		Head,
		Link,
	},
	layout: BreezeGuestLayout,

	data() {
		return {
			form: this.$inertia.form({
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				terms: false,
			})
		}
	},

	methods: {
		submit() {
			this.form.post(this.route("register"), {
				onFinish: () => this.form.reset("password", "password_confirmation"),
			})
		}
	}
}
</script>

<template>

	<Head title="Register" />

	<BreezeValidationErrors class="mb-4" />

	<form @submit.prevent="submit">
		<div>
			<BreezeLabel
				for="name"
				value="Name"
			/>
			<BreezeInput
				id="name"
				v-model="form.name"
				autocomplete="name"
				autofocus
				class="mt-1 block w-full"
				required
				type="text"
			/>
		</div>

		<div class="mt-4">
			<BreezeLabel
				for="email"
				value="Email"
			/>
			<BreezeInput
				id="email"
				v-model="form.email"
				autocomplete="username"
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
			<InertiaLink
				:href="route('login')"
				class="underline text-sm text-gray-600 hover:text-gray-900"
			>
				Already registered?
			</InertiaLink>

			<BreezeButton
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
				class="ml-4"
			>
				Register
			</BreezeButton>
		</div>
	</form>
</template>
