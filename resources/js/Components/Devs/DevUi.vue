<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton, {buttonTypes} from "@/Components/Ui/scButton.vue"
import {ref} from "vue"

defineOptions({ layout: LayoutMain })

const themes = {
	'main': [
		'bg-main-light dark:bg-main-light',
		'bg-main dark:bg-main',
		'bg-main-dark dark:bg-main-dark',
		'text-main-light border border-main-light dark:text-main-light dark:border-main-light',
		'text-main border border-main dark:text-main dark:border-main',
		'text-main-dark border border-main-dark dark:text-main-dark dark:border-main-dark',
	],
	'algebre': [
		'bg-algebre-light dark:bg-algebre-light',
		'bg-algebre dark:bg-algebre',
		'bg-algebre-dark dark:bg-algebre-dark',
		'text-algebre-light border border-algebre-light dark:text-algebre-light dark:border-algebre-light',
		'text-algebre border border-algebre dark:text-algebre dark:border-algebre',
		'text-algebre-dark border border-algebre-dark dark:text-algebre-dark dark:border-algebre-dark',
	],
	'analyse': [
		'bg-analyse-light dark:bg-analyse-light',
		'bg-analyse dark:bg-analyse',
		'bg-analyse-dark dark:bg-analyse-dark',
		'text-analyse-light border border-analyse-light dark:text-analyse-light dark:border-analyse-light',
		'text-analyse border border-analyse dark:text-analyse dark:border-analyse',
		'text-analyse-dark border border-analyse-dark dark:text-analyse-dark dark:border-analyse-dark',
	],
	'geometrie': [
		'bg-geometrie-light dark:bg-geometrie-light',
		'bg-geometrie dark:bg-geometrie',
		'bg-geometrie-dark dark:bg-geometrie-dark',
		'text-geometrie-light border border-geometrie-light dark:text-geometrie-light dark:border-geometrie-light',
		'text-geometrie border border-geometrie dark:text-geometrie dark:border-geometrie',
		'text-geometrie-dark border border-geometrie-dark dark:text-geometrie-dark dark:border-geometrie-dark',
	],
	'statistiques': [
		'bg-statistiques-light dark:bg-statistiques-light',
		'bg-statistiques dark:bg-statistiques',
		'bg-statistiques-dark dark:bg-statistiques-dark',
		'text-statistiques-light border border-statistiques-light dark:text-statistiques-light dark:border-statistiques-light',
		'text-statistiques border border-statistiques dark:text-statistiques dark:border-statistiques',
		'text-statistiques-dark border border-statistiques-dark dark:text-statistiques-dark dark:border-statistiques-dark',
	],
	'jeux': [
		'bg-jeux-light dark:bg-jeux-light',
		'bg-jeux dark:bg-jeux',
		'bg-jeux-dark dark:bg-jeux-dark',
		'text-jeux-light border border-jeux-light dark:text-jeux-light dark:border-jeux-light',
		'text-jeux border border-jeux dark:text-jeux dark:border-jeux',
		'text-jeux-dark border border-jeux-dark dark:text-jeux-dark dark:border-jeux-dark',
	],
	'tools': [
		'bg-tools-light dark:bg-tools-light',
		'bg-tools dark:bg-tools',
		'bg-tools-dark dark:bg-tools-dark',
		'text-tools-light border border-tools-light dark:text-tools-light dark:border-tools-light',
		'text-tools border border-tools dark:text-tools dark:border-tools',
		'text-tools-dark border border-tools-dark dark:text-tools-dark dark:border-tools-dark',
	],
	'arithmetique': [
		'bg-arithmetique-light dark:bg-arithmetique-light',
		'bg-arithmetique dark:bg-arithmetique',
		'bg-arithmetique-dark dark:bg-arithmetique-dark',
		'text-arithmetique-light border border-arithmetique-light dark:text-arithmetique-light dark:border-arithmetique-light',
		'text-arithmetique border border-arithmetique dark:text-arithmetique dark:border-arithmetique',
		'text-arithmetique-dark border border-arithmetique-dark dark:text-arithmetique-dark dark:border-arithmetique-dark',
	],
	'admin': [
		'bg-admin-light dark:bg-admin-light',
		'bg-admin dark:bg-admin',
		'bg-admin-dark dark:bg-admin-dark',
		'text-admin-light border border-admin-light dark:text-admin-light dark:border-admin-light',
		'text-admin border border-admin dark:text-admin dark:border-admin',
		'text-admin-dark border border-admin-dark dark:text-admin-dark dark:border-admin-dark',
	],
}

const btnTypes:buttonTypes[] = [
	'add',
	'edit',
]

