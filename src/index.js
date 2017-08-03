
import '../graphic/style.sass'
import {ArrowHelper, Vector3} from 'three'
import {controls, scene, camera, loop} from './render'
import {levels} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'

let points = []

let build = (pick, depth) => {
	// prepare now
	let prev = Math.max(depth-1, 0)
	let flat = time.flat(pick, prev).getTime()
	// get range
	let ran  = time.range(depth, 100)
	let now  = pick.getTime()
	let beg  = now - ran
	let end  = now + ran
	// go through time
	time.iterate(beg, end, depth, (level, t) => {
		// calculate helix
		space.calculate(now, level, t)
		// point camera
		if (levels[prev].loop && flat == t) {
			controls.target = levels[prev].position.clone()
			let norm = levels[prev].forward.clone()
				.multiplyScalar(10000)
				.add(levels[prev].position)
			camera.position.set(norm.x, norm.y, norm.z)
		}
	}, (level, t, date) => {
		// create timepoints
		let p = point.make(level, date, t, flat, depth)
		scene.add(p.group)
		points.push(p)
	})
}

// goes from year(0) -> seconds(5)
build(new Date(), 2)

// space origin
if (0) {
	for (let i = 0; i < 3; i ++) {
		let arrowHelper = new ArrowHelper(
			new Vector3(i==0,i==1,i==2), 
			new Vector3(0, 0, 0), 100000, 
			['red', 'green', 'blue'][i])
		scene.add(arrowHelper)
	}
}

loop(() => {
	points.forEach(p => p.lookAt(camera.position))
})
