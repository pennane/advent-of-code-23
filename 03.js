import fs from 'fs'
import * as R from 'ramda'

const INPUT_FILE = '03.input'

const readFile = file => fs.readFileSync(file, {encoding:'utf8'})

const isDigit = R.pipe(parseInt,isNaN,R.not)
const isSymbol = R.both(R.pipe(isDigit, R.not), R.pipe(R.equals("."), R.not))

const hasSymbolAdjacent = (lines, x, y) => {
	const height = lines.length
	const width = lines[0].length

	for (let dy = -1; dy <= 1; dy++) {
		const my = y + dy
		if (my >= height || my < 0) continue
		for (let dx = -1; dx <= 1; dx++) {
			const mx = x + dx
			if (mx >= width || mx < 0) continue
			if (isSymbol(lines[my][mx])) return true
		}
	}
	return false
}

const findSymbolAdjacentNumbers = (lines) => {
	const height = lines.length
	const width = lines[0].length

	const numbers = []


	for (let y = 0; y < height; y++) {
		let currentNumber = ""
		let currentHasSymbolAdjacent = false
		for (let x = 0; x < width; x++) {
			if (!isDigit(lines[y][x])) {
				if (currentNumber && currentHasSymbolAdjacent) {
					numbers.push(parseInt(currentNumber))
				}
				currentNumber = ""
				currentHasSymbolAdjacent = false
				continue
			}
			currentNumber += lines[y][x]
			if (!currentHasSymbolAdjacent) {
				currentHasSymbolAdjacent = hasSymbolAdjacent(lines, x, y)
			}	
		}
		if (currentNumber && currentHasSymbolAdjacent) {
			numbers.push(parseInt(currentNumber))
		}
	} 
	return numbers
}


const pipeline = R.pipe(readFile, R.split("\n"), R.reject(R.isEmpty), findSymbolAdjacentNumbers, R.sum)


console.log(pipeline(INPUT_FILE))

