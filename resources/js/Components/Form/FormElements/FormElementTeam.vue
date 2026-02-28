<script lang="ts" setup>
import {onMounted, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {TeamInterface} from "@/types/modelInterfaces.ts"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import axios from "axios"
import {AxiosResponseModel} from "@/types"

const theValue = defineModel<TeamInterface>()

defineOptions({
	inheritAttrs: false
})

const props = withDefaults(defineProps<{
	focus?: boolean,
}>(), {
	focus: false,
})

const inp = ref(null)

function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) {
		inp.value.select()
	}
}

defineExpose({focus: focusFn})

const update = () => {
	// emits("update", theValue.value)
}

onMounted(() => {
	loadTeams()
	if (props.focus) focusFn(false)
})

const teams = ref<TeamInterface[]>([])

function loadTeams() {
	axios.get(
		route('api.admin.teams.index')
	)
		.then((res: AxiosResponseModel<TeamInterface[]>) => {
			teams.value = res.data
		})
}

</script>
<template>
	<form-maker-wrapper
		v-bind="{...$attrs,...props}"
		input-class="bg-none"
	>
		<div
			class="flex gap-2 flex-wrap"
			v-bind="$attrs"
		>
			<sc-button
				v-for="team in teams"
				:key="`team-${team.id}`"
				:outline="theValue?.id !== team.id"
				xs
				@click="theValue = team"
			>
				{{ team.name }}
			</sc-button>
		</div>
	</form-maker-wrapper>
</template>
