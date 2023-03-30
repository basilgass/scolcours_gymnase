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
			<div class="grid grid-cols-2 gap-4">
				<table v-if="result.triangle">
					<tr
						v-for="(value, key) in result.triangle"
						:key="`triangle-${key}`"
					>
						<td
							v-katex="`${labels[key]}=`"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left="value"
							class="px-4"
						/>
					</tr>
				</table>

				<table v-if="result.triangle2">
					<tr
						v-for="(value, key) in result.triangle2"
						:key="`triangle-${key}`"
					>
						<td
							v-katex="`${labels[key]}=`"
							class="w-[50px] text-right bg-gray-100 font-semibold px-4"
						/>
						<td
							v-katex.left="value"
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
			class="text-red-700 text-sm text-center mt-5"
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
import {numberCorrection} from "pidraw/esm/Calculus"

let A = ref(""),
	B = ref(""),
	C = ref(""),
	alpha = ref(""),
	beta = ref(""),
	gamma = ref(""),
	labels = {
		a: "a",
		b: "b",
		c: "c",
		alpha: "\\alpha",
		beta: "\\beta",
		gamma: "\\gamma",
		area: "\\sigma_{ABC}",
		radius: "r_{\\text{circ.}}",
		radiusI: "r_{\\text{insc.}}"
	}

let result = computed(() => {
	try {
		let triangle = makeTriangle({
				a: A.value !== "" ? +A.value : null,
				b: B.value !== "" ? +B.value : null,
				c: C.value !== "" ? +C.value : null,
				alpha: alpha.value !== "" ? +alpha.value : null,
				beta: beta.value !== "" ? +beta.value : null,
				gamma: gamma.value !== "" ? +gamma.value : null,
				resolvable: null
			}),
			triangle2

		if (triangle.hasAlternate) {
			triangle2 = makeTriangle({
				a: A.value !== "" ? +A.value : null,
				b: B.value !== "" ? +B.value : null,
				c: C.value !== "" ? +C.value : null,
				alpha: alpha.value !== "" ? +alpha.value : null,
				beta: beta.value !== "" ? +beta.value : null,
				gamma: gamma.value !== "" ? +gamma.value : null,
				resolvable: null
			}, true)
		}


		if (triangle.resolvable !== true && triangle2.resolvable !== true) {
			return {
				triangle: null,
				triangle2: null,
				text: `le triangle n'est pas résolvable. ${triangle.resolvable}`
			}
		}
		return {
			triangle: formatTriangle(triangle),
			triangle2: (triangle.hasAlternate && triangle2.resolvable===true)?formatTriangle(triangle2):{},
			text: null
		}
	} catch (e) {
		console.error(e)
		return false
	}
})

function formatTriangle(value) {
	if(value.resolvable){
		const area =  thmArea(value.a, value.b, value.gamma)
		return {
			a: (+value.a.toFixed(2)).toString(),
			b: (+value.b.toFixed(2)).toString(),
			c: (+value.c.toFixed(2)).toString(),
			alpha: (+value.alpha.toFixed(2)) + "°",
			beta: (+value.beta.toFixed(2)) + "°",
			gamma: (+value.gamma.toFixed(2)) + "°",
			area: numberCorrection(area, null, null,2),
			radius: numberCorrection(value.a/Math.sin(value.alpha*Math.PI / 180)/2, null, null, 2),
			radiusI: numberCorrection(2*area / (value.a+value.b+value.c), null, null, 2)
		}}else{
		return null
	}

}

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

function thmSinusAngle(a, b, beta, alternate) {
	const alpha = Math.asin(a * Math.sin(beta * Math.PI / 180) / b) * 180 / Math.PI

	return alternate === true ? 180 - alpha : alpha
}

function thmArea(a, b, gamma) {
	return 1 / 2 * a * b * Math.sin(Math.PI / 180 * gamma)
}

function isNotResvoled(value) {
	return value.a * value.b * value.c * value.alpha * value.beta * value.gamma === 0
}

function isResolvable(value) {
	// il faut au moins 3 données en tout.
	const numberOfGivenData = Object.values(value).filter(x => x !== null).length
	if (numberOfGivenData < 3) {
		return "Il faut connaître au moins 3 élèments pour résoudre un triangle."
	}

	// Les angles sont positifs.
	if (value.alpha < 0 || value.beta < 0 || value.gamma < 0) {
		return "Il y a un ou plusieurs angles négatifs."
	}
	// la somme des angles est inférieures à 180
	if (value.alpha + value.beta + value.gamma > 180) {
		return "La somme des angles dépassent 180°."
	}
	// il faut au moins un côté
	if (value.a === null && value.b === null && value.c === null) {
		return "Il faut au moins connaître la longueur d'un côté."
	}
	// la somme des deux plus petits côtés est plus grande que le grand.
	if (value.a !== null && value.b !== null && value.c !== null) {
		let sides = [value.a, value.b, value.c]
		sides.sort()
		if (sides[0] + sides[1] < sides[2]) {
			return "La somme des deux plus petits côtés est inférieure au plus grand côté."
		}
	}

	// Il y a trop d'informations données
	if (numberOfGivenData > 3) {
		// Il faut contrôler la compatibilité des données
		return "Il y a trop d'informations. Il n'en faut que 3 !"
	}

	// Le triangle devrait être résolvable.
	return true
}

function makeTriangle(value, alternate) {
	value.resolvable = isResolvable(value)
	if (value.resolvable !== true) {
		return value
	}

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
			value.c = thmSinus(value.gamma, value.a, value.alpha)
		}
		if (!value.c && value.gamma > 0 && value.b > 0 && value.beta > 0) {
			value.c = thmSinus(value.gamma, value.b, value.beta)
		}

		// Théorème du sinus pour un angle => 2 solutions !
		if (!value.alpha && value.a > 0) {
			if (value.b > 0 && value.beta > 0) {
				value.alpha = thmSinusAngle(value.a, value.b, value.beta, alternate)
				value.hasAlternate = true
			} else if (value.c > 0 && value.gamma > 0) {
				value.alpha = thmSinusAngle(value.a, value.c, value.gamma, alternate)
				value.hasAlternate = true
			}
		}

		if (!value.beta && value.b > 0) {
			if (value.a > 0 && value.alpha > 0) {
				value.beta = thmSinusAngle(value.b, value.a, value.alpha, alternate)
				value.hasAlternate = true
			} else if (value.c > 0 && value.gamma > 0) {
				value.beta = thmSinusAngle(value.a, value.c, value.gamma, alternate)
				value.hasAlternate = true
			}
		}

		if (!value.gamma && value.c > 0) {
			if (value.a > 0 && value.alpha > 0) {
				value.gamma = thmSinusAngle(value.c, value.a, value.alpha, alternate)
				value.hasAlternate = true
			} else if (value.b > 0 && value.beta > 0) {
				value.gamma = thmSinusAngle(value.c, value.b, value.beta, alternate)
				value.hasAlternate = true
			}
		}
		securityLoop--
	}

	if (isNotResvoled(value)) {
		value.resolvable = "Le triangle n'a pas pu être résolu."
	}
	return value
}
</script>
