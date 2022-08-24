<template>
	<h1 class="text-3xl pt-5 mb-10">
		Gestion des utilisateurs
	</h1>

	<div>
		<h2 class="text-lg">
			Ajouter des utilisateurs
		</h2>

		<div class="grid grid-cols-2 gap-3">
			<textarea
				v-model="usersEmails"
				rows="10"
				class="p-3"
			/>
			<div>
				<div v-for="email of usersEmailsList">
					{{ email }}
				</div>
			</div>
		</div>

		<form-input
			v-model="form.password"
			name="password"
			label="mot de passe"
		/>
		<button
			class="btn btn-primary"
			@click="addUsers"
		>
			Ajouter {{ usersEmailsList.length }} utilisateur(s)
		</button>
	</div>

	<div class="bg-white">
		<div
			v-for="user of users"
			:key="user.id"
			class="odd:bg-gray-50 px-5 py-4 flex justify-between"
		>
			<div class="user-wrapper-left">
				<h2 class="text-lg">
					{{ user.name }}
				</h2>
				<div class="text-xs">
					{{ user.email }}
				</div>
			</div>

			<div class="user-wrapper-right">
				<button
					class="btn-delete"
					@click="destroyUser(user.id)"
				>
					Supprimer
				</button>
			</div>
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

import {computed, ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import {useForm} from "@inertiajs/inertia-vue3"
import {Inertia} from "@inertiajs/inertia"

let props = defineProps({
	users: {type: Object}
})

let usersEmails = ref(""),
	usersEmailsList = computed(()=>{
		const sep = usersEmails.value.includes(";")?";":"\n"

		return usersEmails.value.split(sep).filter(x=>x!=="").map(x=>x.trim().toLowerCase())
	})


let form = useForm({
	users: [],
	password: "GymnaseScolcours"
})


function addUsers(){
	form.
		transform((data)=>({
			users: usersEmailsList.value,
			password: data.password
		})).
		post(route("admin.users.create"), {
			preserveScroll: true,
			onSuccess: ()=>form.reset()
		})

}
function destroyUser(id){
	axios.post(route("admin.users.destroy", [id]), {_method: "delete"}).then((res)=>{
		if(res.data){
			// Reload the page.
			Inertia.reload({only: ["users"]})
		}
	})
}
</script>

<style scoped>

</style>
