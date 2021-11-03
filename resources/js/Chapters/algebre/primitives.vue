<template>
	<section>
		<Panel class="bg-green-300 border-green-600 border-l-4 border-l-red-400 rounded-l-none">
			La primitive \(F\) d'une fonction \(f\) est la fonction qui, lorsqu'elle est dérivée, donne la fonction \(f\)
		</Panel>

		<p>exemples</p>
		<div>
			\(f(x) = x^2 \implies F(x) = \frac{1}{3}\cdot x^3 + c\) avec \(c \in \mathbb{R}\)
		</div>

		<Panel
			:type="correct?'success':''"
			class="max-w-md mt-4"
		>
			<div class="py-2 h-20 flex items-center">
				<div>Calculer une primitive de <span v-katex.inline="`f(x)=${question}`"/></div>
			</div>

			<KatexEditor v-model="userAnswer" @keypress.enter="newQuestion()"/>
		</Panel>
	</section>
</template>

<script>
import Panel from "@/Components/Ui/Panel"
import KatexEditor from "@/Components/Ui/KatexEditor"

export default {
	name: "Primitives",
	components: {KatexEditor, Panel},
	data() {
		return {
			userAnswer: "",
			question: "",
			answer: ""
		}
	},
	computed: {
		correct: function () {
			return this.userAnswer === this.answer
		}
	},
	mounted() {
		this.newQuestion()

		// Auto render the math inside this component
		window.katexAutoRender(this.$el)
	},
	methods: {
		newQuestion() {
			this.userAnswer = ''
			const M = new Pi.Monom().random("x", Pi.Numeric.randomInt(1, 8), true)

			this.question = M.tex
			this.answer = M.primitive().display
		},
	}
}
</script>

