<template>
	<div>
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
								class="w-6 text-xs pl-1"
							/>
							<div
								v-for="(zero, n) in tos.zeroes"
								:key="n"
								v-katex.inline="zero.tex"
								class="w-24 text-center hover:bg-white py-2"
							>
								/>
								<div
									v-katex.inline="`+\\infty`"
									class="w-6 text-xs mr-1"
								/>
							</div>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
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
									'cell-v-line': n%2===1
								}"
								class="w-12 text-center hover:bg-white py-2"
							/>
						</div>
					</td>
				</tr>
			</tbody>
			<tfoot class="border-t border-t-2 border-gray-400">
				<tr
					v-if="tos.type>0"
					class="border-t border-t-2 border-gray-400"
				>
					<td
						v-katex.inline="'f\'(x)'"
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
									'cell-v-line': n%2===1
								}"
								class="w-12 text-center hover:bg-white py-2"
							/>
						</div>
					</td>
				</tr>
				<tr
					v-if="tos.type>0"
					class="border-t border-t-2 border-gray-400"
				>
					<td
						v-katex.inline="'f(x)'"
						class="min-w-[100px] border-r text-center border-gray-400"
					/>
					<td>
						<div class="flex flex-row h-16">
							<div
								v-for="(sign, n) in displaySigns(tos.signs.length-2)"
								:key="`tos-foot-cell-${n}`"
								:class="{
									'cell-v-line-d':sign==='d',
									'cell-v-line': n%2===1,
								}"

								class="w-12 text-center hover:bg-white py-2 relative"
							>
								<div
									v-if="n%2===1"
									v-katex.inline="n%2===0?'':(sign==='z'?displayExtremes(n):'')"
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
						v-katex.inline="'f(x)'"
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
									'cell-v-line': n%2===1
								}"
								class="w-12 text-center hover:bg-white py-2"
							/>
						</div>
					</td>
				</tr>
			</tfoot>
		</table>

		<div class="text-center mt-5">
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
</template>
<script setup>
import {ref} from "vue"

// TODO: Refactor the footer.
let props = defineProps({
		tos: {
			required: true, type: Object
		}
	}),
	showTex = ref(false)

function displaySigns(index) {
	let signs = [...props.tos.signs[index]]
	signs.shift()
	signs.pop()

	return signs
}

function displayExtremes(index) {
	let zero = props.tos.zeroes[(index - 1) / 2],
		extreme = props.tos.extremes[zero.tex]

	return `\\substack{ ${extreme.type} \\\\ \\left(${extreme.tex.x}; ${extreme.tex.y}  \\right) }`
}

</script>
