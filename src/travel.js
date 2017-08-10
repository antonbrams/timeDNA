
import config, {levels} from './config'
import * as time from './time'
import * as space from './space'
import * as Point from './point'
import * as render from './render'

export let doDepth = (pick, depth, points) => {
	// get flat
	let now = time.flat(pick, depth).getTime()
	// build
	let toBuild = time.range(now, depth, config.range)
	time.buildRange(toBuild.min, toBuild.max, depth,
		time  => !levels[depth].points[time],
		level => space.buildHelix(level),
		level => {
			let me = levels[level]
			if (!me.points[me.time.unix]) {
				me.points[me.time.unix] = Point.build(me)
				render.scene.add(me.points[me.time.unix].group)}
		})
	// clear & set cam
	let pDepth   = Math.max(depth-1, 0)
	let pTime    = time.flat(pick, pDepth).getTime()
	let toDelete = time.range(now, 0, config.range)
	// iterate through all points
	levels.forEach((level, l) => {
		let flat = time.flat(pick, l).getTime()
		for (let i in level.points) {
			let p = level.points[i]
			// remove if outside of range
			if (lastTime != now && (i < toDelete.min || toDelete.max < i)) {
				render.scene.remove(p.group)
				delete level.points[i]
			// do other stuff
			} else {
				// set colors
				p.setColors(toBuild.min, flat, toBuild.max, depth)
				// interface
				points && points(p, l == pDepth && p.time.unix == pTime)
			}
		}
	})
	lastTime = now
}
let lastTime = 0
