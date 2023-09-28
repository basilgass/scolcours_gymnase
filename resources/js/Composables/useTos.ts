import {useKeyboard} from "@/Composables/useKeyboard"

let {keyboards} = useKeyboard()


export function makeStudyFromCode(code, showCoords, displayMode){
	let [zeroes, signs, grows, coords] = code.split("@")
	if(grows!==undefined){
		let extremes = {},
			extremesValues = coords?coords.split(","):[],
			zeroesValues = zeroes.split(",")

		if(!showCoords){
			extremesValues=[]
		}

		for(let i of zeroesValues){
			let z = zeroesValues[i],
				g = grows[2*i+1]

			if(g!==undefined) {
				let t = ""
				if (g === "M") {
					t = "max"
				} else if(g==="m") {
					t = "min"
				} else if(g==="_"){
					t = "replat"
				}

				let label = " "

				if(extremesValues[i]!==undefined){
					// if in writing mode, show a question mark
					if(displayMode){
						if(extremesValues[i] !== ""){
							label = `\\left(${z};${extremesValues[i]}\\right)`
						}

					}else {
						label = `\\left(${z};${extremesValues[i] === "" ? "?" : extremesValues[i]}\\right)`
					}
				}

				extremes[keyboards.exact.tex(z)] = {
					tex: {x: 1, y: 2},
					type: t,
					value: {x: 1, y: 2},
					label
				}
			}
		}

		return {
			zeroes: zeroes.split(",").map(x => {
				return {tex: keyboards.exact.tex(x)}
			}).filter(x=>x.tex!==""),
			factors: [],
			extremes,
			type: "grows",
			grows: [...grows.split("")],
			signs: [
				["", ...signs.split(""), ""],
				["", ...signs.split(""), ""]
			]
		}
	}

	return {
		zeroes: zeroes.split(",").map(x => {
			return {tex: keyboards.exact.tex(x)}
		}).filter(x=>x.tex!==""),
		factors: [],
		signs: [["", ...signs.split(""), ""]]
	}
}
