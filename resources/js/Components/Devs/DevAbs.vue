<template>
	<!-- Title -->
	<div ref="root">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-3 items-end">
			<div
				class="md:col-span-2"
			>
				<form-input
					v-model="fx"
					label="fonction"
					name="fx"
				/>
			</div>

			<button
				class="btn bg-white"
				@click="randomAbs"
			>
				aléatoire
			</button>
		</div>

		<div
			v-katex="expression.tex"
			class="katex-boxed mb-10"
		/>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 katex-boxed">
			<div>
				<h3>évaluer la fonction <span v-katex="`f(${xAsTex})`" /></h3>
				<form-input
					v-model="x"
					inline
					label="x="
					name="x"
				/>
				<div v-katex="`f\\left(${xAsTex}\\right)=${expression.evaluate(x).tex}`" />
			</div>
			<div>
				<h3>résoudre l'équation <span v-katex="`f(x)=${yAsTex}`" /></h3>
				<form-input
					v-model="y"
					inline
					label="f(x) = "
					name="y"
				/>
				<div v-katex="`f(x)=${yAsTex}\\implies \\mathcal S = ${expression.solve(y).tex}`" />
			</div>
		</div>

		<div class="max-w-lg">
			<pi-draw-parser :draw="draw" />
		</div>

		<div v-html="draw.code" />
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, onMounted, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"

let root = ref(null),
	fx = ref("abs(3x-3)-4abs(x+1)+2"),
	x = ref("-4"),
	y = ref("-10"),
	xAsTex = computed(()=>{
		try {
			return new PiMath.Fraction(x.value).tex
		}catch{
			return ""
		}
	}),
	yAsTex = computed(()=>{
		try {
			return new PiMath.Fraction(y.value).tex
		}catch{
			return ""
		}
	}),
	expression = computed(()=>{
		let abs = [],
			zeroes = [],
			matches = [...fx.value.matchAll(/abs\(([^)]+)\)/g)],
			expr = []

		for(let m of matches){
			const P = new PiMath.Polynom(m[1])
			for(let z of P.zeroes){
				zeroes.push(z)
			}
			abs.push({
				polynom: P,
				match: `abs(${m[1]})`
			})
		}

		zeroes.sort((a,b)=> a.value - b.value)

		let lessThan = zeroes[0],
			greaterThan = null,
			n = 0


		while(lessThan!==null){
			if(greaterThan === null ||
				greaterThan.value!==lessThan.value){
				expr.push(getOneExpression(fx.value, abs, greaterThan, lessThan))
			}


			n++
			lessThan = zeroes[n]||null
			greaterThan = zeroes[n-1]
		}
		expr.push(getOneExpression(fx.value, abs, greaterThan, lessThan))

		function checkValue(v, min, max){
			if(min===null && v<=max.value){
				return true
			}else if(max===null && v >= min.value){
				return true
			}else if(
				min!==null &&
				max!==null &&
				(v>= min.value && v <= max.value)
			){
				return true
			}

			return false
		}

		let absTex =  fx.value.replaceAll(/abs\(([^)]+)\)/g, "\\left\\vert $1 \\right\\vert")
		return {
			absTex,
			tex: `f(x) = ${absTex} = \\begin{cases}${expr.map(x=>`${x.polynom.display} &\\text{si}\\quad ${x.condition}`).join("\\\\")}\\end{cases}`,
			drawCode: expr.map(x=>`${x.polynom.display},${x.borders.min===null?-20:x.borders.min.value}:${x.borders.max===null?20:x.borders.max.value}`),
			solve: function(v){
				try {
					let zeroes = []
					for (let e of expr) {
						const equ = new PiMath.Equation(e.polynom, v)
						equ.solve()
						for (let z of equ.solutions) {
							if (checkValue(z.value, e.borders.min, e.borders.max)) {
								zeroes.push(z)
							}
						}
					}

					return {
						tex: zeroes.length > 0 ? `\\left\\{${zeroes.map(z => z.exact.tex).join(";")}\\right\\}` : "\\varnothing"
					}
				}catch{
					return {
						tex: "\\text{ merci d'entrer un nombre}"
					}
				}
			},
			evaluate: function(v){
				try {
					let Q = new PiMath.Fraction(v)

					return expr.filter(x => {
						return checkValue(Q.value, x.borders.min, x.borders.max)
					})[0].polynom.evaluate(Q)
				}catch{
					return "\\text{merci d'entrer un nombre}"
				}
			}
		}
	}),
	getOneExpression = function (fn, abs, min, max){
		const v = min===null?max.value-1:(max===null?min.value+1:(max.value+min.value)/2)
		let fnx = "" + fn

		for(let p of abs){
			if(p.polynom.evaluate(v).isNegative()){
				fnx = fnx.replace(p.match, `(${p.polynom.clone().opposed().display})`)
			}else{
				fnx = fnx.replace(p.match, `(${p.polynom.clone().display})`)
			}
		}

		return {
			polynom: new PiMath.Polynom(fnx),
			condition: min===null?`x\\leq${max.tex}`:(max===null?`x\\geq${min.tex}`:`${min.tex}\\leq x \\leq ${max.tex}`),
			borders: {min, max}
		}
	},
	randomAbs = function(){
		let z1 = PiMath.Random.numberSym(10, false),
			z2 = PiMath.Random.numberSym(10, false),
			p1 = new PiMath.Polynom(`x${(z1>0?"+":"")+z1 }`).multiply(PiMath.Random.numberSym(3, false)),
			p2 = new PiMath.Polynom(`x${(z2>0?"+":"")+z2 }`).multiply(PiMath.Random.numberSym(3, false)),
			k1 = PiMath.Random.numberSym(10, false),
			k2 = PiMath.Random.numberSym(10, false),
			k3 = PiMath.Random.numberSym(10)

		// -7abs(x+1)-abs(2x+18)+3

		fx.value= `${k1}abs(${p1.display})${(k2>0?"+":"") + k2}abs(${p2.display})${k3===0?"":((k3>0?"+":"")+k3)}`
	},
	draw = computed(()=>{
		let alpha = "fghijklmn"
		return {
			code: expression.value.drawCode.map(
				(f, index)=>`${alpha[index]}(x)=${f.replace(/([0-9])x/, "$1*x")}`
			).join("\n"),
			parameters: "axis,grid,x=-20:20,y=-20:20"
		}
	})
</script>

