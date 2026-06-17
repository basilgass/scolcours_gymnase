<script setup lang="ts">

import {ToolInterface} from "@/types/modelInterfaces.ts"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import ThemeSelector from "@/Components/Ui/ThemeSelector.vue"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const tool = defineModel<ToolInterface>('tool')

const flash = useStoreFlashMessage()

// save the tool
function updateTool() {
	axios
		.patch(route('api.admin.tools.update', {tool: tool.value.id}), {
			title: tool.value.title,
			body: tool.value.body,
			theme_id: tool.value.theme_id
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
		<card>
			<div class="flex flex-col gap-3">
				<FormInput
					v-model="tool.title"
					label="titre"
					focus
				/>

				<FormTextarea
					v-model="tool.body"
					label="body"
				/>


				<theme-selector
					v-model="tool.theme_id"
					xs
					@change="updateTool"
				/>
			</div>

			<template #footer>
				<div class="flex justify-end">
					<sc-button
						type="save"
						icon
						xs
						@click="updateTool"
					>
						Enregistrer
					</sc-button>
				</div>
			</template>
		</card>

		<card
			class="bg-content border rounded-sm"
			:header-theme="tool.theme_id"
		>
			<template #header>
				<div class="flex justify-between ">
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
						<div class="opacity-60">
							{{ tool.updated_at }}
						</div>
					</div>
				</div>
			</template>
			<div class="px-3 py-3 font-extralight">
				{{ tool.body }}
			</div>
		</card>
	</div>
</template>
