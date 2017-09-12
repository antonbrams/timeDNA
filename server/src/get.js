
// const colors = require('colors')
import fs     from 'fs'
import config from './config'

let iterateLines = (path, doLine, onEnd) => {
	let lines  = ''
	let line   = ''
	let number = 0
	var regExp = new RegExp(/\n/)
	let stream = fs.createReadStream(path)
	stream.on('data', chunk => {
	    lines += chunk.toString()
		while (regExp.test(lines)) {
			let list = lines.split('\n')
				line = list.shift()					
			if (!doLine(line, number ++))
				lines = list.join('\n')
			else {
				stream.close()
				break
			}
		}
	})
	stream.on('error', err => {
		onEnd && onEnd(line, number)
	})
	stream.on('close', () => {
		onEnd && onEnd(line, number)
	})
}

let flat = unix => {
	let date = new Date(unix)
	date.setMilliseconds(0)
	date.setSeconds(0)
	date.setMinutes(0)
	return date.getTime()
}

let makeJobs = request => {
	let query = {}
	for (let i = 0; i < request.length; i ++) {
		let a = request[i][1]
		let b = a - config.units[request[i][0]]
		let pathA = flat(a)
		let pathB = flat(b)
		if (!query[pathA]) query[pathA] = []
		if (!query[pathB]) query[pathB] = []
		if (query[pathA].indexOf(a) == -1) query[pathA].push(a)
		if (query[pathB].indexOf(b) == -1) query[pathB].push(b)
	}
	return query
}

let mean = (integral, request) => {
	let out = {}
	for (let i = 0; i < request.length; i ++) {
		let a = request[i][1]
		let u = config.units[request[i][0]]
		let b = a - u
		if (integral[a] && integral[b]) {
			let sum = integral[a] - integral[b]
			if (!out[request[i][0]]) out[request[i][0]] = {}
			out[request[i][0]][a] = sum / u * 1000
		}
	}
	return out
}

module.exports = (request, result) => {
	let query     = makeJobs(request)
	let integral  = {}
	let queryKeys = Object.keys(query)
	let m = 0
	for (let i = 0; i < queryKeys.length; i ++) {
		let n = 0
		let jobs = query[queryKeys[i]].sort()
		// fs.writeFile('./out.txt', JSON.stringify(jobs), console.log)
		iterateLines(config.genPath(queryKeys[i]), line => {
			let data = line.split(' ')
				data[0] = parseInt(data[0])
			if (data[0] == jobs[n]) {
				integral[data[0]] = parseFloat(data[1])
				if (n ++ == jobs.length - 1) return true
			}
		}, () => {
			if (m ++ == queryKeys.length - 1) 
				result(mean(integral, request))
		})
	}
}

// if (0) {
// 	console.time('time')
// 	test([
// 		[5, 1262318410000],
// 		[5, 1262318416000],
// 		[5, 1262318417000],
// 		[5, 1262318418000]
// 	], val => {
// 		console.log(val)
// 		console.timeEnd('time')
// 	})
// }
