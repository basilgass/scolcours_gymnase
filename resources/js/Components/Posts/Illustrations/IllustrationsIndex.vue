<script lang="ts" setup>
import { computed, inject, PropType, ref } from "vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import axios from "axios"
import { editModeInterface, flashInterface } from "@/types"
import { IllustrationInterface } from "@/types/modelInterfaces"
import FormMaker from "@/Components/Form/FormMaker.vue"

const props = defineProps({
	illustrations: { type: Array as PropType<IllustrationInterface[]>, required: true },
	containerType: { type: String, required: true },
	containerId: { type: Number, required: true },
	grid: { type: String, default: null }
})

const flash = inject<flashInterface>("flash"),
	editMode = inject<editModeInterface>("editMode")

const theIllustrations = ref(props.illustrations)

const illustrationsCustomGrid = ref(props.grid)
const illustrationsGridClass = computed(() => {
	if (illustrationsCustomGrid.value) {
		return illustrationsCustomGrid.value
	}

	let grid = "grid grid-cols-1"

	if (theIllustrations.value.length === 2) {
		grid += " xl:grid-cols-2"
	} else if (theIllustrations.value.length >= 3) {
		grid += " md:grid-cols-2 xl:grid-cols-3"
	}

	return grid
})
const updateIllustrationsGrid = function() {
	axios
		.patch(
			route("blocks.updateIllustrationsGrid", [props.containerId]),
			{
				_method: "PATCH",
				grid: illustrationsCustomGrid.value
			}
		)
		.then(() => {
			flash.success("la grille a bien été mise à jour !")
		})
		.catch(() => {
			flash.error("la grille n'a pas pu être mise à jour !")
		})
}

const addIllustration = function() {
		axios
			.post(
				route("blocks.illustrations.store", [props.containerId]),
				{}
			)
			.then((res) => {
				res.data.isNew = true
				theIllustrations.value.push(res.data)
				// edit the new illustration.

				flash.success("une nouvelle illustration a été créée")
			})
	},
	updateIllustrationsOrder = function() {
		axios
			.post(
				route("blocks.illustrations.order", [props.containerId]),
				{
					order: theIllustrations.value.map(
						(illustration: IllustrationInterface, index) => {
							return {
								id: illustration.id,
								order: index + 1
							}
						}
					),
					_method: "PATCH"
				}
			)
			.then(() => {
				flash.success("les illustrations ont bien été réordonées !")
			})
			.catch((res) =>
				console.warn("update ordering illustrations: ", res)
			)
	},
	destroyIllustration = function(destroyId) {
		theIllustrations.value = theIllustrations.value.filter(
			(x: IllustrationInterface) => x.id !== destroyId
		)
	}
</script>

<template>
	<div>
		<div
			v-if="props.containerType === 'Block'"
			v-show="editMode.enabled.value && theIllustrations.length > 0"
			v-admin
			v-theme.bg.text.admin
			class="p-3 mb-3"
		>
			<div class="flex justify-between">
				<div class="uppercase">
					Administration des illustrations
				</div>
			</div>
			<div class="mt-5 flex gap-3">
				<form-maker
					v-model="illustrationsCustomGrid"
					class="flex-1"
					font-code
					inline-label
					label="Gestion de la grille"
					sm
					@enter="updateIllustrationsGrid"
				/>
				<button
					class="btn btn-xs"
					@click="illustrationsCustomGrid = ''"
				>
					<i class="bi bi-ban" />
				</button>
				<button
					class="btn btn-xs"
					@click="illustrationsCustomGrid = 'grid grid-cols-1'"
				>
					grid-1
				</button>
				<button
					class="btn btn-xs bg-gray-100 text-slate-600"
					@click="updateIllustrationsGrid"
				>
					<i class="bi bi-check2" />
				</button>
			</div>
		</div>
		<draggable
			v-model="theIllustrations"
			:class="illustrationsGridClass"
			class="w-full gap-5"
			handle=".draggable-handle"
			item-key="id"
			v-bind="{
				animation: 200,
				disabled: !$page.props.auth.can.admin,
			}"
			@end="updateIllustrationsOrder"
		>
			<template #item="{ element }">
				<illustration-show
					:illustration="element"
					@destroy="destroyIllustration"
				/>
			</template>
			<template #footer>
				<button
					v-show="editMode.enabled.value"
					v-admin
					class="btn-new-inline"
					@click="addIllustration"
				>
					ajouter une illustration
				</button>
			</template>
		</draggable>
	</div>
</template>

<style scoped></style>
