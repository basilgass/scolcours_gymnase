<script setup lang="ts">

import {ToolInterface} from "@/types/modelInterfaces.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ThemeSelector from "@/Components/Ui/ThemeSelector.vue"
import axios from "axios"

const tool = defineModel<ToolInterface>('tool')


// save the tool
function updateTool() {
	axios.post(route('tools.update', tool.value.id), {
		title: tool.value.title,
		body: tool.value.body,
		theme_id: tool.value.theme_id
	})
		.then(response => {
			console.log(response.data)
		})
		.catch(error => {
			console.log(error)
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
				v-model="tool.theme_id"
			/>

			<button @click="updateTool">
				Enregristrer
			</button>
		</div>

		<div
			class="bg-white border rounded-sm"
		>
			<header
				class="flex justify-between border-b px-3 py-2"
				v-theme.bg.text="tool.theme_id ?? 0"
			>
				<InertiaLink
					as="div"
					class="cursor-pointer"
					:href="route('tools.tool', [tool.slug])"
				>
					<h3 class="text-lg leading-6 font-medium">
						{{ tool.title }}
					</h3>
					<p class="mt-1 max-w-2xl text-sm opacity-60">
						{{ tool.slug }}
					</p>
				</InertiaLink>
				<div class="text-xs text-right">
					<InertiaLink :href="route('tools.edit', tool.id)">
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
