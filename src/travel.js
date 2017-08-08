
import {levels, params} from './config'
import {range, buildRange, size, flat} from './time'
import {buildHelix} from './space'
import {make} from './point'
import {scene} from './render'
import {camCtrl} from './index'

export let doShift = (tOld, tNew, depth) => {
	let rOld = range(tOld.getTime(), depth, params.range)
	let rNew = range(tNew.getTime(), depth, params.range)
	let dir  = tNew - tOld > 0
	// delete
	let toKeep = {
		min : dir? rNew.min: rOld.min,
		max : dir? rOld.max: rNew.max}
	clearPoints(toKeep.min, toKeep.max)
	// create
	let toCreate = {
		min : dir? rOld.max: rNew.min - size(new Date(rNew.max), depth),
		max : dir? rNew.max: rOld.min}
	buildRange(toCreate.min, toCreate.max, depth, level => {
		buildHelix(level)
	}, level => {
		let p = make(levels[level])
		levels[level].points.push(p)
		scene.add(p.group)
	})
	// console.log(levels.map(level => [level.label, level.points.length]))
	updateCameraControl(depth, tNew.getTime())
}

export let doDepth = (pick, depth) => {
	clearPoints()
	let prev = Math.max(depth-1, 0)
	let currFlat = flat(pick, depth).getTime()
	let prevFlat = flat(pick, prev).getTime()
	let {min, max} = range(prevFlat, depth, params.range)
	buildRange(min, max, depth, level => {
		buildHelix(level)
	}, level => {
		let p = make(levels[level])
		p.now(p.timestamp.time == currFlat)
		levels[level].points.push(p)
		scene.add(p.group)
	})
	updateCameraControl(depth, prevFlat)
}

let clearPoints = (to, from) => {
	levels.forEach(level => {
		level.points.forEach((point, i) => {
			let rangeExists = to && from
			let window = rangeExists && (
				point.timestamp.time < to || 
				from < point.timestamp.time)
			if (window || !rangeExists) {
				scene.remove(point.group)
				level.points[i] = undefined
			}
		})
		level.points = level.points.filter(p => p)
	})
}

let updateCameraControl = (depth, time) => {
	let level = levels[Math.max(depth-1, 0)]
	level.points.forEach(p => {
		if (p.timestamp.time == time) {
			camCtrl.up       = p.gimble.y.clone()
			camCtrl.target   = p.gimble.p.clone()
			camCtrl.position = p.gimble.z.clone()
				.multiplyScalar(level.scale * 20000)
				.add(p.gimble.p)
		}
	})
}
