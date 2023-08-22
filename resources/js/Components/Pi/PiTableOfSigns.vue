<!--
Affichage d'un tableau de signes ou de croissance.
// TODO: Refactor the footer.
-->
<template>
	<div class="table-of-sign-wrapper">
		<div class="not-prose">
			<table
				class="border-r tos border-gray-400 mx-auto"
			>
				<thead>
					<tr>
						<th class="border-r border-gray-400" />
						<th>
							<div
								class="flex flex-row items-center"
							>
								<div
									v-katex.inline="`-\\infty`"
									class="text-xs pl-1 text-left"
									:class="tos.zeroes.length===0?'w-12':'w-6'"
								/>
								<div
									v-for="(zero, n) in tos.zeroes"
									:key="n"
									v-katex.inline="zero.tex"
									class="w-24 text-center hover:bg-white py-2"
								>
									/>
								</div>
								<div
									v-katex.inline="`+\\infty`"
									class="text-xs mr-1 text-right"
									:class="tos.zeroes.length===0?'w-12':'w-6'"
								/>
							</div>
						</th>
					</tr>
				</thead>
				<tbody v-show="!minimal">
					<tr
						v-for="(factor, index) of tos.factors"
						:key="`tos-${index}`"
						class="border-t first:border-gray-400"
					>
						<td
							v-katex.inline="factor.tex"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row">
								<div
									v-for="(sign, n) of displaySigns(index)"
									:key="`tos-${index}-cell-${n}`"
									v-katex.inline="n%2===0?sign:(sign==='z'?'0':'')"
									:class="{
										'cell-v-line-d':sign==='d',
										'cell-v-line': n%2===1,
										'w-24': tos.zeroes.length===0,
										'w-12': tos.zeroes.length>0
									}"
									class="text-center hover:bg-white py-2"
								/>
							</div>
						</td>
					</tr>
				</tbody>
				<tfoot class="border-t border-t-2 border-gray-400">
					<tr
						v-if="tos.type==='grows'"
						class="border-t border-t-2 border-gray-400"
					>
						<td
							v-katex.inline="`${dxName}`"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row">
								<div
									v-for="(sign, n) in displaySigns(tos.signs.length-2)"
									:key="`tos-foot-cell-${n}`"
									v-katex.inline="n%2===0?sign:(sign==='z'?'0':'')"
									:class="{
										'cell-v-line-d':sign==='d',
										'cell-v-line': n%2===1,
										'w-24': tos.zeroes.length===0,
										'w-12': tos.zeroes.length>0
									}"
									class="w-12 text-center hover:bg-white py-2"
								/>
							</div>
						</td>
					</tr>
					<tr
						v-if="tos.type==='grows'"
						class="border-t border-t-2 border-gray-400"
					>
						<td
							v-katex.inline="`${fnName}`"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row h-16">
								<div
									v-for="(sign, n) in displaySigns(tos.signs.length-2, true)"
									:key="`tos-foot-cell-${n}`"
									:class="{
										'cell-v-line-d':sign==='d',
										'cell-v-line': n%2===1,
										'w-24': tos.zeroes.length===0,
										'w-12': tos.zeroes.length>0
									}"

									class="w-12 text-center hover:bg-white py-2 relative"
								>
									<div
										v-if="n%2===1"
										v-katex.inline="displayExtremes(n)"
										class="text-center translate-y-6 absolute left-1/2 -translate-x-1/2 bg-white z-50"
									/>
									<i
										v-else
										:class="{'bi-arrow-down-right':sign==='-','bi-arrow-up-right':sign==='+'}"
										class="bi"
									/>
								</div>
							</div>
						</td>
					</tr>

					<tr
						v-if="tos.type===undefined"
						class="border-t border-t-2 border-gray-400"
					>
						<td
							v-katex.inline="`${fnName}`"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row">
								<div
									v-for="(sign, n) in displaySigns(tos.signs.length-1)"
									:key="`tos-foot-cell-${n}`"
									v-katex.inline="n%2===0?sign:(sign==='z'?'0':'')"
									:class="{
										'cell-v-line-d':sign==='d',
										'cell-v-line': n%2===1,
										'w-24': tos.zeroes.length===0,
										'w-12': tos.zeroes.length>0
									}"
									class="w-12 text-center hover:bg-white py-2"
								/>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>

			<div
				v-if="tos.tex && tos.tex!==''"
				class="text-center mt-5"
			>
				<button
					class="text-xs"
					@click="showTex=!showTex"
				>
					Afficher le code TeX
				</button>
				<pre
					v-show="showTex"
					class="text-left my-2 mx-auto max-w-md bg-gray-200 border border-gray-400 overflow-x-scroll"
					v-text="tos.tex"
				/>
			</div>
		</div>
	</div>
</template>
<script setup>
import {computed, ref} from "vue"

let props = defineProps({
		tos: {required: true, type: Object},
		fn: {type: String, default: "f(x)"},
		minimal: {type: Boolean, default: false},
		extremes: {type: String, default: null},
	}),
	showTex = ref(false)

const fnName = computed(()=>{
		if(props.fn===null){return "f(x)"}

		return props.fn
	}),
	dxName = computed(()=>{
		if(fnName.value.includes("(")){
			const [name, x] = fnName.value.split("(")
			return `${name}'(${x}`
		}

		return `\\left(${fnName.value}\\right)'`
	})

function displaySigns(index, isGrows) {
	let signs
	if(isGrows && props.tos.grows){
		return props.tos.grows
	}

	signs = [...props.tos.signs[index]]
	signs.shift()
	signs.pop()

	return signs
}

function displayExtremes(index) {
	let zeroIndex = (index - 1) / 2,
		zero = props.tos.zeroes[zeroIndex],
		extreme = props.tos.extremes[zero.tex]

	if(props.extremes) {
		let labels = props.extremes.split(",")
		return zeroIndex < labels.length ? labels[zeroIndex] : labels[labels.length - 1]
	}else if(extreme!==undefined && extreme.label!==undefined){
		return `\\substack{ ${extreme.type} \\\\ ${extreme.label} }`
	}else if(extreme){
		return `\\substack{ ${extreme.type} \\\\ \\left(${extreme.tex.x}; ${extreme.tex.y}  \\right) }`
	}
	return ""
}
</script>