const btnIcons = {
	'add': 'bi-plus',
	'edit': 'bi-pencil',
}

const blockTypes = {
	definition: {
		title: "définition",
		icon: "bi bi-book",
		style: {
			header: "bg-lime-400 text-lime-900 dark:bg-lime-600 dark:text-lime-200",
			body: "border-lime-400 dark:border-lime-600",
		},
	},
	theorem: {
		title: "théorème",
		icon: "bi bi-book",
		style: {
			header: "bg-amber-600 text-amber-50 dark:bg-amber-700 dark:text-amber-300",
			body: "border-amber-600 dark:border-amber-700",
		},
	},
	property: {
		title: "propriété",
		icon: "bi bi-wrench",
		style: {
			header: "bg-purple-600 text-purple-50 dark:bg-purple-700 dark:text-purple-200",
			body: "border-purple-600 dark:border-purple-700",
		},
	},
	remark: {
		title: "remarque",
		icon: "bi bi-chat",
		style: {
			header: "bg-cyan-300 text-cyan-700 dark:bg-cyan-500 dark:text-cyan-100",
			body: "border-cyan-300 dark:border-cyan-500",
		},
	},
	example: {
		title: "exemple",
		icon: "bi bi-calculator",
		style: {
			header: "bg-gray-200 text-gray-800 dark:bg-gray-400 dark:text-gray-100",
			body: "border-gray-200 dark:border-gray-400",
		},
	},
	danger: {
		title: "attention",
		icon: "bi bi-exclamation-triangle",
		style: {
			header: "bg-red-700 text-red-50 dark:bg-red-900 dark:text-red-100",
			body: "border border-red-700 dark:border-red-900",
		},
	},
}

const detailsOpen = ref<('theme'|'buttons'|'blocks')[]>(['blocks'])
</script>

<template>
	<div class="space-y-4">
		<details :open="detailsOpen.includes('theme')">
			<summary class="text-lg">
				Thème
			</summary>
			<div
				v-for="theme in Object.keys(themes)"
				:key="theme"
			>
				<div>{{ theme }}</div>

				<div class="flex gap-3 *:w-[200px] *:h-[60px] *:grid *:place-items-center">
					<div
						v-for="(color, index) in themes[theme]"
						:key="index"
						:class="color"
					>
						{{ theme }}
					</div>
				</div>
			</div>
		</details>

		<details :open="detailsOpen.includes('buttons')">
			<summary class="text-lg">
				Boutons
			</summary>
			<div class="flex flex-col gap-3">
				<div class="flex gap-3">
					<sc-button
						v-for="theme in Object.keys(themes)"
						:theme="theme"
						:key="`btn-${theme}`"
						class="space-x-3 w-[180px]"
					>
						<i class="bi bi-brush" />
						<div class="hidden md:inline">
							{{ theme }}
						</div>
					</sc-button>
				</div>


				<div class="flex gap-3">
					<sc-button
						v-for="type in btnTypes"
						:type="type"
						xs
						:key="`btn-${type}-xs`"
						class="space-x-3"
					>
						<i :class="`bi ${btnIcons[type]}`" />
						<div class="hidden md:inline">
							{{ type }}
						</div>
					</sc-button>
				</div>

				<div class="flex gap-3">
					<sc-button
						v-for="type in btnTypes"
						:type="type"
						:key="`btn-${type}`"
						class="space-x-3"
					>
						<i :class="`bi ${btnIcons[type]}`" />
						<div class="hidden md:inline">
							{{ type }}
						</div>
					</sc-button>
				</div>
				<div class="flex gap-3">
					<sc-button
						v-for="type in btnTypes"
						:type="type"
						xl
						:key="`btn-${type}-xl`"
						class="space-x-3"
					>
						<i :class="`bi ${btnIcons[type]}`" />
						<div class="hidden md:inline">
							{{ type }}
						</div>
					</sc-button>
				</div>
			</div>
		</details>

		<details :open="detailsOpen.includes('blocks')">
			<summary class="text-lg">
				Blocks
			</summary>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				<div
					v-for="block in blockTypes"
					class="border border-l-8"
					:class="block.style.body"
					:key="block.title"
				>
					<div
						class="px-1 py-3"
						:class="block.style.header"
					>
						<i
							class="mr-3"
							:class="block.icon"
						/>{{ block.title }}
					</div>
					<div class="p-3">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium id molestiae nam nobis recusandae sapiente, voluptas! Amet autem exercitationem nulla odit ratione suscipit ut. Cupiditate et magnam quibusdam saepe tempore?
					</div>
				</div>
			</div>
		</details>
	</div>
</template>
