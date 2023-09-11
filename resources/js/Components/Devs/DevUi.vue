<script setup lang="ts">
import UiSlider from "@/Components/Ui/UiSlider.vue"
import {ref} from "vue"
import FormNumber from "@/Components/Form/FormNumber.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {ExampleChecker} from "@/Composables/Checkers/CheckerBase";

let value = ref(15),
	vmin = ref(10),
	vmax = ref(40),
	ta = ref(""),
	crtLine = ref("")


let chk = new ExampleChecker(['trois', 'quatre', 'cinq'])
console.log(chk.name)
console.log(chk.description)
console.log(chk.format())


function updateCrtLine(evt) {
	crtLine.value = evt
}

let md = ref(`<div class="not-prose">
\t\t\t<table class="border-r tos border-gray-400 mx-auto">
\t\t\t\t<thead>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<th class="border-r border-gray-400" /><th>
\t\t\t\t\t\t\t<div class="flex flex-row items-center">
\t\t\t\t\t\t\t\t<div class="text-xs pl-1 text-left w-12 katex-container">
\t\t\t\t\t\t\t\t\t<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>−</mo><mi mathvariant="normal">∞</mi></mrow><annotation encoding="application/x-tex">-\\infty</annotation></semantics></math></span><span
\t\t\t\t\t\t\t\t\t\tclass="katex-html"
\t\t\t\t\t\t\t\t\t\taria-hidden="true"
\t\t\t\t\t\t\t\t\t><span class="base"><span
\t\t\t\t\t\t\t\t\t\tclass="strut"
\t\t\t\t\t\t\t\t\t\tstyle="height:0.6667em;vertical-align:-0.0833em;"
\t\t\t\t\t\t\t\t\t/><span class="mord">−</span><span class="mord">∞</span></span></span></span>
\t\t\t\t\t\t\t\t</div><div class="text-xs mr-1 text-right w-12 katex-container">
\t\t\t\t\t\t\t\t\t<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>+</mo><mi mathvariant="normal">∞</mi></mrow><annotation encoding="application/x-tex">+\\infty</annotation></semantics></math></span><span
\t\t\t\t\t\t\t\t\t\tclass="katex-html"
\t\t\t\t\t\t\t\t\t\taria-hidden="true"
\t\t\t\t\t\t\t\t\t><span class="base"><span
\t\t\t\t\t\t\t\t\t\tclass="strut"
\t\t\t\t\t\t\t\t\t\tstyle="height:0.6667em;vertical-align:-0.0833em;"
\t\t\t\t\t\t\t\t\t/><span class="mord">+</span><span class="mord">∞</span></span></span></span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</th>
\t\t\t\t\t</tr>
\t\t\t\t</thead><tbody /><tfoot class="border-t border-t-2 border-gray-400">
\t\t\t\t\t<!--v-if--><!--v-if--><tr class="border-t border-t-2 border-gray-400">
\t\t\t\t\t\t<td class="min-w-[100px] border-r text-center border-gray-400 katex-container">
\t\t\t\t\t\t\t<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x)</annotation></semantics></math></span><span
\t\t\t\t\t\t\t\tclass="katex-html"
\t\t\t\t\t\t\t\taria-hidden="true"
\t\t\t\t\t\t\t><span class="base"><span
\t\t\t\t\t\t\t\tclass="strut"
\t\t\t\t\t\t\t\tstyle="height:1em;vertical-align:-0.25em;"
\t\t\t\t\t\t\t/><span
\t\t\t\t\t\t\t\tclass="mord mathnormal"
\t\t\t\t\t\t\t\tstyle="margin-right:0.10764em;"
\t\t\t\t\t\t\t>f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>
\t\t\t\t\t\t</td><td><div class="flex flex-row" /></td>
\t\t\t\t\t</tr>
\t\t\t\t</tfoot>
\t\t\t</table><!--v-if-->
\t\t</div>
\t\t{.border .px-3 .py-1 .border-blue-600 bg-blue-100}`)
</script>

<template>
	<markdown-it :text="md"/>

	<form-number
		v-model="vmin"
		name="vmin"
	/>
	<form-number
		v-model="vmax"
		name="vmin"
	/>
	<div>
		<ui-slider
			v-model="value"
			:max="vmax"
			:min="vmin"
		/>
	</div>

	<div>FROM UI COMPONENT: {{ value }}</div>

	<form-textarea
		v-model="ta"
		label="test avec ligne courant"
		name="test"
		@current-line="updateCrtLine"
	/>
	<div
		v-theme.border="'arithmetique'"
		class="border"
	>
		{{ crtLine }}
	</div>

	<div class="bg-white p-10">

		<FormKit
			label="Hello world"
			placeholder="why not ?"
			type="text"
			suffix-icon="avatarMan"
			suffix-icon-class="!p-0"
		/>

		<FormKit
			label="small text"
			placeholder="why not ?"
			type="text"
			input-class="!py-1 text-xs w-full"
			prefix-icon="avatarMan"
		/>

	</div>
</template>
