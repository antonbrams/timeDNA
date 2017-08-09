
import '../graphic/style.sass'
import {controls, scene, camera, loop} from './render'
import {Vector3, FogExp2} from 'three'
import {levels, world, params} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'
import * as travel from './travel'

// scene.fog = new FogExp2(params.bg, 0.00001)

export let camCtrl = {
	target   : new Vector3(),
	position : new Vector3(),
	up		 : new Vector3()
}
// TODO: https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

let pick  = new Date()
let depth = 0 // goes from year(0) -> seconds(5)
travel.doDepth(pick, depth)

let state = true
document.addEventListener('keyup', e => {
	if (e.key == 'w') {
		depth += depth < levels.length - 1? 1: 0
		travel.doDepth(pick, depth)
	} else if (e.key == 's') {
		depth -= depth > 0? 1: 0
		travel.doDepth(pick, depth)
	} else if (e.key == 'a' || e.key == 'd') {
		let next = time[e.key == 'd'? 'next':'prev']
			(pick, Math.max(depth-1, 0))
		travel.doDepth(next, depth)
		pick = next
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
		for (let i in level.points)
			level.points[i].lookAt(camera.position.clone(), local)
	})
})
