<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ScButton, {buttonTypes} from "@/Components/Ui/scButton.vue"

defineOptions({ layout: LayoutMain })

const themes = {
	'main': [
		'bg-main-light',
		'bg-main',
		'bg-main-dark',
		'text-main-light border border-main-light',
		'text-main border border-main',
		'text-main-dark border border-main-dark',
	],
	'algebre': [
		'bg-algebre-light',
		'bg-algebre',
		'bg-algebre-dark',
		'text-algebre-light border border-algebre-light',
		'text-algebre border border-algebre',
		'text-algebre-dark border border-algebre-dark',
	],
	'analyse': [
		'bg-analyse-light',
		'bg-analyse',
		'bg-analyse-dark',
		'text-analyse-light border border-analyse-light',
		'text-analyse border border-analyse',
		'text-analyse-dark border border-analyse-dark',
	],
	'geometrie': [
		'bg-geometrie-light',
		'bg-geometrie',
		'bg-geometrie-dark',
		'text-geometrie-light border border-geometrie-light',
		'text-geometrie border border-geometrie',
		'text-geometrie-dark border border-geometrie-dark',
	],
	'statistiques': [
		'bg-statistiques-light',
		'bg-statistiques',
		'bg-statistiques-dark',
		'text-statistiques-light border border-statistiques-light',
		'text-statistiques border border-statistiques',
		'text-statistiques-dark border border-statistiques-dark',
	],
	'jeux': [
		'bg-jeux-light',
		'bg-jeux',
		'bg-jeux-dark',
		'text-jeux-light border border-jeux-light',
		'text-jeux border border-jeux',
		'text-jeux-dark border border-jeux-dark',
	],
	'tools': [
		'bg-tools-light',
		'bg-tools',
		'bg-tools-dark',
		'text-tools-light border border-tools-light',
		'text-tools border border-tools',
		'text-tools-dark border border-tools-dark',
	],
	'arithmetique': [
		'bg-arithmetique-light',
		'bg-arithmetique',
		'bg-arithmetique-dark',
		'text-arithmetique-light border border-arithmetique-light',
		'text-arithmetique border border-arithmetique',
		'text-arithmetique-dark border border-arithmetique-dark',
	],
	'admin': [
		'bg-admin-light',
		'bg-admin',
		'bg-admin-dark',
		'text-admin-light border border-admin-light',
		'text-admin border border-admin',
		'text-admin-dark border border-admin-dark',
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
</script>

<template>
	<div>
		<h1>DevUi</h1>

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

		<div class="flex flex-col gap-3">
			<h3>Buttons</h3>

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
	</div>
</template>
