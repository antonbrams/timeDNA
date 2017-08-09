
import {levels, params} from './config'
import {range, buildRange, size, flat} from './time'
import {buildHelix} from './space'
import {make} from './point'
import {scene} from './render'
import {camCtrl} from './index'

// export let doShift = (tOld, tNew, depth) => {
// 	let rOld = range(tOld.getTime(), depth, params.range)
// 	let rNew = range(tNew.getTime(), depth, params.range)
// 	let dir  = tNew - tOld > 0
// 	// delete
// 	let toKeep = {
// 		min : dir? rNew.min: rOld.min,
// 		max : dir? rOld.max: rNew.max}
// 	clearPoints(toKeep.min, toKeep.max)
// 	// create
// 	let toCreate = {
// 		min : dir? rOld.max: rNew.min - size(new Date(rNew.max), depth),
// 		max : dir? rNew.max: rOld.min}
// 	buildRange(toCreate.min, toCreate.max, depth, level => {
// 		buildHelix(level)
// 	}, level => {
// 		let p = make(levels[level])
// 		levels[level].points.push(p)
// 		scene.add(p.group)
// 	})
// 	// console.log(levels.map(level => [level.label, level.points.length]))
// 	updateCameraControl(depth, tNew.getTime())
// }

let lastTime = 0
export let doDepth = (pick, depth) => {
	let now = flat(pick, depth).getTime()
	// build
	let toBuild = range(now, depth, params.range)
	buildRange(toBuild.min, toBuild.max, depth,
		time  => !levels[depth].points[time],
		level => buildHelix(level), 
		level => {
			let me = levels[level]
			if (!me.points[me.time]) {
				let p = make(me)
				p.now(p.timestamp.time == now)
				me.points[me.time] = p
				scene.add(p.group)
			}
		})
		
	let pDepth  = Math.max(depth-1, 0)
	let pTime   = flat(pick, pDepth).getTime()
	let pTarget = null
	// clear & set cam
	if (lastTime != now) {
		lastTime = now
		let toDelete  = range(now, 0, params.range)
		levels.forEach((level, l) => {
			for (let i in level.points) {
				if (i < toDelete.min || toDelete.max < i) {
					scene.remove(level.points[i].group)
					delete level.points[i]
				}
				if (l == pDepth && level.points[i].timestamp.time == pTime) 
					pTarget = level.points[i]
			}
		})
	} else {
		let p = levels[pDepth].points
		for (let i in p)
			if (p[i].timestamp.time == pTime) 
				pTarget = p[i]
	}
	// cam stuff
	camCtrl.up       = pTarget.gimble.y.clone()
	camCtrl.target   = pTarget.gimble.p.clone()
	camCtrl.position = pTarget.gimble.z.clone()
		.multiplyScalar(levels[pDepth].scale * 20000)
		.add(pTarget.gimble.p)
}
