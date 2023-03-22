<template>
	<Panel>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<form-input
				v-model="A"
				focus
				label="a = "
				name="fonction"
			/>

			<form-input
				v-model="B"
				label="b = "
				name="fonction"
			/>

			<form-input
				v-model="C"
				label="c = "
				name="fonction"
			/>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<form-input
				v-model="alpha"
				focus
				label="\(\alpha = \)"
				name="fonction"
			/>

			<form-input
				v-model="beta"
				label="\(\beta = \)"
				name="fonction"
			/>

			<form-input
				v-model="gamma"
				label="\(\gamma = \)"
				name="fonction"
			/>
		</div>

		<div
			v-if="result"
			class="my-10"
		>
			<div v-if="result.triangle">
				<table>
					<tr>
						<td
							v-katex="'a='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.a"
							class="px-4"
						/>
					</tr>
					<tr>
						<td
							v-katex="'b='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.b"
							class="px-4"
						/>
					</tr>
					<tr>
						<td
							v-katex="'c='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.c"
							class="px-4"
						/>
					</tr>
					<tr>
						<td
							v-katex="'\\alpha='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.alpha"
							class="px-4"
						/>
					</tr>
					<tr>
						<td
							v-katex="'\\beta='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.beta"
							class="px-4"
						/>
					</tr>
					<tr>
						<td
							v-katex="'\\gamma='"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left.number:2="result.triangle.gamma"
							class="px-4"
						/>
					</tr>
				</table>
			</div>
			<div
				v-if="result.text"
				class="text-center text-red-700"
				v-text="result.text"
			/>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>

<script setup>
/** Tools
 * title: trigonométrie dans le triangle quelconque
 * body: permet de calculer les longueurs et angles d'un triangle quelconque
 * parameters: a=nombre, b=numbre, c=nombre, alpha=nombre, beta=nombre, gamma=nombre
 * tags: geoetrie,1M,2C
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"

let A = ref(""),
	B = ref(""),
	C = ref(""),
	alpha = ref(""),
	beta = ref(""),
	gamma = ref("")

let result = computed(() => {
	try {
		let triangle = makeTriangle({
			a: A.value !== "" ? +A.value : null,
			b: B.value !== "" ? +B.value : null,
			c: C.value !== "" ? +C.value : null,
			alpha: alpha.value !== "" ? +alpha.value : null,
			beta: beta.value !== "" ? +beta.value : null,
			gamma: gamma.value !== "" ? +gamma.value : null
		})

		if (isNotResvoled(triangle)) {
			return {
				triangle: null,
				text: "le triangle n'est pas résolvable."
			}
		}
		return {
			triangle,
			text: null
		}
	} catch (e) {
		console.error(e)
		return false
	}
})

function thmTriangleSum(alpha, beta) {
	const gamma = 180 - alpha - beta

	if (gamma > 0 && gamma < 180) {
		return gamma
	}
	return null
}

function thmCosinus(b, c, alpha) {
	return Math.sqrt(b ** 2 + c ** 2 - 2 * b * c * Math.cos(alpha * Math.PI / 180))
}

function thmCosinusAngle(a, b, c) {
	return Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)) * 180 / Math.PI
}

function thmSinus(alpha, b, beta) {
	return b * Math.sin(alpha * Math.PI / 180) / Math.sin(beta * Math.PI / 180)
}

function isNotResvoled(value) {
	return value.a * value.b * value.c * value.alpha * value.beta * value.gamma === 0
}

function makeTriangle(value) {
	let securityLoop = 10
	while (isNotResvoled(value) && securityLoop > 0) {
		// Somme des angles
		if (!value.gamma && value.alpha > 0 && value.beta > 0) {
			value.gamma = thmTriangleSum(value.alpha, value.beta)
		}
		if (!value.beta && value.alpha > 0 && value.gamma > 0) {
			value.beta = thmTriangleSum(value.alpha, value.gamma)
		}
		if (!value.alpha && value.gamma > 0 && value.beta > 0) {
			value.alpha = thmTriangleSum(value.gamma, value.beta)
		}

		// Théorème du cosinus pour un côté
		if (!value.c && value.a > 0 && value.b > 0 && value.gamma > 0) {
			value.c = thmCosinus(value.a, value.b, value.gamma)
		}
		if (!value.b && value.a > 0 && value.c > 0 && value.beta > 0) {
			value.b = thmCosinus(value.a, value.c, value.beta)
		}
		if (!value.a && value.c > 0 && value.b > 0 && value.alpha > 0) {
			value.a = thmCosinus(value.c, value.b, value.alpha)
		}

		// Théorème du cosinus pour un angle
		if (!value.alpha && value.b > 0 && value.c > 0 && value.a > 0) {
			value.alpha = thmCosinusAngle(value.a, value.b, value.c)
		}
		if (!value.beta && value.b > 0 && value.c > 0 && value.a > 0) {
			value.beta = thmCosinusAngle(value.b, value.a, value.c)
		}
		if (!value.gamma && value.b > 0 && value.c > 0 && value.a > 0) {
			value.gamma = thmCosinusAngle(value.c, value.b, value.a)
		}

		// Théorème du sinus pour un côté
		if (!value.a && value.alpha > 0 && value.b > 0 && value.beta > 0) {
			value.a = thmSinus(value.alpha, value.b, value.beta)
		}
		if (!value.a && value.alpha > 0 && value.c > 0 && value.gamma > 0) {
			value.a = thmSinus(value.alpha, value.c, value.gamma)
		}
		if (!value.b && value.beta > 0 && value.a > 0 && value.alpha > 0) {
			value.b = thmSinus(value.beta, value.a, value.alpha)
		}
		if (!value.b && value.beta > 0 && value.c > 0 && value.gamma > 0) {
			value.b = thmSinus(value.beta, value.c, value.gamma)
		}
		if (!value.c && value.gamma > 0 && value.a > 0 && value.alpha > 0) {
			value.c = thmSinus(value.gamm, value.a, value.alpha)
		}
		if (!value.c && value.gamma > 0 && value.b > 0 && value.beta > 0) {
			value.c = thmSinus(value.gamm, value.b, value.beta)
		}

		securityLoop--
	}

	return value
}
</script>
