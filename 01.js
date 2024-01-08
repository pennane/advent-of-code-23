import fs from 'fs'
import * as R from 'ramda'

const INPUT_FILE = '01.input'

const readFile = file => fs.readFileSync(file, {encoding:'utf8'})

const WRITTEN_DIGIT_MAP = {
	"one":"1",
	"two":"2",
	"three":"3",
	"four":"4",
	"five":"5",
	"six":"6",
	"seven":"7",
	"eight":"8",
	"nine":"9"
}

const WRITTEN_DIGITS = Object.keys(WRITTEN_DIGIT_MAP)

const writtenDigitFromEnd = string => WRITTEN_DIGITS.find(digit => string.endsWith(digit))
	
const isDigit = R.pipe(parseInt,isNaN,R.not)

const getStringDigits = string => {
	const digits = []
	let scanned = ""
	for (const c of string) {
		scanned += c

		if (isDigit(c)) {
			digits.push(c)
			continue
		}

		const writtenDigit = writtenDigitFromEnd(scanned)

		if (writtenDigit) {
			digits.push(WRITTEN_DIGIT_MAP[writtenDigit])
			continue
		}
	}
	return digits
} 

const getCalibrationValue = R.pipe(getStringDigits, R.ifElse(R.isEmpty, R.always(null), R.converge(R.concat, [R.head, R.last])))
	
const pipeline = R.pipe(readFile, R.split('\n'), R.reject(R.isNil), R.map(getCalibrationValue), R.sum)

console.log(pipeline(INPUT_FILE))
