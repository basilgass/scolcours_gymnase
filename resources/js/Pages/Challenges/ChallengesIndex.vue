<template>
	<div>
		<h1 class="text-xl font-semibold">
			Challenges
		</h1>
		<form-input
			class="mb-5"
			label="rechercher"
			name="search"
		/>

		<div class="space-y-2 py-2">
			<div
				v-for="challenge in challenges"
				:key="challenge"
				class="border-b last:border-b-0 pb-2 last:pb-0 flex justify-between items-center"
			>
				<Link
					:href="`/challenge/${challenge.slug}`"
					class="hover:underline"
				>
					{{ challenge.title }}
				</Link>

				<div
					v-if="$page.props.auth.can.admin"
					class="flex items-center"
				>
					<div v-if="challenge.sessions.length>0">
						<div
							v-for="(qsession, index) in challenge.sessions"
							:key="`challenge-session-${ChallengesIndex}`"
						>
							<Link :href="qsession.token">
								{{ qsession.token }}
							</Link>
							<i
								v-if="$page.props.auth.can.admin"
								class="bi bi-stop-fill cursor-pointer px-2"
							/>
						</div>
					</div>

					<div v-if="$page.props.auth.can.admin">
						<Link
							:href="`/challenge/${challenge.slug}/start`"
							as="div"
							method="post"
						>
							<i class="bi bi-play-fill px-2" />
						</Link>
					</div>
				</div>
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
import {ref} from "vue"
import FormInput from "@/Components/Form/FormInput"

defineProps({
	challenges: Object
})

let test = ref("")
</script>

