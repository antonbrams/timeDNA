
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
		me.arch = 2 * Math.PI * me.radius / me.size
		me.up = prev.up.clone()
			.applyAxisAngle(prev.forward, - 2 * Math.PI * (t - me.flat) / me.size)
		me.forward = new Vector3()
			.crossVectors(me.up, prev.forward)
			.applyAxisAngle(me.up, - Math.atan(prev.arch / me.arch))
		me.position = me.up.clone()
			.multiplyScalar(me.radius)
			.add(prev.position)
	}
}
