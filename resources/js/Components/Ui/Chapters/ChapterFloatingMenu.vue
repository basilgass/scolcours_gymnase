<template>
	<menu>
		<div
			class="fixed
					z-30
					bottom-0 left-0
					bg-gray-100
					border-t border-r border-gray-400
	 				w-full md:w-auto md:min-w-[300px]"
		>
			<transition name="slide-up">
				<div v-show="showMenu">
					<ChapterToc
						v-show="toc.length>0"
						class="flex flex-col gap-2 px-3 pt-3 pb-1"
						@menu-click="showMenu=false"
					/>
					<div class="w-full flex justify-between px-3 pb-3">
						<button
							class="flex gap-3 hover:gap-5 transition-all"
							title="Prochain exercice non résolu"
							@click="menuScrollToClass('unanswered')"
						>
							<i class="bi bi-journal-arrow-down" />
							<span class="text-sm">prochaine question non résolue</span>
						</button>
					</div>
				</div>
			</transition>
			<div class="px-3 py-2 flex justify-between items-center gap-3">
				<button
					title="formulaire"
					@click="show=!show"
				>
					<i
						class="bi bi-list-ul"
					/>
				</button>

				<span
					v-katex.auto="observeTitle"
					class="text-xs hover:font-semibold cursor-pointer"
					@click="showMenu=!showMenu"
				/>

				<i
					:class="showMenu?'bi-x-lg':'bi-three-dots-vertical'"
					class="bi cursor-pointer"
					@click="showMenu=!showMenu"
				/>
			</div>
		</div>
		<transition name="fade">
			<div
				v-show="show"
				class="fixed top-0 left-0 w-full h-full bg-black/60"
				@click="show=false"
			/>
		</transition>
		<transition name="slide-fade">
			<div
				v-show="show"
				class="fixed left-0 top-0 h-full h-full w-full md:w-auto md:min-w-[300px]"
			>
				<div
					class=" absolute right-2 top-2 cursor-pointer hover:rotate-180 hover:text-blue-700"
					@click="show=false"
				>
					<i class="bi bi-x-lg" />
				</div>
				<slot />
			</div>
		</transition>
	</menu>
</template>
<script setup>

import {computed, inject, ref} from "vue"
import ChapterToc from "@/Components/Ui/Chapters/ChapterToc"
import {menuScrollToClass} from "@/Composables/useHelpers"

let props = defineProps({
	observeTitle: {type: String, default: ""},
	menu: {type: Array, default: () => []}
})
let show = ref(false),
	showMenu = ref(false)

let chapterPosts = inject("chapterPosts")
let toc = computed(() => {
	if (props.menu.length > 0) {
		return props.menu
	} else {
		return chapterPosts.value
	}
})
</script>
