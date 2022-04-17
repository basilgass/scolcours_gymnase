<template>
	<div
		ref="root"
		class="relative"
	>
		<div class="mt-2 mb-10">
			<h3 class="font-light text-lg my-5">
				table des matières
			</h3>
			<ol
				v-if="menu.length>0"
				class="space-y-2 list list-inside list-decimal ml-5"
			>
				<li
					v-for="(item, index) in menu"
					:key="`${props.menuId}${index}`"
					class="hover:ml-2 transition-all"
				>
					<a
						:href="`#${props.menuId}${index}`"
						class="hover:underline"
						@click.prevent="menuScrollTo(`#menu-${index}`)"
						v-html="item"
					/>
				</li>
			</ol>
		</div>
		<div
			ref="tableocontents"
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
	tableocontents = ref(null),
	menu = ref([]),
	parent = ref(false)

onUpdated(() => {
	katexAutoRender(root.value)
})

onMounted(()=>{
	buildMenu()
})
function buildMenu() {
	root.value.querySelectorAll(props.query).forEach(h2 => {
		h2.id = `${props.menuId}${menu.value.length}`
		menu.value.push(h2.innerHTML)
	})
}

function menuScrollTo(id) {
	let el = id === undefined ? document.body : tableocontents.value.querySelector(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}
</script>
