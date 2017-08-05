
import {levels} from './config'
import {Vector3, Matrix4} from 'three'

// year setup
let year      = levels[0]
year.up	      = new Vector3(0,1,0)
year.forward  = new Vector3(0,0,1)
year.position = new Vector3(0,0,0)
year.arch     = levels[0].spread

// calculate helix
export let calculate = (now, level, t) => {
	// levels
	let prev = levels[level - (level == 0? 0: 1)]
	let me   = levels[level]
	// calculate gimbles
	if (level == 0) {
		me.position.z = t * me.spread
		// me.position.z = (t - now) * me.spread
	} else {
		let flip = 0.5 * Math.PI * me.flip
		let pi2  = 2.0 * Math.PI / prev.size
		me.arch  = pi2 * me.radius
		me.up = prev.up.clone()
			.applyAxisAngle(prev.forward, flip - pi2 * (t - prev.flat))
		me.position = me.up.clone()
			.multiplyScalar(me.radius)
			.add(prev.position)
		me.forward = new Vector3()
			.crossVectors(me.up, prev.forward)
			.applyAxisAngle(me.up, - Math.atan(prev.arch / me.arch))
	}
}

// world coordinates
let world = {
	x : new Vector3(1,0,0),
	y : new Vector3(0,1,0),
	z : new Vector3(0,0,1)
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
		world.x.clone().dot(local.x),
		world.x.clone().dot(local.y),
		world.x.clone().dot(local.z), 0,
		world.y.clone().dot(local.x),
		world.y.clone().dot(local.y),
		world.y.clone().dot(local.z), 0,
		world.z.clone().dot(local.x),
		world.z.clone().dot(local.y),
		world.z.clone().dot(local.z), 0,
		0, 0, 0, 1)
	let rotateZ = new Matrix4().makeRotationZ(Math.PI * .5)
	// let rotateX = new Matrix4().makeRotationX(-Math.PI * .5)
	let rotation = new Matrix4()
		.multiply(orientation)
		.multiply(rotateZ)
		// .multiply(rotateX)
	// position and scale
	let position = new Matrix4()
		.makeScale(level.scale, level.scale, level.scale)
		.setPosition(level.position)
	return position.clone().multiply(rotation)
}
