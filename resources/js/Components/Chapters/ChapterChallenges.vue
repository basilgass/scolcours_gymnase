<!-- component to show the challenges list in the chapterPage -->
<template>
	<div
		v-if="chapter.challenges"
		class="mb-5"
	>
		<h3 class="uppercase font-extralight mb-2">
			challenges
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 lg:gap-3">
			<Link
				v-for="challenge in chapter.challenges"
				:key="`challenge-${challenge.id}`"
				class="min-h-[80px] w-full h-full"
				:class="`btn-scolcours-${$page.props.theme.slug}`"
				as="button"
				type="button"
				:href="route('chapters.challenge', [$page.props.theme.slug, chapter.slug, challenge.slug])"
			>
				{{ challenge.title }}
			</Link>

			<div
				v-if="$page.props.auth.can.admin"
				class="min-h-[100px] grid place-items-center"
			>
				<button
					class="btn-new"
					@click="show=true"
				>
					Nouveau challenge
				</button>
				<dialog-modal
					v-model="show"
					class="max-w-[30em]"
				>
					<template #header>
						<div class="bg-white flex justify-between items-baseline border-b border-gray-200 px-5 py-3 mb-5">
							<h1>
								<span class="text-xl md:text-2xl">créer un challenge</span>
							</h1>
						</div>
					</template>

					<template #footer>
						<div class="bg-white flex justify-end items-baseline border-t border-gray-200 px-5 py-3 mt-5">
							<form-button @click="storeChallenge">
								Créer un nouveau challenge
							</form-button>
						</div>
					</template>
					<div class="px-5">
						<form-input
							v-model="form.title"
							label="Nouveau challenge"
							name="newChallenge"
							:focus="true"
							@enter="storeChallenge"
							@cancel="show=false"
						/>
					</div>
				</dialog-modal>
			</div>
		</div>
	</div>
</template>

<script setup>
import DialogModal from "@/Components/Ui/DialogModal.vue"
import {ref} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {useForm} from "@inertiajs/inertia-vue3"
import FormButton from "@/Components/Form/FormButton.vue"

let props = defineProps({
	chapter: {type: Object,required:true}
})

let show = ref(false),
	form = useForm({
		title: "nouveau challenge"
	}),
	storeChallenge = function(){
		form.post(route("chapters.challenges.store", [props.chapter.slug]))
	}
</script>
