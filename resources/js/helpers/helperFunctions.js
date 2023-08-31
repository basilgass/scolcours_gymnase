

export function splitIfOutsideParentheses(value, splitCharacter) {

	let isInside = 0,
		arr = [],
		lastIndex = 0

	for(let i=0; i<value.length; i++){
		if (value[i] === "(") isInside++
		if (value[i] === ")") isInside--

		if(value[i] === splitCharacter && isInside===0) {
			arr.push(value.substring(lastIndex, i))
			lastIndex = i+1
		}
	}

	// Add the last item.
	arr.push(value.substring(lastIndex))
	return arr
}

export function splitAtSigns(value) {

	return splitIfOutsideParentheses(value, "-")
		.map((element, index) =>
			index > 0 ? ("-" + element) : element
		)
		.map(element => splitIfOutsideParentheses(element, "+"))
		.flat()
		.map(x=>x.trim())
		.filter(x=>x!=="")
}
