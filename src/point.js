

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	CanvasTexture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color, Group,
	SphereBufferGeometry, Math as math
} from 'three'

import {gimbleToMatrix, rotationsMatrix, vectorsToGimble} from './space'
import {levels, params} from './config'
import {makeCircle, makeText} from './prerender.js'

export let make = me => {
	// make gimble
	me.x  = new Vector3().crossVectors(me.y, me.z)
	let m = gimbleToMatrix(me)
	let g = new Group()
	// circle
	let circle = makeCircle()
	circle.applyMatrix(m)
	g.add(circle)
	// label
	let text = makeText(format(me))
	g.add(text)
	// TODO: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
	let helpers = [
		new ArrowHelper(me.y, me.p, me.scale * 5000, 'red'),
		new ArrowHelper(me.z, me.p, me.scale * 5000, 'green')]
	return {
		group: g, 
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
			text.matrix = new Matrix4()
			text.applyMatrix(this.gimble.m.clone()
				.multiply(new Matrix4().makeRotationX(-angle)))
		},
		now (now) {
			let start = this.depth > 0 && levels[this.depth-1].loop
			let c = now? params.now: start? params.start: params.base
			text.material.color = c
			circle.material.color = c
			// let distance = math.mapLinear(Math.abs(now-this.timestamp.time), 0, 3000000000000, 0, 1)
			// color = color.clone().lerp(params.bg, distance)
			// circle.material.opacity = .1
			// mesh.material.opacity = .1
		},
		debug (state) {
			helpers.forEach(helper => 
				g[state?'add':'remove'](helper))
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
