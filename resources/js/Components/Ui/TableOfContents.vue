<template>
	<div ref="root">
		<div
			ref="toc"
			class="my-10"
		>
			<h3 class="font-light text-lg my-5">
				table des matières
			</h3>
			<ol
				v-if="menu.length>0"
				class="space-y-2 list list-inside list-decimal"
			>
				<li
					v-for="(item, index) in menu"
					:key="`${props.menuId}${index}`"
				>
					<a
						class="hover:underline"
						:href="`#${props.menuId}${index}`"
						@click.prevent="menuScrollTo(`#menu-${index}`)"
						v-html="item"
					/>
				</li>
			</ol>
		</div>
		<div
			class="table-of-contents-data"
			v-bind="$attrs"
		>
			<slot />
		</div>
	</div>
</template>
<script setup>

import {onMounted, onUpdated, ref} from "vue"

let props = defineProps({
	query: {type: String, default: ".chapter-menu"},
	menuId: {type: String, default: "menu-"}
})

let root = ref(null),
	toc = ref(null),
	menu = ref([]),
	parent = ref(false)

onMounted(()=>{
	root.value.querySelectorAll(props.query).forEach(h2=> {
		h2.id = `${props.menuId}${menu.value.length}`
		menu.value.push(h2.innerHTML)
	})
})

onUpdated(()=>{
	katexAutoRender(root.value)
})

function menuScrollTo(id){
	toc.value.querySelector(id).scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}
</script>
