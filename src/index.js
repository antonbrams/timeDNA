
import '../graphic/style.sass'
import {controls, scene, camera, loop} from './render'
import {Vector3,
Geometry, Line, LineBasicMaterial, Color} from 'three'
import config, {levels, world} from './config'
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

let line


let calc = (pick, depth) => {
	levels[depth].graph = new Line(
		new Geometry({
			dynamic : true,
			verticesNeedUpdate : true
		}), 
		new LineBasicMaterial({
			transparent  : true,
			opacity      : 0,
			vertexColors : true,
			linewidth    : 2
		}))
	travel.doDepth(pick, depth, (p, current) => {
		if (p.time.depth == depth && p.opacity > 0) {
			let value  = Math.random()
			let height = levels[depth].radius / 4
			levels[depth].graph.geometry.vertices.push(p.space.p.clone()
				.add(p.space.x.clone()
				.multiplyScalar(height * value)))
			levels[depth].graph.geometry.colors.push(config.now.clone()
				.lerp(new Color(`rgb(255, 100, 200)`), value)
				.lerp(config.bg, 1-p.opacity))
		}
		if (current) {
			camCtrl.up       = p.space.y.clone()
			camCtrl.target   = p.space.p.clone()
			camCtrl.position = p.space.z.clone()
				.add(p.space.y.clone().multiplyScalar(.25))
				.add(p.space.x.clone().multiplyScalar(-.15))
				.multiplyScalar(levels[Math.max(depth, 1)].radius * 2.5)
				.add(p.space.p)
		}
	})
}

let pick  = new Date()
let depth = 3 // goes from year(0) -> seconds(5)

if (1)
	calc(pick, depth)
else if (0)
	setInterval(() => {
		pick  = new Date()
		calc(pick, depth)
	}, 1000)

document.addEventListener('keypress', e => {
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
	e.preventDefault()
})

loop(() => {
	// automatic camera movement
	let speed = config.camSpeed
	if (1 && camCtrl.target.distanceTo(controls.target) > 0.01) {
		controls.target
			.add(camCtrl.target.clone()
				.sub(controls.target)
				.multiplyScalar(speed))
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
	let up = new Vector3(0,1,0).applyQuaternion(camera.quaternion)
	// bildboard
	levels.forEach((level, i) => {
		if (level.graph) {
			let value = i == depth? 1: 0
			let m = level.graph.material
			m.opacity += (value - m.opacity) * .05
			scene[m.opacity > .0001?'add':'remove'](level.graph)
		}
		for (let i in level.points) {
			let p = level.points[i]
			p.animateOpacity()
			if (p.isVisible) {
				p.lookAt(camera.position.clone(), up)
				p.debug(config.debug)
			}
		}
	})
})
