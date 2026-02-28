<script lang="ts" setup>

import {Head, useForm} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"
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
	<Head title="Vérification de l'email" />

	<div class="mb-4 text-sm text-gray-600">
		Merci de vous être inscrit. Il ne vous reste plus qu'à vérifier votre adresse email en cliquant sur le
		lien de confirmation que vous devriez avoir reçu.
	</div>

	<div
		v-if="verificationLinkSent"
		class="mb-4 font-medium text-sm text-green-600"
	>
		Un nouveau lien de vérification vient de vous être envoyé.
	</div>

	<form @submit.prevent="submit">
		<div class="mt-4 flex items-center justify-between">
			<sc-button
				:class="{ 'opacity-25': form.processing }"
				:disabled="form.processing"
				type="primary"
			>
				Renvoyer un email de vérification
			</sc-button>

			<InertiaLink
				:href="route('logout')"
				as="button"
				class="underline text-sm text-gray-600 hover:text-gray-900"
				method="post"
			>
				Déconnecter
			</InertiaLink>
		</div>
	</form>
</template>
