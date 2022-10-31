<template>
	<input
		v-model="challengeLevel"
		type="number"
		min="1"
	>
	<!-- Title -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
		<div
			v-for="q in questions"
		>
			<div class="flex items-center gap-3">
				<div v-katex="`${q.question} =`" />
				<div v-katex.ascii="ascii(q.answer)" />
			</div>
			<div>
				<div v-text="q.question" />
				<div v-text="q.answer" />
			</div>
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import {Fraction} from "pimath/esm/maths/coefficients/fraction"

let challengeLevel = ref(2),
	exactFormat = ref(true),
	questions = computed(() => {
		let data = []
		for (let i = 0; i < 20; i++) {
			data.push(fractionsDeRacines(challengeLevel.value))
		}
		return data
	}),
	ascii = function(value){
		if(exactFormat.value && value.includes("/")){
			return value.split("/").map(x=>`(${x})`).join("/")
		}else{
			return value
		}
	}

function quadratiquesSolutionsExactes(level) {
	let securityCount = 20
	while (true) {
		let equ = new PiMath.Equation(PiMath.Random.polynom({degree: 2}), new PiMath.Polynom().zero())
		equ.solve()

		if (equ.solutions.length === 2) {
			if (equ.solutions[0].exact.numerator) {
				// La racine est simplifiable.
				return {
					question: equ.tex,
					answer: `${equ.solutions[0].exact.display},${equ.solutions[1].exact.display}`
				}
			} else {
				// La racine n'est pas simplifiable
				let a = equ.left.monomByDegree(2).coefficient.value,
					b = equ.left.monomByDegree(1).coefficient.value,
					c = equ.left.monomByDegree(0).coefficient.value,
					delta = new PiMath.Root(b * b - 4 * a * c).reduce(),
					gcd = PiMath.Numeric.gcd(2 * a, b, delta.coefficient)

				// Reduce
				if (a < 0) {
					a = -a
					b = -b
				}
				a = 2 * a / gcd
				b = b / gcd
				delta.coefficient = delta.coefficient / gcd

				let answer = b === 0 ? "" : ((-b) + "+-")
				answer += `${delta.coefficient === 1 ? "" : delta.coefficient}sqrt${delta.radical}`
				if (a > 1) {
					answer += `/${a}`
				}
				return {question: equ.tex, answer}
			}

		}

		securityCount--

		if (securityCount < 0) {
			return {question: "?", answer: "?"}
		}
	}


}

function puissances(level) {
	let a = PiMath.Random.number(2, 10),
		b = PiMath.Random.number(2, 10),
		n = PiMath.Random.number(2, 10) * (PiMath.Random.bool() ? -1 : 1),
		m = PiMath.Random.number(2, 10) * (PiMath.Random.bool() ? -1 : 1),
		p = PiMath.Random.number(2, 10) * (PiMath.Random.bool() ? -1 : 1)

	function answerFormatter(a, n) {
		if (n === 0) {
			return "1"
		} else if (n === 1) {
			return `${a}`
		} else {
			return `${a}^${n}`
		}
	}

	if (level === 1) {
		let form = PiMath.Random.number(1, 3)
		if (form === 1) {
			return {
				question: `${a}^{ ${n} }\\cdot ${a}^{ ${m} }`,
				answer: answerFormatter(a, n + m)
			}
		} else if (form === 2) {
			return {
				question: `\\left(${a}^{ ${n} }\\right)^{ ${m} }`,
				answer: answerFormatter(a, n * m)
			}
		} else {
			return {
				question: `${a}^{ ${n} }\\cdot ${b}^{ ${n} }`,
				answer: answerFormatter(a * b, n)
			}
		}
	} else if (level === 2) {
		return {
			question: `\\frac{ ${a}^{ ${n} } \\cdot ${a}^{ ${m} } }{ ${a}^{ ${p} } }`,
			answer: answerFormatter(a, n + m - p)
		}
	} else {
		let overlap = PiMath.Random.number(2, 5) * (PiMath.Random.bool() ? -1 : 1)

		return {
			question: `\\left(\\frac{ ${a}^{ ${n} } \\cdot ${a}^{ ${m} } }{ ${a}^{ ${p} } }\\right)^{ ${overlap} }`,
			answer: answerFormatter(a, (n + m - p) * overlap)
		}

	}
}

function notationscientifique(level) {
	let n = PiMath.Random.number(2, 6),
		a = PiMath.Random.number(100000, 999999).toString().substring(0, n),
		p1 = a[0],
		p2 = a.substring(1)

	function formatQuestion(a, pow) {
		if (a > 1) {
			// Must do from the end.
			const result = [...("" + a)].reverse().join("").match(/.{1,3}/g) || []
			return [...result.join(" \\")].reverse().join("")
		} else {
			const result = ("" + a.substring(2)).match(/.{1,3}/g) || []
			return `0.${result.join("\\ ")}`
		}

	}

	if (level === 1) {
		return {
			question: formatQuestion(a),
			answer: `${p1}.${p2}*10^${n - 1}`
		}
	} else if (level === 2) {
		return {
			question: formatQuestion(`0.${"000000000".slice(0, n - 1)}${a}`),
			answer: `${p1}.${p2}*10^-${n}`
		}
	} else {
		if (PiMath.Random.bool()) {
			return {
				question: formatQuestion(a),
				answer: `${p1}.${p2}*10^${n - 1}`
			}
		} else {
			return {
				question: formatQuestion(`0.${"000000000".slice(0, n - 1)}${a}`),
				answer: `${p1}.${p2}*10^-${n}`
			}
		}
	}

}

function fractionsDeRacines(level) {
	let question = "", answer = ""

	let a = PiMath.Random.number(1, 10),
		c = PiMath.Random.number(1, 10),
		r = PiMath.Random.number(2, 20),
		signCD = PiMath.Random.bool(),
		d, dr

	while(c*c === r){
		r = PiMath.Random.number(2, 20)
	}

	d = new PiMath.Root(r)
	dr = new PiMath.Root(r).reduce()

	if (dr.hasRadical()) {
		let numA = a*c,
			numB = a * dr.coefficient,
			numSign = true,
			den = c*c-r

		let gcd = PiMath.Numeric.gcd(numA, numB, den)
		if(gcd>1){
			den = den/gcd
			numA = numA/gcd
			numB = numB/gcd
		}

		if(den < 0){
			den = -den
			numA = -numA
			numSign = false
		}

		if(den===1) {
			answer = `${numA}${signCD && numSign ? "-" : "+"}${numB}sqrt${dr.radical}`
		}else{
			answer = `${numA}${signCD && numSign ? "-" : "+"}${numB}sqrt${dr.radical}/${den}`
		}
	} else {
		answer = new PiMath.Fraction(signCD ? a * c - a * dr.coefficient : a * c + a * dr.coefficient, c * c - r).reduce().display
	}

	return {question: `\\frac{ ${a} }{ ${c} ${signCD ? "+" : "-"} ${d.tex} }`, answer}
}

</script>

