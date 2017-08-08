

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	CanvasTexture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color, Group,
	SphereBufferGeometry, Math as math
} from 'three'

import {gimbleToMatrix, rotationsMatrix, vectorsToGimble} from './space'
import {levels, params} from './config'
import {generateMesh} from './text.js'

export let make = me => {
	// make gimble
	me.x      = new Vector3().crossVectors(me.y, me.z)
	let m     = gimbleToMatrix(me)
	let group = new Group()
	// circle
	let circle = new Mesh(new CircleBufferGeometry(300, 12))
	circle.applyMatrix(m)
	group.add(circle)
	// label
	let mesh = generateMesh(format(me))
	let orient = m.clone()
		.multiply(new Matrix4().makeScale(25,25,25))
		.multiply(new Matrix4().setPosition(new Vector3(30,0,0)))
	group.add(mesh)
	// TODO: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
	let helpers = [
		new ArrowHelper(me.y, me.p, me.scale * 5000, 'red'),
		new ArrowHelper(me.z, me.p, me.scale * 5000, 'green')]
	// let cylinder = new Mesh(
	// 	new SphereBufferGeometry(100, 32, 32),
	// 	new MeshBasicMaterial({color : 'red'}))
	// group.add(cylinder)
	return {
		group, 
		depth  : levels.indexOf(me),
		gimble : {m,
			x : me.x.clone(),
			y : me.y.clone(),
			z : me.z.clone(),
			p : me.p.clone()
		},
		timestamp : {
			time : me.time,
			date : me.date
		},
		lookAt (position, local) {
			// look to camera
			circle.lookAt(position)
			// rotate to camera
			let rotM = rotationsMatrix(local, this.gimble).elements
			let angle = Math.atan2(rotM[9], rotM[10])
			mesh.matrix = new Matrix4()
			mesh.applyMatrix(orient.clone()
				.multiply(new Matrix4().makeRotationX(-angle)))
		},
		now (now) {
			
			let start = this.depth > 0 && levels[this.depth-1].loop
			let color = now? params.now: start? params.start: params.base
			// let distance = math.mapLinear(Math.abs(now-this.timestamp.time), 0, 3000000000000, 0, 1)
			// console.log(distance);
			// color = color.clone().lerp(params.bg, distance)
			circle.material.color = color
			// redraw(color)
		},
		debug (state) {
			helpers.forEach(helper => 
				group[state?'add':'remove'](helper))
		},
	}
}

let padding = number => {
	let string = `${number}`
	return string.length == 1? `0${string}`: string
}

let format = me => {
	let depth = levels.indexOf(me)
	let out   = {}
	if (me.label == 'Month') {
		out.month = me.date.getMonth()
	} else {
		if (me.label == 'Date') {
			out.day   = me.date.getDay()
			out.digit = me.date[`get${me.label}`]()
		} else
			out.digit = padding(me.date[`get${me.label}`]())
	}
	return out
}
