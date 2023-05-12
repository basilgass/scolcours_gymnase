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
							class="min-w-0 w-full h-full text-center border rounded-sm"
							:class="item.selected?'is-active':'bg-white'"
							@click="updateSelection(item)"
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

		<div class="keyboard flex gap-4 mt-10">
			<button
				class="key btn w-10 h-10"
				:class="suggest?'btn-edit':'bg-white'"
				@click="suggest=!suggest"
			>
				<i class="bi bi-pencil" />
			</button>
			<button
				v-for="n in rang"
				:key="`key-${n}`"
				class="key bg-white w-10 h-10"
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
		this.original = value!==undefined
		this.selected = false
		this.user = {
			possibilites: [],
			answer: null
		}

		this.solver = {
			possibilites: [],
			top: [],
			bottom: [],
			left: [],
			right: [],
			column: [],
			row: []
		}

	}
}

function generateFutoshiki(size, values, signs){
	// Build the futoshiki data.
	let rowData,
		futoshikiData = []
	for(let row=0; row<size*2-1; row++){
		rowData = []
		for(let col=0; col<size*2-1; col++){
			if(col%2===0 && row%2===0){
				// It's a value
				rowData.push(new futoshikiItem(values[`${row/2}-${col/2}`]))
			}else if(col%2===1 && row%2===1){
				// It's an intersection
				rowData.push(new futoshikiItem(null))
			}else{
				// It's a sign.
				const s = signs[`${row}-${col}`]
				rowData.push(new futoshikiItem(
					s===undefined?"":s
				))
			}
		}

		futoshikiData.push(rowData)
	}


	return futoshikiData
}

function solveFutoshiki(data) {
	console.table(data)
}

function updateSelection(item) {
	// Cancel all selections
	if(item.selected===true){
		item.selected = false
		return
	}

	for(let i=0; i<futoshiki.value.length; i++){
		for(let j=0; j<futoshiki.value[i].length; j++){
			futoshiki.value[i][j].selected=false
		}
	}

	if(item.original===false) {
		item.selected = true
	}
}
onMounted(()=>{
	// Define the size of the futoshiki
	futoshiki.value = generateFutoshiki(
		3,
		{
			"0-2": 3,
			"1-1": 2,
			"2-2": 1
		},
		{
			"0-1": ">",
			"0-3": "<",
			"1-2": "<",
			"3-2": "<"
		})
	rang.value = 3

	solveFutoshiki(futoshiki.value)
})
</script>
