<template>
	<h1 class="text-3xl pt-5 mb-10">
		Administration
	</h1>
	
	<div class="space-y-4">
		<Panel>
			<h2 class="text-lg my-2">
				Chapitres
			</h2>
			<div class="w-full">
				<div
						v-for="chapter in chapters"
						:key="chapter.slug"
						class="hover:bg-gray-200 flex justify-between px-4 py-2"
					>
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							{{ chapter.title }}
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ chapter.slug }}
						</p>
					</div>
					<div>
						<div>{{ chapter.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</div>
		</Panel>
		
		<Panel>
			<h2 class="text-lg my-2">
				Outils
			</h2>
			<div class="w-full">
				<div
						v-for="challenge in challenges"
						:key="challenge.slug"
						class="hover:bg-gray-200 flex justify-between px-4 py-2"
					>
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							{{ challenge.title }}
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ challenge.slug }}
						</p>
					</div>
					<div>
						<div>{{ challenge.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</div>
		</Panel>
		
		<Panel>
			<h2 class="text-lg my-2">
				Outils
			</h2>
			<div class="w-full">
				<div
						v-for="tool in tools"
						:key="tool.slug"
						class="hover:bg-gray-200 flex justify-between px-4 py-2"
					>
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							{{ tool.title }}
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ tool.slug }}
						</p>
					</div>
					<div>
						<div>{{ tool.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</div>
		</Panel>
	</div>
</template>

<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>
<script setup>
import Panel from '@/Components/Ui/Panel'

const props = defineProps({
	tools: Object,
	chapters: Object,
	challenges: Object
})
</script>

<style scoped>

</style>
