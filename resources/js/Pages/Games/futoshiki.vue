<template>
	<article>
		<ArticleTitle title="Futoshiki" />

		<div class="flex flex-col">
			<div
				v-for="(row, rowIndex) in futoshiki"
				:key="`row-${rowIndex}`"
				class="flex"
			>
				<div
					v-for="(item, colIndex) in row"
					:key="`cell-${rowIndex}-${colIndex}`"
					class="m-1 grid place-items-center"
				>
					<div
						v-if="rowIndex%2===0 && colIndex%2===0"
						class="w-16 h-16 border rounded-sm grid place-items-center"
					>
						<button
							class="min-w-0 w-full h-full text-center border rounded-sm bg-white"
						>
							{{ item.value }}
						</button>
					</div>
					<div
						v-else
						:class="{
							'w-5': colIndex%2===1,
							'w-16': colIndex%2===0,
							'h-16': rowIndex%2===0,
							'h-5': rowIndex%2===1,
						}"
						class="grid place-items-center"
					>
						<i
							class="bi"
							:class="{
								'bi-chevron-right': item.value==='>',
								'bi-chevron-left': item.value==='<',
								'rotate-90': rowIndex%2===1
							}"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="keyboard flex gap-4">
			<button
				class="key btn w-16 h-16"
				:class="suggest?'btn-edit':'bg-white'"
				@click="suggest=!suggest"
			>
				<i class="bi bi-pencil" />
			</button>
			<button
				v-for="n in rang"
				:key="`key-${n}`"
				class="key bg-white w-16 h-16"
			>
				{{ n }}
			</button>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle"
import {onMounted, ref} from "vue"

let futoshiki = ref([]),
	rang = ref(0),
	suggest = ref(false)

class futoshikiItem {
	constructor(value) {
		this.value = value
		this.user = {
			possibilites: [],
			answer: null
		}

		this.solver = {
			possibilites: [],
			greater: [],
			smaller: []
		}

	}
}

function generateFutoshiki(values, signs){
	futoshiki.value = []
	rang.value = Math.round(Math.sqrt(values.length))
	// Size of the values
	if(rang.value**2!==values.length){alert("Values are not correct")}
	// Number of values
	if(values.filter(x=>x>rang.value).length>0){alert("one number is too big.")}

	// Build the futoshiki data.
	let rowData
	for(let row=0; row<rang.value*2; row++){
		rowData = []
		for(let col=0; col<rang.value*2; col++){
			if(col%2===0 && row%2===0){
				rowData.push(new futoshikiItem(values[row/2*rang.value+col/2]))
			}else if(col%2===1 && row%2===1){
				rowData.push(new futoshikiItem(null))
			}else{
				const s = signs[`${row}-${col}`]
				rowData.push(new futoshikiItem(
					s===undefined?"":s
				))
			}
		}

		futoshiki.value.push(rowData)
	}

	console.log(futoshiki.value)

}
onMounted(()=>{
	generateFutoshiki([3,3,3,1,2,3,2,3,1], {
		"0-1": ">",
		"0-3": "<",
		"1-2": "<",
		"3-2": "<"
	})
})
</script>
