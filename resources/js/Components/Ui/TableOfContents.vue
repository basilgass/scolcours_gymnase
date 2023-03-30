<!--
Création d'une table des matières dynamique
TODO: déplacer dans les composants, le simplifier ou supprimer ?
-->
<template>
	<div
		ref="root"
		class="relative"
	>
		<div
			v-if="menu.length>0"
			class="mt-2 mb-10"
		>
			<h3 class="font-light text-lg my-5">
				table des matières
			</h3>
			<ol

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
						@click.prevent="useMenuScrollTo(`#menu-${index}`)"
						v-html="item"
					/>
				</li>
			</ol>
		</div>
		<div
			ref="tableofcontents"
			class="table-of-contents-data"
			v-bind="$attrs"
		>
			<slot />
		</div>
	</div>
</template>
<script setup>

import {onMounted, ref} from "vue"

let props = defineProps({
	query: {type: String, default: ".chapter-menu"},
	menuId: {type: String, default: "menu-"}
})

let root = ref(null),
	tableofcontents = ref(null),
	menu = ref([]),
	parent = ref(false)


function buildMenu() {
	menu.value = []
	root.value.querySelectorAll(props.query).forEach(h2 => {
		h2.id = `${props.menuId}${menu.value.length}`
		menu.value.push(h2.innerHTML)
	})
}

function useMenuScrollTo(id) {
	let el = id === undefined ? document.body : tableofcontents.value.querySelector(id)

	el.scrollIntoView({
		block: "start",
		behavior: "smooth",
		inline: "start"
	})
}

onMounted(()=> {
	buildMenu()
})

</script>
