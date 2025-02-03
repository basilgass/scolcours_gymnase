<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { flashInterface } from "@/types"
import { ThemeInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { inject, PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })
const flash = inject<flashInterface>("flash")

const props = defineProps({
	allThemes: { type: Object as PropType<ThemeInterface[]>, required: true },
	title: { type: String, required: true },
})

const title = ref(props.title),
	themes = ref(props.allThemes.map(theme=>{
		theme.enabled = !!theme.enabled
		return theme
	}))
function saveConfig () {
	console.log('SAVE CONFIG')
		axios
			.post(route("admin.config.update"), {
				title: title.value,
				themes: themes.value,
				_method: "PATCH",
			})
			.then(() => {
				flash.success(
					"les modifications de configuration ont bien été changées !"
				)
			})
			.catch((err) => {
				console.warn(err)
			})
	}
function sortEvent() {
		axios
			.post(route("admin.config.updateOrder"), {
				_method: "PATCH",
				order: themes.value.map((x, index) => {
					return { id: x.id, order: index + 1 }
				}),
			})
			.then(() => {
				flash.success("L'ordre des thèmes à bien été enregistré !")
			})
			.catch((res) => {
				console.warn("update ordering order: ", res)
			})
	}
</script>
<template>
	<main class="scolcours-container">
		<section class="flex flex-col gap-5">
			<h1 class="text-3xl pt-5">
				Configuration du site web
			</h1>

			<form-maker
				v-model="title"
				label="titre du site web"
				name="title"
			/>

			<div class="flex flex-col gap-3">
				<draggable
					v-model="themes"
					item-key="id"
					class="flex flex-col gap-3"
					handle=".draggable-handle"
					v-bind="{
						animation: 200,
					}"
					@update="sortEvent"
				>
					<template #item="{ element }: {element: ThemeInterface}">
						<div class="flex gap-3 items-center">
							<div class="text-3xl draggable-handle cursor-move">
								<i class="bi bi-arrows-move" />
							</div>
							<div
								v-theme.bg.text="element.slug"
								class="text-white px-4 py-2 rounded flex-1 grid grid-cols-1 gap-3 place-items-center"
							>
								<div>{{ element.title }}</div>
								<i :class="`${element.icon}`" />
							</div>

							<form-maker
								type="switch"
								v-model="element.enabled"
								:name="`${element}-enabled`"
								label="activé,désactivé"
								@change="saveConfig"
							/>
						</div>
					</template>
				</draggable>
			</div>
		</section>
	</main>
</template>
