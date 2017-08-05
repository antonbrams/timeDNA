
import '../graphic/style.sass'
import {ArrowHelper, Vector3} from 'three'
import {controls, scene, camera, loop} from './render'
import {levels} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'

let build = (pick, depth) => {
	if (levels[depth].points.length == 0) {
		// prepare now
		let prev = Math.max(depth - 1, 0)
		// get range
		let now = pick.getTime()
		let {beg, end} = time.range(now, depth, 100)
		let allowed = []
		for (let i = 0; i < levels.length; i ++)
			allowed[i] = levels[i].points.length == 0
		// go through time
		time.span(beg, end, depth, (level, t) => {
			// calculate helix
			space.calculate(now, level, t)
		}, (level, t, date) => {
			// create timepoints
			if (allowed[level]) {
				let p = point.make(level, date, t, depth)
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
	let now  = pick.getTime()
	let flat = time.flat(pick, prev).getTime()
	let {beg, end} = time.range(now, depth, 100)
	levels.forEach((level, i) => {
		level.points.forEach(point => {
			// show / hide points
			point.group.visible = 
				beg < point.t && point.t < end && 
				point.level <= depth
			// point camera
			if (i == prev && point.t == flat) {
				camCtrl.target   = point.gimble.position.clone()
				camCtrl.position = point.gimble.forward.clone()
					.multiplyScalar(level.scale * 30000)
					.add(point.gimble.position)
				camCtrl.up		 = new Vector3()
					.crossVectors(point.gimble.forward, point.gimble.up)
			}
		})
	})
}

let pick  = new Date(0)
let depth = 0 // goes from year(0) -> seconds(5)
build(pick, depth)

document.addEventListener('keyup', e => {
	if (e.key == 'w') {
		depth += depth < levels.length - 1? 1: 0
		build(pick, depth)
		setup(pick, depth)
	}
	if (e.key == 's') {
		depth -= depth > 0? 1: 0
		build(pick, depth)
		setup(pick, depth)
	}
	console.log(depth);
	if (e.key == 'a') console.log('test')
	if (e.key == 'd') console.log('test')
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
	levels.forEach(level => {
		if (level.points.length > 0) 
			level.points.forEach(p => {
				p.lookAt(camera.position)
			})
	})
	let speed = .02
	controls.target
		.add(camCtrl.target.clone()
			.sub(controls.target)
			.multiplyScalar(speed))
	// let pos = camera.position.clone()
	// 	.add(camCtrl.position.clone()
	// 		.sub(camera.position)
	// 		.multiplyScalar(speed))
	// camera.position.set(pos.x, pos.y, pos.z)
	// let up = camera.up.clone()
	// 	.add(camCtrl.up.clone()
	// 		.sub(camera.up)
	// 		.multiplyScalar(speed))
	// camera.up.set(up.x, up.y, up.z)
})
