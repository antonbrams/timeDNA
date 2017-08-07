
import {levels} from './config'

// go through time
export let span = (beg, end, depth, helix, point) => {
	for (let t = beg; t < end; t += levels[depth].size) 
		pick(t, depth, helix, point, t == beg)
}

export let pick = (t, depth, helix, point, init = true) => {
	let date = null
	for (let level = 0; level <= depth; level ++) {
		levels[level].time = t
		levels[level].loop = t == levels[level].flat + levels[level].size
		if (init || levels[level].loop) {
			date = new Date(t)
			levels[level].date = date
			let flatTime = flat(date, level)
			levels[level].flat = flatTime.getTime()
			levels[level].size = size(flatTime, level)
		}
		helix(level)
		if (levels[level].loop) point(level)
	}
}

// set timelevel behind threshold to zero
export let flat = (time, level) => {
	let out = new Date(0,0,1,0,0,0,0)
	for (let i = 0; i <= level; i ++)
		out[`set${levels[i].label}`](time[`get${levels[i].label}`]())
	return out
}

// get timelevel + 1
let offset = (time, level, dir) => {
	let out = new Date(time.getTime())
	out[`set${levels[level].label}`](out[`get${levels[level].label}`]() + dir)
	return out
}

export let prev = (time, level) => offset(time, level, -1)
export let next = (time, level) => offset(time, level, +1)

// gets size of the level
export let size = (time, level) => next(time, level) - time

// calculate range
export let range = (now, level, length) => {
	let remainder = length
	for (let i = level; i > 0; i --) {
		remainder = remainder * levels[i].ms / levels[i-1].ms
		length -= remainder
		if (remainder < 1) break
	}
	length = Math.floor(length)
	let r = length * levels[level].ms / 2
	return {
		beg : flat(new Date(now - r), level).getTime(), 
		end : flat(new Date(now + r), level).getTime()
	}
}
