<script setup lang="ts">

import {ToolInterface} from "@/types/modelInterfaces.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ThemeSelector from "@/Components/Ui/ThemeSelector.vue"
import axios from "axios"
import ScButton from "@/Components/Ui/scButton.vue"
import {AxiosErrorMessage} from "@/types"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const tool = defineModel<ToolInterface>('tool')

const flash = useStoreFlashMessage()

// save the tool
function updateTool() {
	axios.post(route('api.admin.tools.update', {tool: tool.value.id}), {
		title: tool.value.title,
		body: tool.value.body,
		theme_id: tool.value.theme_id,
		_method: "PATCH"
	})
		.then(() => {
			flash.success("L'outils à bien été enregistré.")
		})
		.catch((error: AxiosErrorMessage) => {
			flash.error("Il y a eu un problème lors de l'enregistrement de l'outil.")
			console.warn(error)
		})
}
</script>

<template>
	<div
		:key="tool.id"
		class="grid grid-cols-2 gap-3"
	>
		<div class="flex flex-col gap-3">
			<form-maker
				v-model="tool.title"
				label="titre"
				focus
			/>

			<form-maker
				v-model="tool.body"
				label="body"
				type="textarea"
			/>


			<theme-selector
				xs
				v-model="tool.theme_id"
				@change="updateTool"
			/>

			<sc-button
				@click="updateTool"
				:theme="tool.theme_id"
			>
				Enregistrer
			</sc-button>
		</div>

		<div
			class="bg-content border rounded-sm"
		>
			<header
				class="flex justify-between border-b px-3 py-2"
				v-theme.bg.text="tool.theme_id ?? 0"
			>
				<InertiaLink
					as="div"
					class="cursor-pointer"
					:href="route('tools.show', {tool: tool.slug})"
				>
					<h3 class="text-lg leading-6 font-medium">
						{{ tool.title }}
					</h3>
					<p class="mt-1 max-w-2xl text-sm opacity-60 font-code">
						{{ tool.id }} : {{ tool.slug }}
					</p>
				</InertiaLink>
				<div class="text-xs text-right">
					<InertiaLink :href="route('admin.tools.edit', tool.id)">
						<i class="bi bi-pencil" />
					</InertiaLink>
					<div class="opacity-60">
						{{ tool.updated_at }}
					</div>
				</div>
			</header>
			<main class="px-3 py-3 font-extralight">
				{{ tool.body }}
			</main>
		</div>
	</div>
</template>
