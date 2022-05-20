<template>
	<ArticleTitle
		title="Nouvel article"
		:subtitle="chapter.title"
	/>

	<div class="grid grid-cols-2 gap-4">
		<div class="max-h-[700px] overflow-y-scroll pr-3">
			<form
				ref="formPost"
				@submit.prevent="create_new_post()"
			>
				<form-select
					v-model="form.template.id"
					label="template"
					name="template"
					:error="form.errors.template"
				>
					<option
						v-for="item in props.templates"
						:key="'template-'+item.id"
						:value="item.id"
					>
						{{ item.name }}
					</option>
				</form-select>
				<form-input
					v-model="form.template.parameters"
					label="paramètre du template"
					name="template_parameters"
					:error="form.errors.template"
				/>

				<form-input
					v-model="form.title"
					label="titre"
					name="title"
					:error="form.errors.title"
				/>

				<form-textarea
					v-model="form.body"
					label="body"
					name="body"
					:error="form.errors.body"
				/>

				<form-input
					v-model="form.answer.body"
					name="answer"
					label="réponse"
				/>
				<form-input
					v-model="form.answer.checker"
					name="answer_checker"
					label="système de validation"
				/>

				<div v-show="addWalkthrough">
					<h2 class="font-lg font-semibold mt-10">
						Marche à suivre
					</h2>
					<button
						type="button"
						class="btn"
						@click.prevent="form.walkthrough.push({
							step: '',
							resolution: ''
						})"
					>
						+
					</button>
					<div
						v-for="(walk, index) in form.walkthrough"
						:key="`walk-${index}`"
					>
						<form-input
							v-model="form.walkthrough[index].step"
							:name="`walk-step-${index}`"
							:label="`Etape ${index+1}`"
							:error="form.errors.walkthrough"
						/>
						<form-textarea
							v-model="form.walkthrough[index].resolution"
							name="`walk-step-${index}`"
							label="Résolution"
							:error="form.errors.walkthrough"
						/>
					</div>
				</div>

				<div v-show="addIllustrations">
					<h2 class="font-lg font-semibold mt-10">
						Illustrations
					</h2>

					<button
						type="button"
						class="btn"
						@click.prevent="form.illustrations.push({
							title: '',
							type: 'draw',
							code: '',
							parameters: ''
						})"
					>
						+
					</button>
					<div
						v-for="(walk, index) in form.illustrations"
						:key="`illustration-${index}`"
					>
						<form-illustration
							v-model="form.illustrations[index]"
							:name="`illustration-${index}`"
						/>
					</div>
				</div>
				<form-button>Ajouter</form-button>
			</form>


			<div class="grid grid-cols-3 gap-5 mt-10">
				<button
					class="btn bg-white"
					@click="addWalkthrough=!addWalkthrough"
				>
					Walkthrough
				</button>
				<button
					class="btn bg-white"
					@click="addIllustrations=!addIllustrations"
				>
					Illustrations
				</button>
			</div>
		</div>

		<div class="max-h-[700px] overflow-y-scroll">
			<component
				:is="PostTemplate"
				:post="PostModel"
			/>
		</div>
	</div>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>


<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle"
import FormInput from "@/Components/Form/FormInput"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormSelect from "@/Components/Form/FormSelect"
import {useForm} from "@inertiajs/inertia-vue3"
import FormButton from "@/Components/Form/FormButton"
import {ref} from "vue"
import {computed, defineAsyncComponent} from "vue"
import FormIllustration from "@/Components/Form/FormIllustration"

const props = defineProps({
	chapter: {type: Object, default: ()=>{}},
	// chapters: {type: Array, default: () => []},
	templates: {type: Array, default: () => []}
})

let addWalkthrough = ref(false),
	addIllustrations = ref(false)

const form = useForm({
	chapter: props.chapter.id,
	title: "",
	body: "",
	template: {
		id: props.templates[0].id.toString(),
		parameters: ""
	},
	answer: {
		body: "",
		checker: ""
	},
	walkthrough: [],
	illustrations: []
})

const PostTemplate = computed(
	()=> {
		let theTemplate = props.templates.filter(t=> t.id === +form.template.id)[0] || ""
		return defineAsyncComponent(
			() => import(`@/Components/Posts/Templates/${theTemplate.component}`)
		)
	}
)

const PostModel = computed(()=>{
	let post = {
		title: form.title,
		body: form.body,
		answer: form.answer,
		walkthrough: form.walkthrough,
		illustrations: form.illustrations
	}
	return post
})

function create_new_post(){
	form.post("/post", {
		preserveScroll: true,
		onError: () => {
			console.log(form.errors)
		}
	})
}
</script>
