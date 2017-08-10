
import {levels, world} from './config'
import {Vector3, Matrix4} from 'three'

// set arch to year
levels[0].space.a = levels[0].spread

// calculate helix
export let buildHelix = level => {
	// levels
	let me = levels[level]
	// calculate gimbles
	if (level == 0)
		me.space.p.z = me.time.unix * me.spread
	else {
		// gain
		let prev = levels[level - 1]
		let gain = 2 * Math.PI / prev.time.size
		me.space.a = gain * me.radius
		// rotation
		let r = new Matrix4()
			.makeRotationAxis(prev.space.z, - gain * (me.time.unix - prev.time.flat))
		let g = new Matrix4()
			.makeRotationAxis(prev.space.y, - Math.atan(prev.space.a / me.space.a))
		// gimble vectors
		me.space.y = prev.space.z.clone()
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.space.z = new Vector3()
			.crossVectors(prev.space.y, prev.space.z)
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.space.p = prev.space.y.clone()
			.applyMatrix4(r)
			.multiplyScalar(me.radius)
			.add(prev.space.p)
	}
}

export let rotationsMatrix = (l, w) => {
	let m = new Matrix4(); m.set(
		w.x.dot(l.x), w.x.dot(l.y), w.x.dot(l.z), 0,
		w.y.dot(l.x), w.y.dot(l.y), w.y.dot(l.z), 0,
		w.z.dot(l.x), w.z.dot(l.y), w.z.dot(l.z), 0,
		0, 0, 0, 1)
	return m
}

export let gimbleToMatrix = (gimble, scale) => new Matrix4()
	.makeScale(scale, scale, scale)
	.setPosition(gimble.p)
	.multiply(rotationsMatrix(gimble, world))
