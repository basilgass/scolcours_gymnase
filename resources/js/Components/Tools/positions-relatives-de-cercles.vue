<script lang="ts" setup>
	/** Tools
	 * title: positions relatives de cercles
	 * body: permet de déterminer la position relative de cercle ou de générer un exemple
	 * parameters: \(\Gamma_1\): equation, \(\Gamma_2\): equation
	 * tags: geoetrie,3M
	 */

	import { computed, onMounted, ref } from "vue"
	import { PiMath } from "pimath"
	import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
	import FormMaker from "@/Components/Form/FormMaker.vue"

	const circle1 = ref(""),
		circle2 = ref(""),
		maxRadius = ref(20)

	// Compute the result
	const result = computed(() => {
		try {
			if (circle1.value === "" || circle2.value === "") {
				return false
			}
			const C1 = new PiMath.Geometry.Circle(circle1.value)
			const C2 = new PiMath.Geometry.Circle(circle2.value)
			const r1 = C1.radius.value
			const r2 = C2.radius.value
			const d = C1.center.distanceTo(C2.center).value

			// Get the relative position of the circles
			let position = ""
			if (d === 0) {
				if (r1 === r2) {
					position = "superposés"
				} else {
					position = "concentriques"
				}
			} else {
				if (r1 + r2 === d) {
					position = "tangents externes"
				} else if (Math.abs(r1 - r2) === d) {
					position = "tangents internes"
				} else if (r1 + r2 > d && Math.abs(r1 - r2) < d) {
					position = "sécants"
				} else {
					position = "disjoints"
				}
			}

			return {
				C1: C1.tex,
				C2: C2.tex,
				O1: C1.center.tex,
				O2: C2.center.tex,
				r1,
				r2,
				distance: `\\delta(O_1;O_2) = ${C1.center.distanceTo(C2.center).tex}`,
				position,
				draw: {
					parameters: `axis,grid,x=${Math.min(C1.center.x.value - r1, C2.center.x.value - r2) - 1}:${
						Math.max(C1.center.x.value + r1, C2.center.x.value + r2) + 1
					},y=${Math.min(C1.center.y.value - r1, C2.center.y.value - C2.radius.value) - 1}:${
						Math.max(C1.center.y.value + r1, C2.center.y.value + r2) + 1
					}`,
					code: [
						`P1(${C1.center.x.value},${C1.center.y.value})`,
						`P2(${C2.center.x.value},${C2.center.y.value})`,
						`c1=circ P1,${r1}`,
						`c2=circ P2,${r2}`,
					].join("\n"),
				},
			}
		} catch (e) {
			console.error(e)
			return false
		}
	})
	// Generate two points at random distance
	function getTriple(allowZero = false): number[] {
		let triple: number[][] = [],
			d = 0

		while (triple.length === 0) {
			// Distance between two points.
			d = PiMath.Random.number(1, maxRadius.value)
			// Get a random pythagorean triple
			triple = PiMath.Numeric.pythagoricianTripletsWithTarget(d, false)

			// remove element containing zero
			if (!allowZero) {
				triple = triple.filter((x) => !x.includes(0))
			}
		}

		return PiMath.Random.item(triple)
	}

	function generatePoints(allowZero = false) {
		const P1 = PiMath.Random.Geometry.point(),
			triple = getTriple(allowZero)

		const P2 = new PiMath.Geometry.Point(P1.x.value + triple[0], P1.y.value + triple[1])

		return { P1, P2, triple }
	}

	const POSITION_RELATIVE = [
		"tangents internes",
		"tangents externes",
		"sécants",
		"concentriques",
		"disjoints",
		"superposés",
	]

	// Generate random circles
	function generateCircles() {
		let { P1, P2, triple } = generatePoints()
		const pos = PiMath.Random.item(POSITION_RELATIVE),
			d = triple[2] // distance between the two points

		// Generate the distance depending on POSITION_RELATIVE
		let r1 = 0,
			r2 = 0
		switch (pos) {
			case "tangents internes":
				r1 = PiMath.Random.number(d + 1, d * 2)
				r2 = r1 - d
				break
			case "tangents externes":
				r1 = PiMath.Random.number(1, d - 1)
				r2 = d - r1
				break
			case "sécants":
				r1 = PiMath.Random.number(1, d * 2)
				if (r1 < d) {
					r2 = Math.abs(r1 - d) + PiMath.Random.number(1, 2 * r1) - 1
				} else {
					r2 = Math.abs(r1 - d) + PiMath.Random.number(1, 2 * r1) - 1
				}
				break
			case "disjoints":
				r1 = PiMath.Random.number(2, d * 2)

				if (Math.abs(d - r1) === 1) {
					if (r1 > d) {
						r1++
						r2 = 0
					} else {
						r1--
						r2 = 1
					}
				}
				if (r1 > d) {
					r2 = r1 - d - PiMath.Random.number(1, Math.min(10, r1 - d - 1))
				} else {
					r2 = d - r1 - PiMath.Random.number(1, Math.min(10, d - r1 - 1))
				}

				break
			case "concentriques":
				r1 = PiMath.Random.number(3, 10)
				r2 = r1 + PiMath.Random.numberSym(Math.min(5, r1 - 1), false)
				P2 = P1.clone()
				break
			case "superposés":
				r1 = PiMath.Random.number(1, 10)
				r2 = r1
				P2 = P1.clone()
				break
		}

		circle1.value = new PiMath.Geometry.Circle(P1, r1).display
		circle2.value = new PiMath.Geometry.Circle(P2, r2).display
	}

	onMounted(() => {
		generateCircles()
	})
</script>

<template>
	<div>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<form-maker
					v-model="circle1"
					focus
					font-code
					from-url="c1"
				/>

				<form-maker
					v-model="circle2"
					focus
					font-code
					from-url="c2"
				/>

				<div class="text-center mt-3 mb-5">
					<button
						class="btn btn-primary"
						@click="generateCircles"
					>
						Générer
					</button>
				</div>

				<div v-if="result">
					<div v-katex.display.boxed.lg="`(\\Gamma_1): ${result.C1}`" />
					<div v-katex.display.boxed="`O_1=${result.O1}\\quad r_1 = ${result.r1}`" />
					<div
						v-katex.display.boxed.lg="`(\\Gamma_2): ${result.C2}`"
						class="mt-10"
					/>
					<div v-katex.display.boxed="`O_2=${result.O2}\\quad r_2 = ${result.r2}`" />
				</div>
			</div>

			<div
				v-if="result"
				class="flex flex-col gap-3"
			>
				<div v-katex.display.boxed="result.distance" />
				<div>
					Les deux cercles sont
					<span class="font-semibold text-lg">{{ result.position }}</span>.
				</div>
				<pi-draw-parser :draw="result.draw" />
			</div>
			<div
				v-else
				class="text-red-700 text-sm"
			>
				Une erreur s'est produite avec vos données.
			</div>
		</div>
	</div>
</template>

<style scoped></style>
