<script
	lang="ts"
	setup
>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {BlockInterface, WidgetPropsInterface} from "@/types/modelInterfaces"
import axios from "axios"
import {onMounted, ref} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {Link} from "@inertiajs/vue3"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const blocks = ref<BlockInterface[]>([])

onMounted(() => {
	// props.illustrations.code is like:
	// <id1>[,some parameters]
	// <id2>[,some parameters]
	// <id3>[,some parameters]
	const ids = props.illustration.code
		.split('\n')
		.map(line => line.split(',')[0])
		.map(Number)

	axios.get(route("api.blocks.index", {
		ids: ids
	}))
		.then((res: AxiosResponseModel<BlockInterface[]>) => {
			// Sort the value to match the id's order
			blocks.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
})

</script>

<template>
	<div
		class="flex flex-wrap
	gap-5
	place-items-center"
	>
		<block-show
			v-for="block in blocks"
			:key="block.id"
			v-theme.border
			:block
			class="w-full"
			no-admin
		>
			<template #footer>
				<div class="flex justify-end w-full px-3 py-1">
					<Link :href="route('blocks.show', {id: block.id})">
						<i class="bi bi-arrow-right mr-1" /> consulter la page originale
					</Link>
				</div>
			</template>
		</block-show>
	</div>
</template>


