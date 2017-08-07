
import {levels, world} from './config'
import {Vector3, Matrix4} from 'three'

// calculate helix
export let calculate = level => {
	// levels
	let me = levels[level]
	// calculate gimbles
	if (level == 0)
		me.p.z = me.time * me.spread
	else {
		// gain
		let prev = levels[level - 1]
		let gain = 2 * Math.PI / prev.size
		me.arch  = gain * me.radius
		// rotation
		let r = new Matrix4()
			.makeRotationAxis(prev.z, - gain * (me.time - prev.flat))
		let g = new Matrix4()
			.makeRotationAxis(prev.y, - Math.atan(prev.arch / me.arch))
		// gimble vectors
		me.y = prev.z.clone()
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.z = new Vector3()
			.crossVectors(prev.y, prev.z)
			.applyMatrix4(g)
			.applyMatrix4(r)
		me.p = prev.y.clone()
			.applyMatrix4(r)
			.multiplyScalar(me.radius)
			.add(prev.p)
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

export let gimbleToMatrix = level => {
	console.log(level);
	
	return new Matrix4()
		.makeScale(level.scale, level.scale, level.scale)
		.setPosition(level.p)
		.multiply(rotationsMatrix(level, world))
}
