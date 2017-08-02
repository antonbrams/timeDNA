

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	Texture, PlaneBufferGeometry, DoubleSide, CustomBlending
} from 'three'

export let make = (scene, level, date) => {
	// point 
	let circle = point(level)
	scene.add(circle)
	// text
	let label = ''
	if (level.label == 'Date') {
		label = `${date.getDate()} ${level.format[date.getDay()]}`
	} else {
		let number = date[`get${level.label}`]()
		label = level.format? level.format[number]: number
	}
	let mesh = text(level, label)
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

let point = level => {
	let geometry = new CircleBufferGeometry(level.scale * 500, 12)
	let material = new MeshBasicMaterial({color : 'black'})
	let circle = new Mesh(geometry, material)
	circle.position.set(level.position.x, level.position.y, level.position.z)
	return circle
}

let text = (level, string) => {
	let cv = document.createElement(`canvas`)
	let ct = cv.getContext(`2d`)
	cv.height = 50
	cv.width  = 300
	if (0) {
		ct.fillStyle = `silver`
		ct.fillRect(0, 0, cv.width, cv.height)
	}
	ct.font = `24pt Helvetica`
	ct.textAlign = `left`
	ct.textBaseline = `middle`
	ct.fillStyle = `black`
	ct.fillText(string, 0, cv.height / 2)
	let texture = new Texture(cv)
	texture.needsUpdate = true
	let scale = 30
	let mesh = new Mesh(
		new PlaneBufferGeometry(cv.width * scale, cv.height * scale),
		new MeshBasicMaterial({
			map         : texture,
			side        : DoubleSide,
			transparent : true,
			blending    : CustomBlending,
			alphaTest   : 0.1
		}))
	mesh.position.set(
		level.position.x + (cv.width * 1.2) * scale / 2 * level.scale, 
		level.position.y, level.position.z)
	mesh.scale.set(level.scale, level.scale, level.scale)
	return mesh
}
