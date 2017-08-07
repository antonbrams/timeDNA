
import {levels, world} from './config'
import {Vector3, Matrix3, Matrix4} from 'three'

// calculate helix
export let calculate = (level, t) => {
	// levels
	let me = levels[level]
	// calculate gimbles
	if (level == 0)
		me.position.z = t * me.spread
	else {
		// gain
		let prev = levels[level - 1]
		let gain = 2 * Math.PI / prev.size
		me.arch  = gain * me.radius
		// rotation
		let r = new Matrix4().makeRotationAxis(prev.forward, -gain*(t-prev.flat))
		let g = new Matrix4().makeRotationAxis(prev.up, -Math.atan(prev.arch/me.arch))
		// gimble vectors
		me.up = prev.forward.clone()
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.forward = new Vector3()
			.crossVectors(prev.up, prev.forward)
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.position = prev.up.clone()
			.applyMatrix4(r)
			.multiplyScalar(me.radius)
			.add(prev.position)
	}
}

export let vectorsToGimble = (forward, up) => {
	return {
		x : new Vector3().crossVectors(up, forward),
		y : up.clone(),
		z : forward.clone()}
} 

export let rotationsMatrix = (l, w) => {
	let m = new Matrix4(); m.set(
		w.x.dot(l.x), w.x.dot(l.y), w.x.dot(l.z), 0,
		w.y.dot(l.x), w.y.dot(l.y), w.y.dot(l.z), 0,
		w.z.dot(l.x), w.z.dot(l.y), w.z.dot(l.z), 0,
		0, 0, 0, 1)
	return m
}

export let gimbleToMatrix = level => {
	return new Matrix4()
		.makeScale(level.scale, level.scale, level.scale)
		.setPosition(level.position)
		.multiply(rotationsMatrix(
			vectorsToGimble(level.forward, level.up), world))
}
