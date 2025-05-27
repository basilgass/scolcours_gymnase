<script setup lang="ts">

// TODO : changer le texte en français.

import {Head, useForm} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/scButton.vue"
import LayoutGuest from "@/Layouts/LayoutGuest.vue"
import {computed} from "vue"

defineOptions({layout: LayoutGuest})

const props = defineProps<{
	status: string | null
}>()

const form = useForm({})

const verificationLinkSent = computed(() => {
	return props.status === "verification-link-sent"
})

function submit() {
	form.post(route("verification.send"))
}
</script>

<template>
	<Head title="Email Verification" />

	<div class="mb-4 text-sm text-gray-600">
		Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we
		just emailed to you? If you didn't receive the email, we will gladly send you another.
	</div>

	<div
		v-if="verificationLinkSent"
		class="mb-4 font-medium text-sm text-green-600"
	>
		A new verification link has been sent to the email address you provided during registration.
	</div>

	<form @submit.prevent="submit">
		<div class="mt-4 flex items-center justify-between">
			<sc-button
				type="primary"
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
			>
				Resend Verification Email
			</sc-button>

			<InertiaLink
				:href="route('logout')"
				as="button"
				class="underline text-sm text-gray-600 hover:text-gray-900"
				method="post"
			>
				Log Out
			</InertiaLink>
		</div>
	</form>
</template>
