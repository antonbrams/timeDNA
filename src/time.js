
import {levels} from './config'

// go through time
export let iterate = (beg, end, depth, helix, point) => {
	let date = null
	beg = flat(new Date(beg), depth).getTime()
	end = flat(new Date(end), depth).getTime()
	for (let t = beg; t < end; t += levels[depth].size) {
		for (let level = 0; level <= depth; level ++) {
			levels[level].loop = t == levels[level].flat + levels[level].size
			if (t == beg || levels[level].loop) {
				date = new Date(t)
				let flatTime = flat(date, level)
				// save flat and size to the next level
				levels[level].flat = flatTime.getTime()
				levels[level].size = size(flatTime, level)
			}
			helix(t, level)
			if (levels[level].loop) point(date, level)
		}
	}
}

// set timelevel behind threshold to zero
export let flat = (time, level) => {
	let out = new Date(0)
	for (let i = 0; i <= level; i ++)
		out[`set${levels[i].label}`](time[`get${levels[i].label}`]())
	return out
}

// get timelevel + 1
let next = (time, level) => {
	let out = new Date(time.getTime())
	out[`set${levels[level].label}`](out[`get${levels[level].label}`]()+1)
	return out
}

// gets size of the level
let size = (time, level) => next(time, level) - time

// calculate range
export let range = (level, length) => {
	if (level == 0)
		length = 10
	else {
		let remainder = length
		for (let i = level; i > 0; i --) {
			remainder = remainder * levels[i].ms / levels[i-1].ms
			length -= remainder
			if (remainder < 1) break
		}
		length = Math.floor(length)
	}
	return length * levels[level].ms / 2
}