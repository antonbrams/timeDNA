
import {levels} from './config'

// go through time
export let iterate = (beg, end, depth, callback) => {
	let date = null
	beg = flat(new Date(beg), depth).getTime()
	for (let t = beg; t < end; t += levels[depth + 1].size) {
		for (let level = 0; level <= depth; level ++) {
			levels[level].loop = t == levels[level + 1].flat + levels[level + 1].size
			if (t == beg || levels[level].loop) {
				date = new Date(t)
				let flatTime = flat(date, level)
				// save flat and size to the next level
				levels[level + 1].flat = flatTime.getTime()
				levels[level + 1].size = size(flatTime, level)
			}
			callback(t, date, level)
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
