
import {levels, params} from './config'

// export let pyramide = (time, helix, point) => {
// 	// get all ranges
// 	for (let i = 0; i < levels.length; i ++)
// 		levels[i].range = range(time.getTime(), i, params.range)
// 	// build
// 	let depth = 0
// 	let start = levels[0]
// 	let step  = start.size
// 	let ran   = start.range
// 	for (let t = ran.min; t < ran.max; t += step) {
// 		buildSlice(t, depth, helix, point, t == ran.min)
// 		for (let i = 0; i < 1; i ++) {
// 			console.log(t, i)
// 			if (levels[i].range.min <= t && t <= levels[i].range.max) {
// 				depth = i
// 			}
// 		}
// 		console.log(depth)
// 		step = levels[depth].size
// 	}
// }

// go through time
export let buildRange = (min, max, depth, check, helix, point) => {
	for (let t = min; t < max; t += levels[depth].size)
		buildSlice(t, depth, check, helix, point, t == min)
}

export let buildSlice = (t, depth, check, helix, point, init = true) => {
	let date = null
	for (let level = 0; level <= depth; level ++) {
		let me = levels[level]
		me.time = t
		me.loop = t == me.flat + me.size
		if (init || me.loop) {
			date = new Date(t)
			let flatTime = flat(date, level)
			me.date  = date
			me.flat  = flatTime.getTime()
			me.size  = size(flatTime, level)
		}
		if (check(t)) {
			helix(level)
			if (me.loop) point(level)
		}
	}
}

// set timelevel behind threshold to zero
export let flat = (time, depth) => {
	let out = new Date(0,0,1,0,0,0,0) 
	for (let i = 0; i <= depth; i ++)
		out[`set${levels[i].label}`]
			(time[`get${levels[i].label}`]())
	return out
}

// get timelevel + 1
let offset = (time, depth, dir) => {
	let out = new Date(time.getTime())
	out[`set${levels[depth].label}`]
		(out[`get${levels[depth].label}`]() + dir)
	return out
}

export let prev = (time, depth) => offset(time, depth, -1)
export let next = (time, depth) => offset(time, depth, +1)

// gets size of the level
export let size = (time, depth) => next(time, depth) - time

// calculate range
export let range = (now, depth, length) => {
	let d = Math.max(depth, 1)
	let remainder = length
	for (let i = d; i > 0; i --) {
		remainder = remainder * levels[i].ms / levels[i-1].ms
		length -= remainder
		if (remainder < 1) break
	}
	length = Math.floor(length)
	let r = length * levels[d].ms / 2
	return {
		min : flat(new Date(now - r), depth).getTime(), 
		max : flat(new Date(now + r), depth).getTime()}
}
