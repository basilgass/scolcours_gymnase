<script
	setup
	lang="ts"
>

import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

defineProps({
	challenges: { type: Object, required: true }
})

</script>
<template>
	<div>
		<h1 class="text-xl font-semibold">
			Challenges
		</h1>
		<!--		<form-maker-->
		<!--			class="mb-5"-->
		<!--			label="rechercher"-->
		<!--			name="search"-->
		<!--		/>-->

		<div class="space-y-2 py-2">
			<div
				v-for="challenge in challenges"
				:key="challenge"
				class="border-b last:border-b-0 pb-2 last:pb-0 flex justify-between items-center"
			>
				<InertiaLink
					:href="`/challenge/${challenge.slug}`"
					class="hover:underline"
				>
					{{ challenge.title }}
				</InertiaLink>

				<div
					v-admin
					class="flex items-center"
				>
					<div v-if="challenge.sessions.length > 0">
						<div
							v-for="(qsession) in challenge.sessions"
							:key="`challenge-session-${qsession.id}`"
						>
							<InertiaLink :href="qsession.token">
								{{ qsession.token }}
							</InertiaLink>
							<i
								v-admin
								class="bi bi-stop-fill cursor-pointer px-2"
							/>
						</div>
					</div>

					<div v-admin>
						<InertiaLink
							:href="`/challenge/${challenge.slug}/start`"
							as="div"
							method="post"
						>
							<i class="bi bi-play-fill px-2" />
						</InertiaLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
