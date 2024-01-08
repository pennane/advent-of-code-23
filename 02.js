import fs from 'fs'
import * as R from 'ramda'

const INPUT_FILE = '02.input'

const MAX_COUNT_MAP = {
	"red": 12,
	"blue": 14,
	"green": 13
}

const sumBy = f => R.pipe(R.map(f), R.sum)
const multiplyAll = R.reduce(R.multiply, 1)

const readFile = file => fs.readFileSync(file, {encoding:'utf8'})
const parseGame = file => {
	const [idPart,gamePart] = file.split(":")
	const [_, id] = idPart.split(" ")
	const setStrings = gamePart.split(";")
	const pairs = setStrings
		.flatMap(set => set.split(",")
			.map(pair => pair.trim().split(" "))
			.map(([count, color]) => ({color, count}))
		)
	return {
		id,
		pairs
	}
}

const isPossibleGame = ({pairs}) => pairs.every(pair => pair.count <= MAX_COUNT_MAP[pair.color])

const findMinimumPossibleCount =  ({pairs}) => color => Math.max(...pairs.filter(p => p.color === color).map(R.prop("count"))) 
const findMinimumPossibleCounts = game => Object.keys(MAX_COUNT_MAP).map(findMinimumPossibleCount(game)) 

const getGamePower = R.pipe(findMinimumPossibleCounts, multiplyAll)

const pipeline = R.pipe(
	readFile,
	R.split("\n"),
	R.reject(R.isEmpty),
	R.map(parseGame),
	R.filter(isPossibleGame),
	sumBy(R.prop("id"))
)

const pipeline2 = R.pipe(
	readFile,
	R.split("\n"),
	R.reject(R.isEmpty),
	R.map(parseGame),
	R.map(getGamePower),
	R.sum
)

console.log(pipeline(INPUT_FILE), pipeline2(INPUT_FILE))
