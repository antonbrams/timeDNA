

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	Texture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color
} from 'three'

import {gimbleToMatrix} from './space'
import {levels} from './config'

export let make = (scene, level, date, t, pick, depth) => {
	let me = levels[level]
	let color = levels[depth-1].loop?
		new Color(`hsl(0, 0%,  0%)`):
		new Color(`hsl(0, 0%, 50%)`)
	// point 
	let circle = new Mesh(
		new CircleBufferGeometry(500, 12), 
		new MeshBasicMaterial({color}))
	circle.applyMatrix(me.matrix.position)
	scene.add(circle)
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
		.multiply(me.matrix.orientation)
	if (level == 0) orient
		.multiply(new Matrix4().makeRotationY(Math.PI * .5))
	orient
		.multiply(new Matrix4().makeScale(25,25,25))
		.multiply(new Matrix4().setPosition(new Vector3(cv.width/2+40,0,0)))
	mesh.applyMatrix(orient)
	scene.add(mesh)
	// debug
	if (0) {
		scene.add(new ArrowHelper(
			level.up, level.position, 
			level.scale * 5000, 'red'))
		scene.add(new ArrowHelper(
			level.forward, level.position, 
			level.scale * 5000, 'green'))
	}
	return circle
}

let padding = number => {
	let string = `${number}`
	return string.length == 1? `0${string}`: string
} 
