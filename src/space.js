
import {levels, world} from './config'
import {Vector3, Matrix3, Matrix4} from 'three'

// calculate helix
export let calculate = (now, level, t) => {
	// levels
	let prev = levels[level - (level == 0? 0: 1)]
	let me   = levels[level]
	// calculate gimbles
	if (level == 0) {
		me.position.z = t * me.spread
	} else {
		let radius = prev.up.clone()
		let gain = 2 * Math.PI / prev.size
		me.arch = gain * me.radius
		let rotation = new Matrix4()
			.makeRotationAxis(prev.forward, - gain * (t - prev.flat))
		let pitch = new Matrix4()
			.makeRotationAxis(radius, - Math.atan(prev.arch / me.arch))
			.multiply(rotation)
		// create vectors
		me.up = prev.forward.clone()
			.applyMatrix4(pitch)
		me.forward = new Vector3()
			.crossVectors(radius, prev.forward)			
			.applyMatrix4(pitch)
		me.position = radius.clone()
			.applyMatrix4(rotation)
			.multiplyScalar(me.radius)
			.add(prev.position)
	}
}

export let gimbleToMatrix = level => {
	let local = {
		x : new Vector3().crossVectors(level.up, level.forward),
		y : level.up.clone(),
		z : level.forward.clone()
	}
	// rotation
	let orientation = new Matrix4()
	orientation.set(
		world.x.dot(local.x),
		world.x.dot(local.y),
		world.x.dot(local.z), 0,
		world.y.dot(local.x),
		world.y.dot(local.y),
		world.y.dot(local.z), 0,
		world.z.dot(local.x),
		world.z.dot(local.y),
		world.z.dot(local.z), 0,
		0, 0, 0, 1)
	// position and scale
	return new Matrix4()
		.makeScale(level.scale, level.scale, level.scale)
		.setPosition(level.position)
		.multiply(orientation)
}
