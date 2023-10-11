<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import {PiMath} from "pimath/esm";

let donnees = ref([]),
	reponses = ref([]),
	display = computed(() => {
		return `\\begin{aligned} ${donnees.value.map((x, i) => {
			return `${x}=${reponses.value[i]}`
		}).join('\\\\')} \\end{aligned}`
	}),
	latex = ref([])
let header = `\\documentclass[12pt]{article}
\\usepackage{basil_header_v1.3}
% \\toggletrue{master}
\\title{ Racines et puissances}
\\begin{document}`,
	footer = `\\end{document}`

let generate = function () {
	donnees.value = []
	reponses.value = []
	latex.value = []

	latex.value.push(header)

	for(let i=0; i<12; i++) {
        latex.value.push(`\\begin{center} \\Huge Racines et puissances \\end{center}`)
        latex.value.push(ex1(8))
        latex.value.push(ex2(8))
        latex.value.push(ex3(8))
		latex.value.push('\\newpage')
    }
	latex.value.push(footer)
}

let ex1 = function (n: number): string {
	let d = [],
		r = [];

	for (let i = 0; i < n; i++) {
		let a = PiMath.Random.number(2, 10),
			b = PiMath.Random.prime(12)

		d.push(`\\sqrt{ ${a ** 2 * b} }`)
		r.push(`${a} \\sqrt{${b}}`)
	}

	donnees.value = donnees.value.concat(...d)
	reponses.value = reponses.value.concat(...r)
	return makeEnum(1, d, r, 'réduire les racines')
}

let ex2 = function (n: number): string {

	let q = [],
		r = [];

	let tmpl = [
		[
			`\\frac{ {e}^{a} \\cdot {e}^{b} }{ {e}^{d} }`,
			(e, a, b, c, d) => {return `${e}^{ ${a+b-d} }`}
		],
		[
			`\\frac{ \\left({e}^{a} \\cdot {e}^{b}\\right)^{c} }{ {e}^{d} }`,
			(e, a, b, c, d) => {return `${e}^{ ${(a+b)*c-d} }`}
		],
	]
	for (let i = 0; i < n; i++) {
		let e = PiMath.Random.number(2, 10),
			a = PiMath.Random.numberSym(6, false),
			b = PiMath.Random.numberSym(6, false),
			c = PiMath.Random.numberSym(6, false),
			d = PiMath.Random.numberSym(6, false),
			m = PiMath.Random.item(tmpl)

		if(a===1){a = 2}
		if(b===1){b = 2}
		if(c===1){c = 2}
		if(d===1){d = 2}
		switch (PiMath.Random.number(1,4)){
			case 1:
				q.push(`\\frac{ ${e}^{ ${a} } \\cdot ${e}^{ ${b} } }{ ${e}^{ ${d} } }`)
				r.push(a+b-d<0?`\\frac{1}{${e}^{ ${-(a+b-d)} }}`:`${e}^{ ${a+b-d} }`)
				break
			case 2:
				q.push(`\\frac{ \\left(${e}^{ ${a} } \\cdot ${e}^{ ${b} }\\right)^{ ${c} } }{ ${e}^{ ${d} } }`)
				r.push((a+b)*c-d<0?`\\frac{1}{ ${e}^{ ${-((a+b)*c-d)} } }`:`${e}^{ ${(a+b)*c-d} }`)
				break
			case 3:
                q.push(`\\left( \\frac{ ${e}^{ ${a} } }{ ${e}^{ ${d} } } \\right)^{ ${b} }`)
                r.push((a-d)*b<0?`\\frac{1}{ ${e}^{ ${-((a-d)*b)} } }`:`${e}^{ ${(a-d)*b} }`)
				break
            case 4:
                q.push(`\\left( \\frac{ ${e**2}^{ ${a} } }{ ${e}^{ ${d} } } \\right)^{ ${b} }`)
                r.push((a*2-d)*b<0?`\\frac{1}{ ${e}^{ ${-((a*2-d)*b)} } }` :`${e}^{ ${(a*2-d)*b} }`)
				break
		}


	}
	donnees.value = donnees.value.concat(...q)
	reponses.value = reponses.value.concat(...r)

	return makeEnum(2, q, r, "réduire pour n'avoir que des puissances positives")
}

let ex3 = function (n: number): string {
    let d = [],
        r = [];

    for (let i = 0; i < n; i++) {
        let a = PiMath.Random.number(2, 10),
            b = PiMath.Random.prime(12) * (PiMath.Random.bool(0.65)?a:1),
	        f = new PiMath.Fraction(a,b).reduce()

        d.push(`\\frac{ ${a} }{\\sqrt{ ${b} }}`)
        r.push(
            f.denominator===1?
	            `${f.numerator}\\sqrt{ ${b} }`:
	            `\\frac{ ${f.numerator===1?'':f.numerator}\\sqrt{ ${b} } }{ ${f.denominator} }`
        )
    }

    donnees.value = donnees.value.concat(...d)
    reponses.value = reponses.value.concat(...r)
    return makeEnum(1, d, r, 'rendre le dénominateur rationnel')
}

let makeEnum = function (n, d, r, t) {
	return `\\textbf{exercice ${n}}: ${t}

\\bigskip
\\begin{multicols}{2}
	\\begin{enumerate}[(i),itemsep=1em]
		\\item ${d
		.map((x, i) => `\\(${x} = \\trou{ ${r[i]} }\\)`)
		.join('\n\t\t\\item')}
	\\end{enumerate}
\\end{multicols}

\\vfill
`
}


onMounted(() => {
	generate()
})
</script>

<template>
	<button class="btn bg-white" @click="generate">Générer</button>
<!--	<div v-katex.left="display"></div>-->
	<textarea class="w-full" rows="20">{{ latex.join('\n\n') }}</textarea>

</template>

<style scoped>

</style>
