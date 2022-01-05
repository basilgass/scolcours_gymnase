<template>
	<section ref="root">
		<what-to-know :questions="whatToKnowQuestions" />
		<primitive-simple />
	</section>
</template>

<script setup>
/** Chapter
 * title: Primitive ou intégrale indéfinie
 * body: calcul de primitive
 */

import { onMounted, ref } from 'vue'
import PrimitiveSimple from '@/Components/Exercise/algebre/PrimitiveSimple'
import WhatToKnow from '@/Components/Ui/WhatToKnow'

const root = ref(null),
	whatToKnowQuestions = ref([])

whatToKnowQuestions.value.push({
	question: '\\int 7 \\ \\text{d}x =',
	answer: '7x'
})

whatToKnowQuestions.value.push({
	question: '\\int 3x \\ \\text{d}x =',
	answer: '\\frac{3}{2}x^2'
})

whatToKnowQuestions.value.push({
	question: '\\int 5x^3 \\ \\text{d}x =',
	answer: '\\frac{5}{4}x^4'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{2}{5}x^2 \\ \\text{d}x =',
	answer: '\\frac{2}{15}x^3'
})

whatToKnowQuestions.value.push({
	question: '\\int 4x^2 + 3x + 5 \\ \\text{d}x =',
	answer: '\\frac{4}{3}x^3 + \\frac{3}{2}x + 5x'
})

whatToKnowQuestions.value.push({
	question: '\\int (x^2+3x)^3(2x+3) \\ \\text{d}x =',
	answer: '\\frac{1}{4}(x^2+3x)^4'
})

whatToKnowQuestions.value.push({
	question: '\\int (2x^3+5x)^5(12x^2+10) \\ \\text{d}x =',
	answer: '\\frac{1}{3}(2x^3+5x)^6'
})

whatToKnowQuestions.value.push({
	question: '\\int (x^2+4x)^3(x+2) \\ \\text{d}x =',
	answer: '\\frac{1}{8}(x^2+4x)^4'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{6x+7}{(3x^2+7x+9)^3} \\ \\text{d}x =',
	answer: '\\frac{-1}{2(3x^2+7x+9)^2}'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{18x^2}{(x^3+9)^4} \\ \\text{d}x =',
	answer: '\\frac{-6}{5(x^3+9)^3}'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{3x^3+x}{(3x^4+2x^2+1)^2} \\ \\text{d}x =',
	answer: '\\frac{-1}{12(3x^3+x+1)}'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{6x+5}{3x^2+5x-4} \\ \\text{d}x =',
	answer: '\\ln(\\vert3x^2+5x-4\\vert)'
})

whatToKnowQuestions.value.push({
	question: '\\int \\frac{3x^2+x}{2x^3+x^2} \\ \\text{d}x =',
	answer: '\\frac{1}{2}\\ln(\\vert 2x^3+x^2 \\vert)'
})

whatToKnowQuestions.value.push({
	question: '\\int 2x \\cdot e^{x^2-5} \\ \\text{d}x =',
	answer: 'e^{x^2-5}'
})

whatToKnowQuestions.value.push({
	question: '\\int (6x^2+8) e^{x^3+4x} \\ \\text{d}x =',
	answer: '2\\cdot e^{x^3+4x}'
})

whatToKnowQuestions.value.push({
	question: '\\int (x^4+3x^2) e^{x^5+5x^3} \\ \\text{d}x =',
	answer: '\\frac{1}{5} \\cdot e^{x^5+5x^3}'
})

onMounted(()=>{
	katexAutoRender(root.value)
})

</script>

