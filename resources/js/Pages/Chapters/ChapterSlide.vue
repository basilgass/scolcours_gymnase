<template>
	<section class="py-5">
		<post-show :post-id="props.postId" />

		<div class="grid grid-cols-5 mt-3">
			<div class="justify-self-start">
				<Link
					v-if="nav.previous"
					:href="nav.previous"
					class="hover:pl-3 transition-all"
				>
					<i class="bi bi-box-arrow-in-left mr-2" />précédant
				</Link>
			</div>
			<div class="justify-self-center col-span-3">
				<Menu
					as="div"
					class="relative inline-block text-left"
				>
					<div>
						<MenuButton class="text-lg">
							<i class="bi bi-three-dots-vertical" /><span v-katex.auto="postTitle" />
						</MenuButton>
					</div>

					<transition
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="transform scale-95 opacity-0"
						enter-to-class="transform scale-100 opacity-100"
						leave-active-class="transition duration-75 ease-in"
						leave-from-class="transform scale-100 opacity-100"
						leave-to-class="transform scale-95 opacity-0"
					>
						<MenuItems
							class="absolute left-0 bottom-10 mb-2 grid grid-cols-1 place-items-center"
						>
							<div class="min-w-[90vw] md:min-w-[400px] max-h-[80vh] overflow-y-scroll origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col">
								<MenuItem
									v-for="(post, id) in theChapter.posts"
									:key="`link-${id}`"
									class="hover:pl-6 transition-all px-3 py-2"
									:class="+props.postId===+id?'bg-blue-100':''"
								>
									<Link :href="post.url">
										<i
											class="mr-2"
											:class="{
												'bi bi-calculator': post.type==='exercise',
												'bi bi-text-paragraph': !post.type
											}"
										/>
										<span v-katex.auto="post.title" />
									</Link>
								</MenuItem>
							</div>
						</MenuItems>
					</transition>
				</Menu>
			</div>
			<div class="justify-self-end">
				<Link
					v-if="nav.next"
					:href="nav.next"
					class="hover:pr-3 transition-all"
				>
					suivant<i class="bi bi-box-arrow-in-right ml-2" />
				</Link>
			</div>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, ref} from "vue"
import PostShow from "@/Components/Posts/PostShow.vue"
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue"

let props = defineProps({
		chapter: {type: Object, required: true},
		postId: {type: Number, required: true},
		postNb: {type: Number, required: true},
		nav: {type: Object, required: true}
	}),
	theChapter = ref(props.chapter.data),
	postTitle = computed(()=>{
		return theChapter.value.posts[props.postNb].title
	})
</script>
