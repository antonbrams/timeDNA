

import {
	CircleBufferGeometry, MeshBasicMaterial, Mesh, ArrowHelper,
	CanvasTexture, PlaneBufferGeometry, DoubleSide, CustomBlending,
	Matrix4, Vector3, Color, Group,
	SphereBufferGeometry, Math as math
} from 'three'

import {gimbleToMatrix, rotationsMatrix, vectorsToGimble} from './space'
import {levels, params} from './config'

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
	let {mesh, canvas : cv, color : redraw} = label(me)
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
			let color = now? params.now: start? params.base: params.start
			// let distance = math.mapLinear(Math.abs(now-this.timestamp.time), 0, 3000000000000, 0, 1)
			// console.log(distance);
			// color = color.clone().lerp(params.bg, distance)
			circle.material.color = color
			redraw(color)
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
	let label = ''
	if (me.label == 'Date') {
		label = `${me.date.getDate()} ${me.format[me.date.getDay()]}`
	} else {
		let number = me.date[`get${me.label}`]()
		label = 
			me.format? me.format[number]: 
			depth > 2? padding(number): number
	}
	return label
}

let cv = document.createElement(`canvas`)
let ct = cv.getContext(`2d`)
cv.height       = 32
cv.width        = 256
ct.font         = `20pt Helvetica`
ct.textAlign    = `left`
ct.textBaseline = `middle`

let drawLabel = (mesh, string, color) => {
	setTimeout(() => {
		ct.clearRect(0,0,cv.width, cv.height)
		if (0) {
			ct.fillStyle = `silver`
			ct.fillRect(0, 0, cv.width, cv.height)}
		// text
		ct.fillStyle = `#${color.getHexString()}`
		ct.fillText(string, 0, cv.height / 2)
		// texture
		let texture   = new CanvasTexture(ct.getImageData(0,0,cv.width, cv.height))
		mesh.geometry = new PlaneBufferGeometry(cv.width, cv.height)
		mesh.material = new MeshBasicMaterial({
			map         : texture,
			transparent : true,
			blending    : CustomBlending,
			alphaTest   : 0.1
		})
	}, 0)
}

let label = me => {
	// mesh
	let mesh   = new Mesh()
	let string = format(me)
	return {
		mesh, 
		canvas : cv,
		color  : color => drawLabel(mesh, string, color)
	}
}
