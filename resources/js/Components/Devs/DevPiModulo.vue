<script setup lang="ts">

import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {computed, ref} from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

const modulo = ref(60)
const factor = ref(2)
const empty = ref(false)

const radius = 5
const palettes = [
	["#e63946", "#f1faee", "#457b9d"],
	["#ff7f00", "#ffff66", "#00b386"],
	["#264653", "#2a9d8f", "#e9c46a", "#f4a261"],
	["#8e44ad", "#3498db", "#1abc9c", "#f1c40f"],
	["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"]

]
const palette = palettes[4]

const draw = computed(() => {
	const points: string[] = []
	const lines: string[] = []

	for (let i = 0; i < modulo.value; i++) {
		const x = (radius * Math.cos(2 * Math.PI / modulo.value * i + Math.PI / 2)).toFixed(5)
		const y = (radius * Math.sin(2 * Math.PI / modulo.value * i + Math.PI / 2)).toFixed(5)
		if (empty.value) {
			points.push(`P${i}(${x},${y})->tex={\\scriptsize \\color{gray} ${i}}/mc/${+x / radius / 4};${+y / radius / 4},fill=black,o=2`)
		} else {
			points.push(`P${i}(${x},${y})->!`)

			const j = (i * factor.value) % modulo.value

			if (i === j) continue

			const col = getGradientColor(palette, distanceBetweenToPoints(i, j), 101)
			lines.push(`d${i}=P${i}P${j}.->color=${col}`)
		}
	}

	return {
		parameters: "x=-6:6,y=-6:6",
		code: `A(0,0)->!
c=circ A,5
`
			+ points.join('\n') + '\n'
			+ lines.join('\n')
	}
})

function distanceBetweenToPoints(i: number, j: number): number {
	const x1 = (radius * Math.cos(2 * Math.PI / modulo.value * i + Math.PI / 2))
	const y1 = (radius * Math.sin(2 * Math.PI / modulo.value * i + Math.PI / 2))

	const x2 = (radius * Math.cos(2 * Math.PI / modulo.value * j + Math.PI / 2))
	const y2 = (radius * Math.sin(2 * Math.PI / modulo.value * j + Math.PI / 2))

	console.log(Math.round((x2 - x1) ** 2 + (y2 - y1) ** 2))
	return Math.round((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function interpolateColor(c1: string, c2: string, t: number) {
	const a = parseInt(c1.slice(1), 16)
	const b = parseInt(c2.slice(1), 16)

	const r1 = (a >> 16) & 255, g1 = (a >> 8) & 255, b1 = a & 255
	const r2 = (b >> 16) & 255, g2 = (b >> 8) & 255, b2 = b & 255

	const r = Math.round(r1 + (r2 - r1) * t)
	const g = Math.round(g1 + (g2 - g1) * t)
	const b_ = Math.round(b1 + (b2 - b1) * t)

	return `#${((r << 16) | (g << 8) | b_).toString(16).padStart(6, "0")}`
}

function getGradientColor(colors: string[], index: number, maxIndex: number) {
	const segmentCount = colors.length - 1
	const t = index / maxIndex
	const segment = Math.floor(t * segmentCount)

	const localT = (t - segment / segmentCount) * segmentCount

	return interpolateColor(
		colors[segment],
		colors[segment + 1],
		localT
	)
}
</script>

<template>
	<article class="max-w-xl mx-auto">
		<div class="flex gap-3 mb-3">
			<form-maker
				type="number"
				min="10"
				max="1000"
				label="modulo"
				v-model="modulo"
			/>
			<form-maker
				type="number"
				min="2"
				max="500"
				label="facteur"
				v-model="factor"
			/>
		</div>

		<pi-draw-parser
			:draw="draw"
			class="w-full bg-white dark:invert"
			theme="geometrie"
		/>

		<div class="flex justify-end mt-1">
			<form-maker
				type="switch"
				v-model="empty"
				label="vide,généré"
				sm
			/>
		</div>
	</article>
</template>

<style scoped>

</style>
