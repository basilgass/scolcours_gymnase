<script setup lang="ts">
import {onMounted} from "vue"
import {Svg} from "@svgdotjs/svg.js"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

// TODO: DOES NOT WORK
const props = defineProps<{
	PiDraw: InstanceType<typeof PiDrawParser>
}>()

async function downloadSVG() {
	const draw = props.PiDraw.getPiDraw()

	// Remplacement des foreignObject
	await replaceForeignObjectsWithMathJax(draw.rootSVG)

	const svgNode = draw.rootSVG.node
	const serializer = new XMLSerializer()
	const data = serializer.serializeToString(svgNode)
	const blob = new Blob([data], {type: "image/svg+xml;charset=utf-8"})

	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = "dessin.svg"
	a.click()
	URL.revokeObjectURL(url)
}

onMounted(() => {
	if ((window as any).MathJax) return

	(window as any).MathJax = {
		loader: {load: ["input/tex", "output/svg"]},
		tex: {packages: ["base", "ams"]},
		svg: {fontCache: "none"}
	}

	const script = document.createElement("script")
	script.src = "https://cdn.jsdelivr.net/npm/mathjax@4/es5/startup.js"
	script.async = true
	document.head.appendChild(script)
})

// Fonction utilitaire : TeX -> SVG
async function texToSvgSVG4(tex: string, display = false): Promise<SVGElement> {
	await (window as any).MathJax.startup.promise
	const mjx = (window as any).MathJax.tex2svg(tex, {display})
	const svg = mjx.querySelector("svg")!.cloneNode(true) as SVGElement
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	svg.removeAttribute("width")
	svg.removeAttribute("height")
	return svg
}

// Remplace tous les foreignObject KaTeX par des SVG MathJax
async function replaceForeignObjectsWithMathJax(draw: Svg) {
	const foreignObjects = draw.find("foreignObject")

	for (const fo of foreignObjects) {
		const tex = fo.attr("data-tex")  // suppose que tu stockes le TeX ici
		if (!tex) continue

		const svgEl = await texToSvgSVG4(tex)
		const x = fo.x() ?? 0
		const y = fo.y() ?? 0

		const g = draw.group()
		g.svg(svgEl.outerHTML)
		g.move(x, y)

		fo.replace(g)
	}
}
</script>

<template>
	<div @click="downloadSVG">
		<slot><i class="bi bi-download" /> télécharger</slot>
	</div>
</template>

<style scoped>

</style>
