<script
	setup
	lang="ts"
>

import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import { ToolInterface } from "@/types/modelInterfaces.ts"
import { useForm } from "@inertiajs/vue3"
import { inject, PropType } from "vue"

defineOptions({ layout: LayoutMain })

const flash = inject<flashInterface>("flash")

const props = defineProps({
	tool: { type: Object as PropType<ToolInterface>, required: true }
})

const form = useForm({
	title: props.tool.title,
	body: props.tool.body
})
function saveTool() {
	form.post(route('api.tools.update', [props.tool.id]),
		{
			onSuccess: () => {
				flash.success("L'outil a été enregistré")
			},
			onError: () => {
				flash.error("Erreur lors de l'enregistrement de l'outil...")
			}
		})
}

</script>

<template>
	<section class="scolcours-container">
		<div class="flex justify-between items-baseline py-3 mb-5">
			<h1>
				<span class="text-xl md:text-2xl">édition d'un outil</span>
				<span class="text-xs font-code ml-5">(id: {{ tool.id }})</span>
			</h1>
			<div class="flex gap-3 justify-end">
				<button
					class="btn-primary btn-xs"
					@click="saveTool"
				>
					enregistrer
				</button>
				<InertiaLink
					class="btn btn-cancel btn-xs"
					:href="route('tools.show', [tool.slug])"
				>
					retour
				</InertiaLink>
			</div>
		</div>

		<div>
			<form-maker
				v-model="form.title"
				label="titre"
				focus
			/>

			<form-maker
				v-model="form.body"
				label="body"
				type="textarea"
			/>
		</div>
	</section>
</template>


