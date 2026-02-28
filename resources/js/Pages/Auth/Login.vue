<script setup lang="ts">
import {Head, useForm} from "@inertiajs/vue3"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import LayoutGuest from "@/Layouts/LayoutGuest.vue"

// TODO: créer un component pour le login: permet d'ajouter le login à différents endroits, sans redirection.
defineOptions({layout: LayoutGuest})

defineProps<{
	canResetPassword: boolean,
	status: string | null,
}>()

const form = useForm({
	email: "",
	password: "",
	remember: false,
})

function submit() {
	form.post(route('login'), {
		onFinish: () => form.reset('password'),
	})
}
</script>

<template>
	<Head title="Connection" />

	<div
		v-if="status"
		class="mb-4 font-medium text-sm text-green-600"
	>
		{{ status }}
	</div>


	<form
		@submit.prevent="submit"
	>
		<div>
			<form-maker
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
			<form-maker
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
				<input
					v-model="form.remember"
					class="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200 focus:ring-opacity-50"
					type="checkbox"
				>
				<span class="ml-2 text-sm text-gray-600">Rester connecter ?</span>
			</label>
		</div>

		<div class="flex items-center justify-end mt-4">
			<InertiaLink
				v-if="canResetPassword"
				:href="route('password.request')"
				class="underline text-sm text-gray-600 hover:text-gray-900"
			>
				Mot de passe oublié ?
			</InertiaLink>

			<sc-button
				type="primary"
				class="ml-4"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
			>
				Se connecter
			</sc-button>
		</div>
	</form>
</template>
