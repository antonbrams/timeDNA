
import {levels} from './config'
import {Vector3} from 'three'

export let calculate = (now, level, t) => {
	// levels
	let prev = levels[level - (level == 0? 0: 1)]
	let me   = levels[level]
	// calculate gimbles
	if (level == 0) {
		me.up		= new Vector3(0,1,0)
		me.forward  = new Vector3(0,0,1)
		me.position = new Vector3(0,0,(t - now) * me.spread)
		me.arch		= me.spread
	} else {
		let pi2 = 2 * Math.PI / prev.size
		me.arch = pi2 * me.radius
		me.up = prev.up.clone()
			.applyAxisAngle(prev.forward, - pi2 * (t - prev.flat))
		me.position = me.up.clone()
			.multiplyScalar(me.radius)
			.add(prev.position)
		me.forward = new Vector3()
			.crossVectors(me.up, prev.forward)
			.applyAxisAngle(me.up, - Math.atan(prev.arch / me.arch))
	}
}
