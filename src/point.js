

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	Texture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color, Group,
	SphereBufferGeometry
} from 'three'

import {gimbleToMatrix, rotationsMatrix, vectorsToGimble} from './space'
import {levels} from './config'

export let make = level => {
	let me = levels[level]
	me.x = new Vector3().crossVectors(me.y, me.z)
	let m = gimbleToMatrix(me)
	let group = new Group()
	// let color = levels[Math.max(depth - 1, 1)].loop?
	// 	new Color(`hsl(205, 10%, 50%)`):
	// 	new Color(`hsl(205, 10%, 100%)`)
	let color = new Color(`hsl(205, 10%, 50%)`)
	// point 
	let circle = new Mesh(
		new CircleBufferGeometry(300, 12), 
		new MeshBasicMaterial({color}))
	// circle.geometry.colorsNeedUpdate = true
	circle.applyMatrix(m)
	group.add(circle)
	// label
	let {mesh, canvas : cv} = label(me, level, color)
	// orientation
	let orient = m.clone()
		.multiply(new Matrix4().makeScale(25,25,25))
		.multiply(new Matrix4().setPosition(new Vector3(cv.width/2+30,0,0)))
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
		group, level, 
		gimble : {
			x : me.x.clone(),
			y : me.y.clone(),
			z : me.z.clone(),
			p : me.p.clone(), 
			m
		},
		timestamp : {
			time : me.time,
			date : me.date
		},
		lookAt (position, local) {
			// look to camera
			circle.lookAt(position)
			// make camera
			// let local = {
			// 	y : new Vector3(0,1,0).applyQuaternion(camera.quaternion),
			// 	z : me.p.clone().sub(position).normalize()
			// }
			// local.x = new Vector3().multiplyScalar(local.y, local.z)
			// rotate to camera
			let m = rotationsMatrix(local, me).elements
			let angle = Math.atan2(m[9], m[10])
			mesh.matrix = new Matrix4()
			mesh.applyMatrix(orient.clone()
				.multiply(new Matrix4().makeRotationX(-angle)))
		},
		blend (a) {
			// circle.material.color.set(
			// 	color.lerp(new Color(`rgb(255,0,0)`, a)))
		},
		debug (state) {
			helpers.forEach(helper => 
				group[state?'add':'remove'](helper))
		}
	}
}

let padding = number => {
	let string = `${number}`
	return string.length == 1? `0${string}`: string
}

let format = (me, level) => {
	let label = ''
	if (me.label == 'Date') {
		label = `${me.date.getDate()} ${me.format[me.date.getDay()]}`
	} else {
		let number = me.date[`get${me.label}`]()
		label = 
			me.format? me.format[number]: 
			level > 2? padding(number): number
	}
	return label
}

let label = (me, level, color) => {
	let cv = document.createElement(`canvas`)
	let ct = cv.getContext(`2d`)
	cv.height = 32
	cv.width  = 256
	if (0) {
		ct.fillStyle = `silver`
		ct.fillRect(0, 0, cv.width, cv.height)}
	ct.font         = `20pt Helvetica`
	ct.textAlign    = `left`
	ct.textBaseline = `middle`
	ct.fillStyle    = `#${color.getHexString()}`
	// text
	ct.fillText(format(me, level), 0, cv.height / 2)
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
	return {mesh, canvas : cv}
}
