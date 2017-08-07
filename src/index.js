
import '../graphic/style.sass'
import {ArrowHelper, Vector3} from 'three'
import {controls, scene, camera, loop} from './render'
import {levels, world} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'

let makeOne = (depth, dir) => {
	let prev = Math.max(depth-1, 0)
	let {beg} = levels[depth].range
	let preBeg = time.prev(new Date(beg), prev).getTime()
	
	// levels.forEach(level => {
	// 	
	// })
	
	time.span(preBeg, beg + 1, depth, (level, t) => {
		// calculate helix
		space.calculate(level, t)
	}, (level, t, date) => {
		// create timepoints
		let p = point.make(level, date, t)
		levels[level].points.push(p)
		scene.add(p.group)
	})
}

let build = (pick, depth) => {
	if (levels[depth].points.length == 0) {
		let {beg, end} = 
		levels[depth].range = time.range(pick.getTime(), depth, 100)
		let allowed = []
		for (let i = 0; i < levels.length; i ++)
			allowed[i] = levels[i].points.length == 0
		// go through time
		time.span(beg, end, depth, (level, t) => {
			// calculate helix
			space.calculate(level, t)
		}, (level, t, date) => {
			// create timepoints
			if (allowed[level]) {
				let p = point.make(level, date, t)
				levels[level].points.push(p)
				scene.add(p.group)
			}
		})
	}
}

let camCtrl = {
	target   : new Vector3(),
	position : new Vector3(),
	up		 : new Vector3()
}

let setup = (pick, depth) => {
	let prev = Math.max(depth - 1, 0)
	let flat = time.flat(pick, prev).getTime()
	let {beg, end} = time.range(pick.getTime(), depth, 100)
	levels.forEach((level, i) => {
		level.points.forEach(point => {
			// show / hide points
			point.group.visible = 
				beg < point.t && point.t < end && 
				point.level <= depth
			// point camera
			if (i == prev && point.t == flat) {
				camCtrl.up       = point.gimble.up.clone()
				camCtrl.target   = point.gimble.position.clone()
				camCtrl.position = point.gimble.forward.clone()
					.multiplyScalar(level.scale * 10000)
					.add(point.gimble.position)
			}
		})
	})
}

let pick  = new Date(0)
let depth = 0 // goes from year(0) -> seconds(5)
build(pick, depth)

let state = true
document.addEventListener('keyup', e => {
	if (e.key == 'w') {
		depth += depth < levels.length - 1? 1: 0
		build(pick, depth)
		setup(pick, depth)
	} else if (e.key == 's') {
		depth -= depth > 0? 1: 0
		build(pick, depth)
		setup(pick, depth)
	} else if (e.key == 'a') {
		makeOne(depth, 'past')
	} else if (e.key == 'd') {
		makeOne(depth, 'future')
	}
	// debug helix
	if (e.key == 'D') {
		levels.forEach(level => {
			if (level.points.length > 0) 
				level.points.forEach(p => {
					p.debug(state)
				})
		})
		state = !state
	}
})

// let a = false
// document.body.onmousemove = e => {
// 	a = e.clientX / window.innerWidth
// }
// document.body.onclick = e => {
// 	// points.forEach(p => {
// 	// 	scene.remove(p.group)
// 	// })
// 	// build(new Date(), 2)
// 	points.forEach(p => {
// 		p.group.visible = a
// 	})
// 	a = !a
// }

loop(() => {
	// automatic camera movement
	let speed = .02
	controls.target
		.add(camCtrl.target.clone()
			.sub(controls.target)
			.multiplyScalar(speed))
	if (0) {
		let pos = camera.position.clone()
			.add(camCtrl.position.clone()
				.sub(camera.position)
				.multiplyScalar(speed))
		camera.position.set(pos.x, pos.y, pos.z)
		let up = camera.up.clone()
			.add(camCtrl.up.clone()
				.sub(camera.up)
				.multiplyScalar(speed))
		camera.up.set(up.x, up.y, up.z)
	}
	// calculate camera local axis
	let local = {}
	for (let i in world) local[i] = world[i].clone()
	local.x.applyQuaternion(camera.quaternion)
	local.y.applyQuaternion(camera.quaternion)
	local.z.applyQuaternion(camera.quaternion)
	// bildboard
	levels.forEach(level => {
		if (level.points.length > 0) 
			level.points.forEach(p => {
				p.lookAt(camera.position.clone(), local)
			})
	})
})
