<template>
	<div>
		<div
			class="fixed
					z-30
					bottom-0 left-0
					bg-gray-50
					border-t border-r border-gray-400
	 				w-full h-10 md:w-auto md:min-w-[300px]"
		>
			<div
				class="px-3 py-2 flex items-center gap-3 hover:bg-gray-200"
				:class="showMenu?'bg-gray-200':''"
			>
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
					class="text-xs hover:font-semibold cursor-pointer flex-1"
					@click="showMenu=!showMenu"
				/>

				<i
					:class="showMenu?'bi-x-lg':'bi-three-dots-vertical'"
					class="bi cursor-pointer"
					@click="showMenu=!showMenu"
				/>

				<button
					v-if="$page.props.auth.can.admin"
					@click="editMode = !editMode"
				>
					<i
						class="bi bi-pencil"
						:class="editMode?'text-green-600':'text-amber-600'"
					/>
				</button>
			</div>
		</div>
		<!-- background fade --->
		<transition name="fade">
			<div
				v-show="show || showMenu"
				class="fixed top-0 left-0 w-full h-full bg-black/60"
				@click="show=false; showMenu = false"
			/>
		</transition>
		<!-- table of content -->
		<transition name="slide-up">
			<div
				v-show="showMenu"
				class="fixed
					z-10
					bottom-0 left-0
					pb-10
					bg-gray-50
					border-t border-r border-gray-400
	 				w-full md:w-auto md:min-w-[300px]
	 				grid grid-cols-1 divide-y divide-gray-200 max-h-full overflow-y-auto"
			>
				<ChapterToc
					v-show="toc.length>0"
					floating
					@menu-click="showMenu=false"
				/>

				<div class="w-full p-3">
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
		<!-- custom item to include as slot, siding from the left. -->
		<transition name="slide-fade">
			<div
				v-show="show"
				class="z-10 fixed left-0 top-0 h-full h-full w-full md:w-auto md:min-w-[300px]"
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
	</div>
</template>
<script setup>

import {computed, inject, ref} from "vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import {menuScrollToClass} from "@/Composables/useHelpers"

let props = defineProps({
	observeTitle: {type: String, default: ""},
	menu: {type: Array, default: () => []}
})
let show = ref(false),
	showMenu = ref(false),
	editMode = inject("editmode")

let chapterPosts = inject("chapterPosts")
let toc = computed(() => {
	if (props.menu.length > 0) {
		return props.menu
	} else {
		return chapterPosts.value
	}
})
</script>
