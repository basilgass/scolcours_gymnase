<script lang="ts" setup>
import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { NumExp } from "pimath/esm/maths/numexp"
import { IllustrationInterface } from "@/types/modelInterfaces"

let props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true }
})

type bissection = {
	a: number
	b: number
	fa: number
	fb: number
	m: number
	fm: number,
	choix?: "a" | "b"
}

let f = ref("3x+1"),
	a = ref(-2),
	b = ref(2),
	fixed = ref(3),
	table = ref<bissection[]>([])

const fxExp = computed<NumExp>(() => {
	return new NumExp(f.value)
})

function fx(value: number): number {
	if (isNaN(value)) return NaN

	return fxExp.value.evaluate({ x: value })
}

function rnd(value: number): number {
	if (isNaN(value)) return 0
	return +((+value).toFixed(fixed.value))
}

function garderLaBorne(borne: "a" | "b"): void {
	table.value[table.value.length - 1].choix = borne

	const m = (+a.value + (+b.value)) / 2

	if (borne === "a") {
		table.value.push({
			a: +a.value,
			b: +m,
			fa: fx(+a.value),
			fb: fx(+m),
			m: (+a.value + m) / 2,
			fm: fx((+a.value + m) / 2)
		})
		b.value = m
	} else {
		table.value.push({
			a: +m,
			b: +b.value,
			fa: fx(+m),
			fb: fx(+b.value),
			m: (+b.value + m) / 2,
			fm: fx((+b.value + m) / 2)
		})
		a.value = m
	}
}

const controleAB = computed(()=>{
	return fx(a.value)*fx(b.value)<0
})

function commencer() {
	table.value.push({
		a: +a.value,
		b: +b.value,
		fa: fx(a.value),
		fb: fx(b.value),
		m: (+a.value + (+b.value)) / 2,
		fm: fx((+a.value + (+b.value)) / 2)
	})
}

function recommencer() {
	table.value = []
	a.value = 0
	b.value = 1
}

function auto() {
	commencer()
	let row = table.value[0]
	const borneInferieure = row.a < 0 ? "a" : "b",
		borneSuperieure = row.a < 0 ? "b" : "a"

	while (Math.abs(row.a - row.b) > 0.01) {
		garderLaBorne(row.fm < 0 ? borneInferieure : borneSuperieure)
		row = table.value[table.value.length-1]

		// Security trigger
		if (table.value.length > 20) {
			break
		}
	}
}

</script>

<template>
	<div>
		<div
			v-if="table.length===0"
			class=" bg-white border p-4 mx-auto max-w-xl"
		>
			<div class="flex gap-3 mb-4">
				<form-maker
					v-model="f"
					focus
					inline-label
					label="\(f(x)=\)"
				/>
				<div v-katex.ascii="` = ${f}`" />
			</div>

			<div class="flex">
				<form-maker
					v-model="a"
					class="max-w-[150px]"
					focus
					font-code
					inline-label
					label="\(a=\)"
				/>
				<div v-katex="`\\implies f(${a}) = ${fx(a)}`" />
			</div>

			<div class="flex">
				<form-maker
					v-model="b"
					class="max-w-[150px]"
					focus
					font-code
					inline-label
					label="\(b=\)"
				/>
				<div v-katex="`\\implies f(${b}) = ${fx(b)}`" />
			</div>

			<div class="flex gap-4 justify-center mt-10">
				<button
					class="btn btn-primary px-10 py-4 text-lg disabled:bg-gray-300 disabled:text-gray-500"
					@click="commencer"
					:disabled="!controleAB"
				>
					commencer
				</button>
				<button
					v-admin
					class="btn btn-primary px-10 py-4 text-lg disabled:bg-gray-300 disabled:text-gray-500"
					@click="auto"
					:disabled="!controleAB"
				>
					automatique
				</button>
			</div>
		</div>

		<div v-if="table.length>0">
			<table
				class="table-fixed border-collapse border bg-white w-full lg:max-w-[xl] mx-auto text-center"
			>
				<thead class="bg-amber-100 font-semibold">
					<td
						v-katex="'a'"
						class="border"
					/>
					<td
						v-katex="'b'"
						class="border"
					/>
					<td
						v-katex="'f(a)'"
						class="border"
					/>
					<td
						v-katex="'f(b)'"
						class="border"
					/>
					<td
						v-katex="'\\frac{a+b}{2}'"
						class="border"
					/>
					<td
						v-katex="'f\\left(\\frac{a+b}{2}\\right)'"
						class="border"
					/>
				</thead>
				<tbody>
					<tr
						v-for="(row,index) in table"
						:key="`ligne-${index}`"
					>
						<td
							:class="row.choix==='b'?'bg-gray-300 text-gray-500':''"
							class="border p-3"
						>
							<div
								v-if="index<table.length-1"
								v-katex="rnd(row.a)"
							/>
							<button
								v-else
								v-katex.nomargin="rnd(row.a)"
								class="btn btn-delete w-full"
								@click="garderLaBorne('b')"
							/>
						</td>

						<td
							:class="row.choix==='a'?'bg-gray-300 text-gray-500':''"
							class="border p-3"
						>
							<div
								v-if="index<table.length-1"
								v-katex="rnd(row.b)"
							/>
							<button
								v-else
								v-katex.nomargin="rnd(row.b)"
								class="btn btn-delete w-full"
								@click="garderLaBorne('a')"
							/>
						</td>

						<td
							v-katex="rnd(row.fa)"
							:class="row.choix==='b'?'bg-gray-300 text-gray-500':''"
							class="border"
						/>
						<td
							v-katex="rnd(row.fb)"
							:class="row.choix==='a'?'bg-gray-300 text-gray-500':''"
							class="border"
						/>
						<td
							v-katex="rnd(row.m)"
							class="border"
						/>
						<td
							v-katex="rnd(row.fm)"
							class="border"
						/>
					</tr>
				</tbody>
			</table>

			<div class="flex justify-center mt-10">
				<button
					class="btn btn-primary px-10 py-4 text-lg"
					@click="recommencer"
				>
					recommencer
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
