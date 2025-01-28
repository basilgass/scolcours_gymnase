<script setup lang="ts">

import {BlockInterface} from "@/types/modelInterfaces.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import {ref} from "vue"

const props = defineProps<{
	recto: BlockInterface,
	verso: BlockInterface
}>()

const cardSide = ref<"recto" | "verso">("recto")
const cardHide = ref<boolean>(false)

</script>

<template>
	<div
		:class="{ 'is-flipped': cardSide==='verso' }"
		class="relative card transition duration-1000 w-full aspect-[4/3]"
		@click="cardSide=cardSide==='verso'?'recto':'verso'"
	>
		<div class="card-face front ">
			<div
				class="bg-white w-full h-full rounded-xl px-5 py-3 grid place-items-center"
			>
				<!-- body -->
				<markdown-it
					:text="recto.body"
					class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				/>
				<!-- Illustration -->
				<illustration-show
					v-if="recto.illustrations.length > 0"
					:illustration="recto.illustrations[0]"
					class="h-full w-full max-w-[600px]"
					click-through
				/>
			</div>
		</div>
		<div class="card-face back ">
			<div
				class="bg-white w-full h-full rounded-xl px-5 py-3 grid place-items-center"
				:class="cardHide?'invisible':''"
			>
				<!-- body -->
				<markdown-it
					:text="verso.body"
					class="text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				/>
				<!-- Illustration -->
				<illustration-show
					v-if="verso.illustrations.length > 0"
					:illustration="verso.illustrations[0]"
					class="h-full w-full max-w-[600px]"
					click-through
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

.card-face {
	@apply absolute w-full h-full transition-transform duration-500 shadow-xl border rounded-xl grid place-items-center;
	backface-visibility: hidden;
}

.front {
	transform: rotateY(0deg);
}

.back {
	transform: rotateY(180deg);
}

.card.is-flipped .front {
	transform: rotateY(-180deg);
}

.card.is-flipped .back {
	transform: rotateY(0deg);
}

</style>
