
const fs     = require('fs')
const Noise  = require('simplex-noise')
const config = require('./config.js')

let beg	 = new Date(2010,0,1,0,0,0,0).getTime()
let end	 = new Date(2011,0,1,0,0,0,0).getTime()

let simplex  = new Noise(() => 0)
let generateNoise = unix => {
	let second = .9 + .2 * simplex.noise2D(unix / 1000, 0)
	let minute = .9 + .2 * simplex.noise2D(unix / 60000, 0)
	let hour   = .9 + .2 * simplex.noise2D(unix / 3600000, 0)
	let day    = .8 + .4 * simplex.noise2D(unix / 86400000, 0)
	let month  = .5 + .5 * simplex.noise2D(unix / 2628000000, 0)
	return second * minute * hour * day * month
}

// check noise function
if (0) {
	let end = new Date(2010,0,2,0,0,0,0).getTime()
	for (let i = beg; i < end; i += 1000) {
		let noise = generateNoise(i/10)
		let scaled = parseInt(noise * 50)
		console.log(noise + '\t' + new Array(scaled).fill('-').join(''))
	}
}

// generate file
if (1) {
	let prev = 0
	let unit = -1
	let path = ''
	let iterate = i => {
		let currentUnit = new Date(i).getHours()
		if (unit != currentUnit) {
			unit = currentUnit
			path = config.genPath(i)
		}
		prev += generateNoise(i)
		fs.appendFile(path, `${i} ${prev}\n`, err => {  
		    if (err) throw err
			if (i < end - 1000) iterate(i += 1000)
		})
	}
	iterate(beg)
}

// do integral map
if (0) {
	let data  = fs.readFileSync(source)
	let lines = data.toString().split('\n')
	let sum   = 0
	let iterate = i => {
		let object = lines[i].split(' : ')
		sum += parseFloat(object[1])
		let newLine = `${object[0]} ${sum}`
		fs.appendFile(integral, `${newLine}\n`, err => {  
		    if (err) throw err
			if (i < lines.length) iterate(i += 1)
		})
	}
	iterate(0)
}

// check length
if (0) {
	console.log('required \t:', (end - beg) / 1000)
	// source
	let dSource = fs.readFileSync(source)
	let rSource  = dSource.toString().split('\n').length
	console.log('found \t\t:', rSource - 2)
	// integral
	let dIntegral = fs.readFileSync(integral)
	let rIntegral  = dIntegral.toString().split('\n').length
	console.log('found \t\t:', rIntegral - 2)
}
