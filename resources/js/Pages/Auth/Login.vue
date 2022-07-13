<template>
	<Head title="Connection" />

	<BreezeValidationErrors class="mb-4" />

	<div
		v-if="status"
		class="mb-4 font-medium text-sm text-green-600"
	>
		{{ status }}
	</div>

	<form @submit.prevent="submit">
		<div>
			<form-input
				id="email"
				v-model="form.email"
				label="email"
				name="email"
				type="email"
				class="mt-1 block w-full p-2"
				required
				autofocus
				autocomplete="username"
			/>
		</div>

		<div class="mt-4">
			<form-input
				id="password"
				v-model="form.password"
				name="password"
				label="mot de passe"
				type="password"
				class="mt-1 block w-full p-2"
				required
				autocomplete="current-password"
			/>
		</div>

		<div class="block mt-4">
			<label class="flex items-center">
				<BreezeCheckbox
					v-model:checked="form.remember"
					name="remember"
				/>
				<span class="ml-2 text-sm text-gray-600">Rester connecter ?</span>
			</label>
		</div>

		<div class="flex items-center justify-end mt-4">
			<Link
				v-if="canResetPassword"
				:href="route('password.request')"
				class="underline text-sm text-gray-600 hover:text-gray-900"
			>
				Mot de passe oublié ?
			</Link>

			<button
				class="btn-primary ml-4"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
			>
				Se connecter
			</button>
		</div>
	</form>
</template>

<script>
import BreezeButton from "@/Components/Auth/Button.vue"
import BreezeCheckbox from "@/Components/Auth/Checkbox.vue"
import BreezeGuestLayout from "@/Layouts/LayoutGuest.vue"
import BreezeInput from "@/Components/Auth/Input.vue"
import BreezeLabel from "@/Components/Auth/Label.vue"
import BreezeValidationErrors from "@/Components/Auth/ValidationErrors.vue"
import {Head, Link} from "@inertiajs/inertia-vue3"
import FormInput from "@/Components/Form/FormInput"
import FormButton from "@/Components/Form/FormButton"

export default {

	components: {
		FormButton,
		FormInput,
		BreezeButton,
		BreezeCheckbox,
		BreezeInput,
		BreezeLabel,
		BreezeValidationErrors,
		Head,
		Link,
	},
	layout: BreezeGuestLayout,

	props: {
		canResetPassword: Boolean,
		status: String,
	},

	data () {
		return {
			form: this.$inertia.form({
				email: "",
				password: "",
				remember: false
			})
		}
	},

	methods: {
		submit () {
			this.form.post(this.route("login"), {
				onFinish: () => this.form.reset("password"),
			})
		}
	}
}
</script>
