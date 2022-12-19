<template>
	<div>
		<div class="flex justify-between">
			<h1>éditer le chapitre</h1>

			<div class="flex gap-4">
				<form-button @click.prevent="save">
					Enregistrer
				</form-button>

				<form-button
					type="button"
					class="btn-delete"
					@click.prevent="cancel"
				>
					Annuler
				</form-button>
			</div>
		</div>

		<form>
			<form-input
				v-model="Form.title"
				label="Titre"
				name="title"
				:error="Form.errors.title"
			/>
			<form-input
				v-model="Form.slug"
				label="Slug"
				name="slug"
				disabled
				:error="Form.errors.slug"
			/>
		</form>

		<block-form
			v-model="Form.block"
			no-title
			no-switch
			no-script
			no-data
			class="mt-10"
		/>
	</div>
</template>


<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {layout: LayoutMain}
</script>
<script setup>
import FormInput from "@/Components/Form/FormInput.vue"
import {useForm} from "@inertiajs/inertia-vue3"
import FormButton from "@/Components/Form/FormButton.vue"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"

const $emits = defineEmits(["close"])
const props = defineProps({
	chapter: Object,
	inline: {type: Boolean, default: false}
})

let Form = useForm({
	title: props.chapter.title,
	slug: props.chapter.slug,
	body: props.chapter.body,
	block: props.chapter.block
})

function save() {
	axios.post(
		route("chapters.update", [props.chapter.slug]),
		{
			...Form.data(),
			_method: "patch"
		},
	).then(res => {
		$emits("close", res.data)
	}).catch(err => {
		console.log(err)
	})
}

function cancel() {
	$emits("close", false)
}
</script>
