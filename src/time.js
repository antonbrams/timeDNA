
import config, {levels} from './config'

// go through time
export let buildRange = (min, max, depth, check, helix, point) => {
	for (let t = min; t < max; t += levels[depth].time.size)
		buildSlice(t, depth, check, helix, point, t == min)
}

export let buildSlice = (t, depth, check, helix, point, init = true) => {	
	let date = null
	for (let level = 0; level <= depth; level ++) {
		let me = levels[level]
		me.time.unix = t
		me.time.loop = t == me.time.flat + me.time.size
		if (init || me.time.loop) {
			date = new Date(t)
			let flatTime = flat(date, level)
			me.time.date = date
			me.time.flat = flatTime.getTime()
			me.time.size = size(flatTime, level)
		}
		if (check(t)) {
			helix(level)
			if (me.time.loop) point(level)
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
		 if (depth == 0) length = 10
	else if (depth == 1) length = 80
	else {
		let remainder = length
		for (let i = depth; i > 0; i --) {
			remainder = remainder * levels[i].ms / levels[i-1].ms
			length -= remainder
			if (remainder < 1) break
		}
		length = Math.floor(length)
	}
	let r = length * levels[depth].ms / 2
	let p = Math.max(depth-1, 0)
	let f = flat(new Date(now), p).getTime()
	return {
		min : flat(new Date(f - r), depth).getTime(), 
		max : flat(new Date(f + r), depth).getTime()}
}
