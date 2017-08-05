

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	Texture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color, Group
} from 'three'

import {gimbleToMatrix} from './space'
import {levels} from './config'

export let make = (level, date, t, depth) => {
	let me = levels[level]
	let matrix = gimbleToMatrix(me)
	let group = new Group()
	let color = levels[Math.max(depth - 1, 1)].loop?
		new Color(`hsl(205, 10%, 50%)`):
		new Color(`hsl(205, 10%, 100%)`)
	//
	//
	// point 
	let circle = new Mesh(
		new CircleBufferGeometry(500, 12), 
		new MeshBasicMaterial({color}))
	// circle.geometry.colorsNeedUpdate = true
	circle.applyMatrix(matrix)
	group.add(circle)
	//
	//
	// label
	let cv = document.createElement(`canvas`)
	let ct = cv.getContext(`2d`)
	cv.height = 50
	cv.width  = 300
	if (0) {
		ct.fillStyle = `silver`
		ct.fillRect(0, 0, cv.width, cv.height)}
	ct.font         = `26pt Helvetica`
	ct.textAlign    = `left`
	ct.textBaseline = `middle`
	ct.fillStyle    = color.getHexString()
	// text
	let label = ''
	if (me.label == 'Date') {
		label = `${date.getDate()} ${me.format[date.getDay()]}`
	} else {
		let number = date[`get${me.label}`]()
		label = 
			me.format? me.format[number]: 
			level > 2? padding(number): number
	}
	ct.fillText(label, 0, cv.height / 2)
	// texture
	let texture = new Texture(cv)
	texture.needsUpdate = true
	// mesh
	let mesh = new Mesh(
		new PlaneBufferGeometry(cv.width, cv.height),
		new MeshBasicMaterial({
			map         : texture,
			side        : DoubleSide,
			transparent : true,
			blending    : CustomBlending,
			alphaTest   : 0.1
		}))
	// orientation
	let orient = new Matrix4()
		.multiply(matrix)
		.multiply(new Matrix4().makeScale(25,25,25))
		.multiply(new Matrix4().setPosition(new Vector3(cv.width/2+40,0,0)))
	mesh.applyMatrix(orient)
	group.add(mesh)
	// debug
	if (1) {
		group.add(new ArrowHelper(me.up, me.position, me.scale * 5000, 'red'))
		group.add(new ArrowHelper(me.forward, me.position, me.scale * 5000, 'green'))
	}
	return {
		group, level, t,
		gimble : {
			up       : me.up,
			forward  : me.forward,
			position : me.position,
			matrix
		},
		lookAt (position) {
			// look to camera
			circle.lookAt(position)
			// rotate to camera
			// let ray   = position.clone().sub(me.position)
			// let proj  = ray.projectOnPlane(me.forward.clone())
			// let angle = me.up.angleTo(proj)
			// let angle = Math.atan2(
			// 	camera.position.x - obj.position.x, 
			// 	camera.position.z - obj.position.z)
			// mesh.matrix = new Matrix4()
			// mesh.applyMatrix(orient.clone()
			// 	.multiply(new Matrix4().makeRotationX(angle)))
		},
		blend (a) {
			// circle.material.color.set(
			// 	color.lerp(new Color(`rgb(255,0,0)`, a)))
		}
	}
}

let padding = number => {
	let string = `${number}`
	return string.length == 1? `0${string}`: string
}
