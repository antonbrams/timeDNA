
import '../graphic/style.sass'
import {controls, scene, camera, loop} from './render'
import {Vector3} from 'three'
import {levels, world, params} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'
import * as travel from './travel'

// TODO: https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

let camCtrl = {
	target   : new Vector3(),
	position : new Vector3(),
	up		 : new Vector3()
}

let calc = (pick, depth) => {
	travel.doDepth(pick, depth, (p, current) => {
		if (current) {
			camCtrl.up       = p.space.y.clone()
			camCtrl.target   = p.space.p.clone()
			camCtrl.position = p.space.z.clone()
				.multiplyScalar(levels[depth].scale * 50000)
				.add(p.space.p)
		}
	})
}

let pick  = new Date()
let depth = 0 // goes from year(0) -> seconds(5)
calc(pick, depth)

let state = true
document.addEventListener('keyup', e => {
	if (e.key == 'w' || e.key == 's') {
		depth +=
			e.key == 'w' && depth < levels.length - 1? 1: 
			e.key == 's' && depth > 0? -1: 0
		calc(pick, depth)
	} else if (e.key == 'a' || e.key == 'd') {
		let next = time[e.key == 'd'? 'next':'prev']
			(pick, Math.max(depth-1, 0))
		calc(next, depth)
		pick = next
	}
	// debug helix
	if (e.key == 'D') {
		levels.forEach(level => {
			for (let i in level.points)
				level.points[i].debug(state)
		})
		state = !state
	}
})

loop(() => {
	// automatic camera movement
	let speed = .02
	controls.target
		.add(camCtrl.target.clone()
			.sub(controls.target)
			.multiplyScalar(speed))
	if (1) {
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
	let local = {}; for (let i in world)
		local[i] = world[i].clone()
			.applyQuaternion(camera.quaternion)
	// bildboard
	levels.forEach(level => {
		for (let i in level.points) {
			let p = level.points[i]
			if (p.isVisible) p.lookAt(camera.position.clone(), local)
			p.animateOpacity()
		}
	})
})
